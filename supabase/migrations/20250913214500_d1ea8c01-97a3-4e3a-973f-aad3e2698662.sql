-- Add unique constraint for api endpoints to prevent duplicates
ALTER TABLE api_endpoints ADD CONSTRAINT unique_endpoint_method_path UNIQUE (method, path);

-- Seed some example API endpoints for demonstration
INSERT INTO api_endpoints (method, path, title, description, category, tags, target_url, target_method, requires_auth, auth_type, auth_header_name, timeout_ms, rate_limit_per_minute, cost_per_request, sample_response) VALUES
('GET', '/users', 'Get Users', 'Retrieve a list of users with optional filtering', 'users', '{"users", "list"}', 'https://jsonplaceholder.typicode.com/users', 'GET', true, 'bearer', 'Authorization', 30000, 100, 1, '{"status": 200, "data": [{"id": 1, "name": "John Doe", "email": "john@example.com"}]}'),
('GET', '/users/{id}', 'Get User', 'Retrieve a specific user by ID', 'users', '{"users", "single"}', 'https://jsonplaceholder.typicode.com/users/1', 'GET', true, 'bearer', 'Authorization', 30000, 100, 1, '{"status": 200, "data": {"id": 1, "name": "John Doe", "email": "john@example.com"}}'),
('POST', '/users', 'Create User', 'Create a new user account', 'users', '{"users", "create"}', 'https://jsonplaceholder.typicode.com/users', 'POST', true, 'bearer', 'Authorization', 30000, 50, 2, '{"status": 201, "data": {"id": 101, "name": "Jane Doe", "email": "jane@example.com"}}'),
('GET', '/posts', 'Get Posts', 'Retrieve a list of blog posts', 'content', '{"posts", "list"}', 'https://jsonplaceholder.typicode.com/posts', 'GET', true, 'bearer', 'Authorization', 30000, 200, 1, '{"status": 200, "data": [{"id": 1, "title": "Sample Post", "body": "This is a sample post"}]}'),
('GET', '/comments', 'Get Comments', 'Retrieve comments for posts', 'content', '{"comments", "list"}', 'https://jsonplaceholder.typicode.com/comments', 'GET', false, 'none', '', 30000, 500, 1, '{"status": 200, "data": [{"id": 1, "postId": 1, "name": "Sample Comment", "body": "This is a comment"}]}')
ON CONFLICT (method, path) DO NOTHING;