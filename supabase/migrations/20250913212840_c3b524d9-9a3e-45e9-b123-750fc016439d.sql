-- Extend api_endpoints table to support proxy configuration
ALTER TABLE api_endpoints 
ADD COLUMN target_url TEXT,
ADD COLUMN target_method TEXT,
ADD COLUMN requires_auth BOOLEAN DEFAULT true,
ADD COLUMN auth_type TEXT DEFAULT 'bearer',
ADD COLUMN auth_header_name TEXT DEFAULT 'Authorization',
ADD COLUMN timeout_ms INTEGER DEFAULT 30000,
ADD COLUMN rate_limit_per_minute INTEGER,
ADD COLUMN cost_per_request INTEGER DEFAULT 1;

-- Create API configurations table for storing target API credentials
CREATE TABLE api_target_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_id UUID NOT NULL REFERENCES api_endpoints(id) ON DELETE CASCADE,
  config_name TEXT NOT NULL,
  config_value TEXT NOT NULL,
  is_encrypted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE api_target_configs ENABLE ROW LEVEL SECURITY;

-- Create policies for api_target_configs
CREATE POLICY "Authenticated users can manage API configs" 
ON api_target_configs 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create rate limiting table
CREATE TABLE api_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  endpoint_id UUID NOT NULL REFERENCES api_endpoints(id) ON DELETE CASCADE,
  requests_count INTEGER DEFAULT 0,
  window_start TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(api_key_id, endpoint_id, window_start)
);

-- Enable RLS
ALTER TABLE api_rate_limits ENABLE ROW LEVEL SECURITY;

-- Create policies for rate limits
CREATE POLICY "Users can view rate limits for their API keys" 
ON api_rate_limits 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM api_keys ak 
  WHERE ak.id = api_rate_limits.api_key_id 
  AND ak.user_id = auth.uid()
));

-- Update api_usage table to include more detailed tracking
ALTER TABLE api_usage 
ADD COLUMN request_size_bytes INTEGER,
ADD COLUMN response_size_bytes INTEGER,
ADD COLUMN error_message TEXT,
ADD COLUMN forwarded_to TEXT,
ADD COLUMN cost_units INTEGER DEFAULT 1;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_api_target_configs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for api_target_configs
CREATE TRIGGER update_api_target_configs_updated_at
  BEFORE UPDATE ON api_target_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_api_target_configs_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_api_rate_limits_key_endpoint ON api_rate_limits(api_key_id, endpoint_id);
CREATE INDEX idx_api_rate_limits_window_start ON api_rate_limits(window_start);
CREATE INDEX idx_api_usage_timestamp ON api_usage(timestamp);
CREATE INDEX idx_api_usage_user_id ON api_usage(user_id);
CREATE INDEX idx_api_target_configs_endpoint_id ON api_target_configs(endpoint_id);