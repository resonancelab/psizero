-- Create API configurations table for storing target API credentials (if not exists)
CREATE TABLE IF NOT EXISTS api_target_configs (
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
DROP POLICY IF EXISTS "Authenticated users can manage API configs" ON api_target_configs;
CREATE POLICY "Authenticated users can manage API configs" 
ON api_target_configs 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create rate limiting table (if not exists)
CREATE TABLE IF NOT EXISTS api_rate_limits (
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
DROP POLICY IF EXISTS "Users can view rate limits for their API keys" ON api_rate_limits;
CREATE POLICY "Users can view rate limits for their API keys" 
ON api_rate_limits 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM api_keys ak 
  WHERE ak.id = api_rate_limits.api_key_id 
  AND ak.user_id = auth.uid()
));

-- Add new columns to api_usage table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'api_usage' AND column_name = 'request_size_bytes') THEN
    ALTER TABLE api_usage ADD COLUMN request_size_bytes INTEGER;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'api_usage' AND column_name = 'response_size_bytes') THEN
    ALTER TABLE api_usage ADD COLUMN response_size_bytes INTEGER;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'api_usage' AND column_name = 'error_message') THEN
    ALTER TABLE api_usage ADD COLUMN error_message TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'api_usage' AND column_name = 'forwarded_to') THEN
    ALTER TABLE api_usage ADD COLUMN forwarded_to TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'api_usage' AND column_name = 'cost_units') THEN
    ALTER TABLE api_usage ADD COLUMN cost_units INTEGER DEFAULT 1;
  END IF;
END $$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_api_target_configs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for api_target_configs
DROP TRIGGER IF EXISTS update_api_target_configs_updated_at ON api_target_configs;
CREATE TRIGGER update_api_target_configs_updated_at
  BEFORE UPDATE ON api_target_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_api_target_configs_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_key_endpoint ON api_rate_limits(api_key_id, endpoint_id);
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_window_start ON api_rate_limits(window_start);
CREATE INDEX IF NOT EXISTS idx_api_usage_timestamp ON api_usage(timestamp);
CREATE INDEX IF NOT EXISTS idx_api_usage_user_id ON api_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_api_target_configs_endpoint_id ON api_target_configs(endpoint_id);