import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Hash function for API keys (matching the client-side implementation)
const hashApiKey = async (apiKey: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(apiKey);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

interface ApiEndpoint {
  id: string;
  method: string;
  path: string;
  target_url: string;
  target_method: string;
  requires_auth: boolean;
  auth_type: string;
  auth_header_name: string;
  timeout_ms: number;
  rate_limit_per_minute: number;
  cost_per_request: number;
}

interface ApiKey {
  id: string;
  user_id: string;
  key_hash: string;
  is_active: boolean;
  expires_at: string | null;
}

interface ApiConfig {
  config_name: string;
  config_value: string;
  is_encrypted: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    const url = new URL(req.url);
    const apiPath = url.pathname.replace('/api-proxy', '');
    const method = req.method;
    
    // Extract API key from header
    const apiKeyHeader = req.headers.get('x-api-key');
    if (!apiKeyHeader) {
      return new Response(JSON.stringify({ error: 'API key required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate API key
    const hashedKey = await hashApiKey(apiKeyHeader);
    const { data: apiKey, error: apiKeyError } = await supabase
      .from('api_keys')
      .select('id, user_id, key_hash, is_active, expires_at')
      .eq('key_hash', hashedKey)
      .eq('is_active', true)
      .single();

    if (apiKeyError || !apiKey) {
      return new Response(JSON.stringify({ error: 'Invalid API key' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check expiration
    if (apiKey.expires_at && new Date(apiKey.expires_at) < new Date()) {
      return new Response(JSON.stringify({ error: 'API key expired' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Find matching endpoint
    const { data: endpoint, error: endpointError } = await supabase
      .from('api_endpoints')
      .select('*')
      .eq('path', apiPath)
      .eq('method', method)
      .eq('is_active', true)
      .single();

    if (endpointError || !endpoint) {
      return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check rate limiting
    if (endpoint.rate_limit_per_minute) {
      const windowStart = new Date();
      windowStart.setMinutes(windowStart.getMinutes() - 1);

      const { data: rateLimitData } = await supabase
        .from('api_rate_limits')
        .select('requests_count')
        .eq('api_key_id', apiKey.id)
        .eq('endpoint_id', endpoint.id)
        .gte('window_start', windowStart.toISOString())
        .single();

      if (rateLimitData && rateLimitData.requests_count >= endpoint.rate_limit_per_minute) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Update rate limit counter
      await supabase.from('api_rate_limits').upsert({
        api_key_id: apiKey.id,
        endpoint_id: endpoint.id,
        requests_count: (rateLimitData?.requests_count || 0) + 1,
        window_start: new Date().toISOString(),
      });
    }

    // Get target API configuration
    const { data: configs } = await supabase
      .from('api_target_configs')
      .select('config_name, config_value, is_encrypted')
      .eq('endpoint_id', endpoint.id);

    const configMap = configs?.reduce((acc, config) => {
      acc[config.config_name] = config.config_value;
      return acc;
    }, {} as Record<string, string>) || {};

    // Prepare target request
    const targetUrl = endpoint.target_url || endpoint.path;
    const targetMethod = endpoint.target_method || method;
    
    const headers: Record<string, string> = {
      'Content-Type': req.headers.get('content-type') || 'application/json',
    };

    // Add authentication if required
    if (endpoint.requires_auth && configMap.api_key) {
      if (endpoint.auth_type === 'bearer') {
        headers[endpoint.auth_header_name] = `Bearer ${configMap.api_key}`;
      } else {
        headers[endpoint.auth_header_name] = configMap.api_key;
      }
    }

    // Forward additional headers from config
    Object.keys(configMap).forEach(key => {
      if (key.startsWith('header_')) {
        const headerName = key.replace('header_', '');
        headers[headerName] = configMap[key];
      }
    });

    // Get request body if present
    let body = null;
    if (['POST', 'PUT', 'PATCH'].includes(targetMethod)) {
      body = await req.text();
    }

    const requestStartTime = Date.now();
    
    // Forward request to target API
    const targetResponse = await fetch(targetUrl, {
      method: targetMethod,
      headers,
      body,
      signal: AbortSignal.timeout(endpoint.timeout_ms || 30000),
    });

    const responseTime = Date.now() - requestStartTime;
    const responseText = await targetResponse.text();
    
    // Log usage for billing
    await supabase.from('api_usage').insert({
      user_id: apiKey.user_id,
      api_key_id: apiKey.id,
      endpoint_path: apiPath,
      method: method,
      status_code: targetResponse.status,
      response_time_ms: responseTime,
      timestamp: new Date().toISOString(),
      request_size_bytes: body?.length || 0,
      response_size_bytes: responseText.length,
      forwarded_to: targetUrl,
      cost_units: endpoint.cost_per_request || 1,
    });

    // Return response
    return new Response(responseText, {
      status: targetResponse.status,
      headers: {
        ...corsHeaders,
        'Content-Type': targetResponse.headers.get('content-type') || 'application/json',
        'X-Response-Time': `${responseTime}ms`,
      },
    });

  } catch (error) {
    console.error('API Proxy Error:', error);
    
    // Log error for monitoring
    await supabase.from('api_usage').insert({
      user_id: 'unknown',
      endpoint_path: new URL(req.url).pathname,
      method: req.method,
      status_code: 500,
      response_time_ms: 0,
      timestamp: new Date().toISOString(),
      error_message: error.message,
    });

    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});