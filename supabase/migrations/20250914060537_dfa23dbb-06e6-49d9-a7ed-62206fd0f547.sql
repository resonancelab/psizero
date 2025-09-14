-- Add parameters for the endpoints
INSERT INTO api_parameters (endpoint_id, name, type, required, description, example) 
SELECT 
  e.id,
  p.name,
  p.type,
  p.required,
  p.description,
  p.example::jsonb
FROM api_endpoints e
CROSS JOIN (
  VALUES 
    ('limit', 'integer', false, 'Number of items to return (max 100)', '20'),
    ('offset', 'integer', false, 'Number of items to skip', '0')
) AS p(name, type, required, description, example)
WHERE e.path IN ('/users', '/posts', '/comments');

-- Add specific parameters for user creation
INSERT INTO api_parameters (endpoint_id, name, type, required, description, example)
SELECT 
  e.id,
  p.name,
  p.type,
  p.required,
  p.description,
  p.example::jsonb
FROM api_endpoints e
CROSS JOIN (
  VALUES 
    ('name', 'string', true, 'User full name', '"John Doe"'),
    ('email', 'string', true, 'User email address', '"john@example.com"'),
    ('username', 'string', false, 'User username', '"johndoe"')
) AS p(name, type, required, description, example)
WHERE e.path = '/users' AND e.method = 'POST';

-- Add ID parameter for single user endpoint
INSERT INTO api_parameters (endpoint_id, name, type, required, description, example)
SELECT 
  e.id,
  'id',
  'string',
  true,
  'User ID',
  '"1"'::jsonb
FROM api_endpoints e
WHERE e.path = '/users/{id}' AND e.method = 'GET';