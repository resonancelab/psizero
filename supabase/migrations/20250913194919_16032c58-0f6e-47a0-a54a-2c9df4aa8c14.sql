-- Create tables for database-driven API documentation

-- Main API endpoints table
CREATE TABLE public.api_endpoints (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  method text NOT NULL CHECK (method IN ('GET', 'POST', 'PUT', 'DELETE', 'PATCH')),
  path text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  sample_response jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  is_active boolean DEFAULT true
);

-- Parameters table for API endpoints
CREATE TABLE public.api_parameters (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint_id uuid NOT NULL REFERENCES public.api_endpoints(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('string', 'integer', 'boolean', 'array', 'object')),
  required boolean NOT NULL DEFAULT false,
  description text NOT NULL,
  example jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.api_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_parameters ENABLE ROW LEVEL SECURITY;

-- RLS Policies for api_endpoints
CREATE POLICY "Anyone can view active endpoints" 
ON public.api_endpoints 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Authenticated users can manage endpoints" 
ON public.api_endpoints 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- RLS Policies for api_parameters  
CREATE POLICY "Anyone can view parameters for active endpoints" 
ON public.api_parameters 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.api_endpoints 
    WHERE id = api_parameters.endpoint_id 
    AND is_active = true
  )
);

CREATE POLICY "Authenticated users can manage parameters" 
ON public.api_parameters 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_api_endpoints_updated_at
BEFORE UPDATE ON public.api_endpoints
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data to match existing structure
INSERT INTO public.api_endpoints (method, path, title, description, category, tags, sample_response) VALUES
('GET', '/api/v1/users', 'Get Users', 'Retrieve a list of users with optional filtering', 'users', ARRAY['users', 'list'], 
 '{"status": 200, "data": {"users": [{"id": "usr_1234567890", "name": "John Doe", "email": "john@example.com", "role": "user", "created_at": "2024-01-15T10:30:00Z", "status": "active"}], "pagination": {"total": 150, "limit": 20, "offset": 0, "has_more": true}}}'::jsonb),
 
('GET', '/api/v1/users/{id}', 'Get User', 'Retrieve a specific user by ID', 'users', ARRAY['users', 'single'],
 '{"status": 200, "data": {"id": "usr_1234567890", "name": "John Doe", "email": "john@example.com", "role": "user", "created_at": "2024-01-15T10:30:00Z", "status": "active"}}'::jsonb),
 
('POST', '/api/v1/users', 'Create User', 'Create a new user account', 'users', ARRAY['users', 'create'],
 '{"status": 201, "data": {"id": "usr_0987654321", "name": "Jane Smith", "email": "jane@example.com", "role": "user", "created_at": "2024-01-16T14:22:00Z", "status": "active"}}'::jsonb);

-- Insert sample parameters
INSERT INTO public.api_parameters (endpoint_id, name, type, required, description, example)
SELECT 
  e.id,
  'limit',
  'integer',
  false,
  'Number of users to return (max 100)',
  '20'::jsonb
FROM public.api_endpoints e WHERE e.path = '/api/v1/users';

INSERT INTO public.api_parameters (endpoint_id, name, type, required, description, example)
SELECT 
  e.id,
  'offset', 
  'integer',
  false,
  'Number of users to skip',
  '0'::jsonb
FROM public.api_endpoints e WHERE e.path = '/api/v1/users';

INSERT INTO public.api_parameters (endpoint_id, name, type, required, description, example)
SELECT 
  e.id,
  'status',
  'string',
  false,
  'Filter by user status',
  '"active"'::jsonb
FROM public.api_endpoints e WHERE e.path = '/api/v1/users';

INSERT INTO public.api_parameters (endpoint_id, name, type, required, description, example)
SELECT 
  e.id,
  'id',
  'string', 
  true,
  'Unique user identifier',
  '"usr_1234567890"'::jsonb
FROM public.api_endpoints e WHERE e.path = '/api/v1/users/{id}';

INSERT INTO public.api_parameters (endpoint_id, name, type, required, description, example)
SELECT 
  e.id,
  'name',
  'string',
  true,
  'User''s full name',
  '"Jane Smith"'::jsonb
FROM public.api_endpoints e WHERE e.path = '/api/v1/users' AND e.method = 'POST';

INSERT INTO public.api_parameters (endpoint_id, name, type, required, description, example)
SELECT 
  e.id,
  'email',
  'string',
  true,
  'User''s email address', 
  '"jane@example.com"'::jsonb
FROM public.api_endpoints e WHERE e.path = '/api/v1/users' AND e.method = 'POST';

INSERT INTO public.api_parameters (endpoint_id, name, type, required, description, example)
SELECT 
  e.id,
  'role',
  'string',
  false,
  'User role (default: user)',
  '"user"'::jsonb
FROM public.api_endpoints e WHERE e.path = '/api/v1/users' AND e.method = 'POST';