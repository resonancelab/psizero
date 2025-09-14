-- Seed some example API endpoints for demonstration
INSERT INTO api_endpoints (method, path, title, description, category, tags, target_url, target_method, requires_auth, auth_type, auth_header_name, timeout_ms, rate_limit_per_minute, cost_per_request, sample_response) VALUES
('GET', '/users', 'Get Users', 'Retrieve a list of users with optional filtering', 'users', '{"users", "list"}', 'https://jsonplaceholder.typicode.com/users', 'GET', true, 'bearer', 'Authorization', 30000, 100, 1, '{"status": 200, "data": [{"id": 1, "name": "John Doe", "email": "john@example.com"}]}'),
('GET', '/users/{id}', 'Get User', 'Retrieve a specific user by ID', 'users', '{"users", "single"}', 'https://jsonplaceholder.typicode.com/users/1', 'GET', true, 'bearer', 'Authorization', 30000, 100, 1, '{"status": 200, "data": {"id": 1, "name": "John Doe", "email": "john@example.com"}}'),
('POST', '/users', 'Create User', 'Create a new user account', 'users', '{"users", "create"}', 'https://jsonplaceholder.typicode.com/users', 'POST', true, 'bearer', 'Authorization', 30000, 50, 2, '{"status": 201, "data": {"id": 101, "name": "Jane Doe", "email": "jane@example.com"}}'),
('GET', '/posts', 'Get Posts', 'Retrieve a list of blog posts', 'content', '{"posts", "list"}', 'https://jsonplaceholder.typicode.com/posts', 'GET', true, 'bearer', 'Authorization', 30000, 200, 1, '{"status": 200, "data": [{"id": 1, "title": "Sample Post", "body": "This is a sample post"}]}'),
('GET', '/comments', 'Get Comments', 'Retrieve comments for posts', 'content', '{"comments", "list"}', 'https://jsonplaceholder.typicode.com/comments', 'GET', false, 'none', '', 30000, 500, 1, '{"status": 200, "data": [{"id": 1, "postId": 1, "name": "Sample Comment", "body": "This is a comment"}]}')
ON CONFLICT (path, method) DO NOTHING;

-- Add parameters for the endpoints
INSERT INTO api_parameters (endpoint_id, name, type, required, description, example) 
SELECT 
  e.id,
  p.name,
  p.type,
  p.required,
  p.description,
  p.example
FROM api_endpoints e
CROSS JOIN (
  VALUES 
    ('limit', 'integer', false, 'Number of items to return (max 100)', '20'),
    ('offset', 'integer', false, 'Number of items to skip', '0')
) AS p(name, type, required, description, example)
WHERE e.path IN ('/users', '/posts', '/comments')
ON CONFLICT DO NOTHING;

-- Add specific parameters for user creation
INSERT INTO api_parameters (endpoint_id, name, type, required, description, example)
SELECT 
  e.id,
  p.name,
  p.type,
  p.required,
  p.description,
  p.example
FROM api_endpoints e
CROSS JOIN (
  VALUES 
    ('name', 'string', true, 'User full name', '"John Doe"'),
    ('email', 'string', true, 'User email address', '"john@example.com"'),
    ('username', 'string', false, 'User username', '"johndoe"')
) AS p(name, type, required, description, example)
WHERE e.path = '/users' AND e.method = 'POST'
ON CONFLICT DO NOTHING;

-- Add ID parameter for single user endpoint
INSERT INTO api_parameters (endpoint_id, name, type, required, description, example)
SELECT 
  e.id,
  'id',
  'string',
  true,
  'User ID',
  '"1"'
FROM api_endpoints e
WHERE e.path = '/users/{id}' AND e.method = 'GET'
ON CONFLICT DO NOTHING;