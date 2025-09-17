-- Insert initial API endpoints into the api_endpoints table
INSERT INTO public.api_endpoints (
  id, method, path, target_method, target_url, cost_per_request, 
  rate_limit_per_minute, timeout_ms, requires_auth, auth_type, auth_header_name
) VALUES 
-- SRS API
(gen_random_uuid(), 'POST', '/v1/srs/solve', 'POST', 'https://api.psizero.ai/v1/srs/solve', 10, 30, 30000, true, 'bearer', 'Authorization'),

-- HQE API
(gen_random_uuid(), 'POST', '/v1/hqe/simulate', 'POST', 'https://api.psizero.ai/v1/hqe/simulate', 8, 60, 45000, true, 'bearer', 'Authorization'),

-- QSEM APIs
(gen_random_uuid(), 'POST', '/v1/qsem/encode', 'POST', 'https://api.psizero.ai/v1/qsem/encode', 5, 120, 15000, true, 'bearer', 'Authorization'),
(gen_random_uuid(), 'POST', '/v1/qsem/resonance', 'POST', 'https://api.psizero.ai/v1/qsem/resonance', 3, 120, 15000, true, 'bearer', 'Authorization'),

-- NLC APIs
(gen_random_uuid(), 'POST', '/v1/nlc/sessions', 'POST', 'https://api.psizero.ai/v1/nlc/sessions', 15, 20, 30000, true, 'bearer', 'Authorization'),
(gen_random_uuid(), 'POST', '/v1/nlc/sessions/{id}/messages', 'POST', 'https://api.psizero.ai/v1/nlc/sessions/{id}/messages', 2, 300, 10000, true, 'bearer', 'Authorization'),

-- QCR APIs
(gen_random_uuid(), 'POST', '/v1/qcr/sessions', 'POST', 'https://api.psizero.ai/v1/qcr/sessions', 12, 30, 25000, true, 'bearer', 'Authorization'),
(gen_random_uuid(), 'POST', '/v1/qcr/sessions/{id}/observe', 'POST', 'https://api.psizero.ai/v1/qcr/sessions/{id}/observe', 8, 60, 20000, true, 'bearer', 'Authorization'),

-- I-Ching API
(gen_random_uuid(), 'POST', '/v1/iching/evolve', 'POST', 'https://api.psizero.ai/v1/iching/evolve', 4, 100, 15000, true, 'bearer', 'Authorization'),

-- Unified Physics API
(gen_random_uuid(), 'POST', '/v1/unified/gravity/compute', 'POST', 'https://api.psizero.ai/v1/unified/gravity/compute', 6, 80, 20000, true, 'bearer', 'Authorization'),

-- Webhook Management API
(gen_random_uuid(), 'POST', '/v1/webhooks', 'POST', 'https://api.psizero.ai/v1/webhooks', 1, 50, 10000, true, 'bearer', 'Authorization'),

-- OAuth2 Authentication (public endpoint)
(gen_random_uuid(), 'POST', '/oauth/token', 'POST', 'https://api.psizero.ai/oauth/token', 1, 100, 10000, false, 'none', null)

ON CONFLICT (path, method) DO NOTHING;