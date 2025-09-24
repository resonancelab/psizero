/**
 * API Proxy Configuration for Production
 *
 * This file demonstrates how to set up API proxying for production deployments
 * to avoid CORS issues and add additional security layers.
 */

export interface ProxyConfig {
  enabled: boolean;
  baseUrl: string;
  endpoints: {
    [key: string]: string;
  };
  rateLimit: {
    requests: number;
    windowMs: number;
  };
  cache: {
    enabled: boolean;
    ttl: number;
  };
}

// Production proxy configuration
export const productionProxyConfig: ProxyConfig = {
  enabled: true,
  baseUrl: '/api/proxy',
  endpoints: {
    hqe: '/api/proxy/hqe',
    qsem: '/api/proxy/qsem',
    iching: '/api/proxy/iching',
    nlc: '/api/proxy/nlc',
    unified: '/api/proxy/unified'
  },
  rateLimit: {
    requests: 1000,
    windowMs: 3600000 // 1 hour
  },
  cache: {
    enabled: true,
    ttl: 300000 // 5 minutes
  }
};

// Development proxy configuration
export const developmentProxyConfig: ProxyConfig = {
  enabled: false,
  baseUrl: 'https://sandbox.psizero.dev',
  endpoints: {
    hqe: 'https://sandbox.psizero.dev/v1/hqe',
    qsem: 'https://sandbox.psizero.dev/v1/qsem',
    iching: 'https://sandbox.psizero.dev/v1/iching',
    nlc: 'https://sandbox.psizero.dev/v1/nlc',
    unified: 'https://sandbox.psizero.dev/v1/unified'
  },
  rateLimit: {
    requests: 100,
    windowMs: 3600000
  },
  cache: {
    enabled: false,
    ttl: 0
  }
};

// Get current proxy configuration based on environment
export const getProxyConfig = (): ProxyConfig => {
  const isProduction = process.env.NODE_ENV === 'production';
  return isProduction ? productionProxyConfig : developmentProxyConfig;
};

/**
 * Example Next.js API route for proxying requests:
 *
 * // pages/api/proxy/[...slug].ts
 * import { NextApiRequest, NextApiResponse } from 'next';
 * import { getProxyConfig } from '@/lib/api/proxy';
 *
 * export default async function handler(req: NextApiRequest, res: NextApiResponse) {
 *   const config = getProxyConfig();
 *
 *   if (!config.enabled) {
 *     return res.status(404).json({ error: 'Proxy not enabled' });
 *   }
 *
 *   const { slug } = req.query;
 *   const endpoint = Array.isArray(slug) ? slug.join('/') : slug;
 *
 *   try {
 *     // Validate API key from request headers
 *     const apiKey = req.headers['x-api-key'] as string;
 *     if (!apiKey) {
 *       return res.status(401).json({ error: 'API key required' });
 *     }
 *
 *     // Check rate limits (implement your own rate limiting logic)
 *     // const rateLimitResult = await checkRateLimit(apiKey, config.rateLimit);
 *     // if (!rateLimitResult.allowed) {
 *     //   return res.status(429).json({ error: 'Rate limit exceeded' });
 *     // }
 *
 *     // Check cache (implement your own caching logic)
 *     // if (config.cache.enabled) {
 *     //   const cached = await getCache(endpoint);
 *     //   if (cached) return res.status(200).json(cached);
 *     // }
 *
 *     // Forward request to PsiZero API
 *     const apiUrl = `${config.baseUrl}/v1/${endpoint}`;
 *     const response = await fetch(apiUrl, {
 *       method: req.method,
 *       headers: {
 *         'Content-Type': 'application/json',
 *         'X-API-Key': apiKey,
 *         ...req.headers
 *       },
 *       body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
 *     });
 *
 *     const data = await response.json();
 *
 *     // Cache successful responses
 *     // if (config.cache.enabled && response.ok) {
 *     //   await setCache(endpoint, data, config.cache.ttl);
 *     // }
 *
 *     res.status(response.status).json(data);
 *   } catch (error) {
 *     console.error('Proxy error:', error);
 *     res.status(500).json({ error: 'Internal server error' });
 *   }
 * }
 */

/**
 * Example Express.js middleware for API proxying:
 *
 * // server.js or middleware/proxy.js
 * const express = require('express');
 * const { createProxyMiddleware } = require('http-proxy-middleware');
 * const { getProxyConfig } = require('./lib/api/proxy');
 *
 * const config = getProxyConfig();
 *
 * if (config.enabled) {
 *   app.use('/api/proxy', createProxyMiddleware({
 *     target: config.baseUrl,
 *     changeOrigin: true,
 *     pathRewrite: {
 *       '^/api/proxy': '/v1'
 *     },
 *     onProxyReq: (proxyReq, req) => {
 *       // Add API key from user session
 *       const apiKey = req.session.apiKey || req.headers['x-api-key'];
 *       if (apiKey) {
 *         proxyReq.setHeader('X-API-Key', apiKey);
 *       }
 *     },
 *     onProxyRes: (proxyRes, req, res) => {
 *       // Add CORS headers
 *       res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
 *       res.setHeader('Access-Control-Allow-Headers', 'X-API-Key, Content-Type');
 *     }
 *   }));
 * }
 */

/**
 * Environment Variables for Production:
 *
 * # API Configuration
 * REACT_APP_API_BASE_URL=https://api.psizero.dev
 * REACT_APP_API_PROXY_ENABLED=true
 *
 * # Rate Limiting
 * API_RATE_LIMIT_REQUESTS=1000
 * API_RATE_LIMIT_WINDOW_MS=3600000
 *
 * # Caching
 * API_CACHE_ENABLED=true
 * API_CACHE_TTL=300000
 *
 * # CORS
 * API_CORS_ORIGIN=https://yourdomain.com
 *
 * # Security
 * API_KEY_ENCRYPTION_KEY=your-encryption-key
 * API_RATE_LIMIT_REDIS_URL=redis://localhost:6379
 */

export {};