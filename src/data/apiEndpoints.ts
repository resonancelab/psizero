export interface ApiParameter {
  name: string;
  type: 'string' | 'integer' | 'boolean' | 'array' | 'object';
  required: boolean;
  description: string;
  example?: any;
}

export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  title: string;
  description: string;
  parameters: ApiParameter[];
  category: string;
  tags: string[];
  sampleResponse?: any;
}

export const apiEndpoints: ApiEndpoint[] = [
  {
    id: "users",
    method: "GET",
    path: "/api/v1/users",
    title: "Get Users",
    description: "Retrieve a list of users with optional filtering",
    category: "users",
    tags: ["users", "list"],
    parameters: [
      { 
        name: "limit", 
        type: "integer", 
        required: false, 
        description: "Number of users to return (max 100)", 
        example: 20 
      },
      { 
        name: "offset", 
        type: "integer", 
        required: false, 
        description: "Number of users to skip", 
        example: 0 
      },
      { 
        name: "status", 
        type: "string", 
        required: false, 
        description: "Filter by user status", 
        example: "active" 
      },
    ],
    sampleResponse: {
      status: 200,
      data: {
        users: [
          {
            id: "usr_1234567890",
            name: "John Doe", 
            email: "john@example.com",
            role: "user",
            created_at: "2024-01-15T10:30:00Z",
            status: "active"
          }
        ],
        pagination: {
          total: 150,
          limit: 20,
          offset: 0,
          has_more: true
        }
      }
    }
  },
  {
    id: "user",
    method: "GET",
    path: "/api/v1/users/{id}",
    title: "Get User",
    description: "Retrieve a specific user by ID",
    category: "users",
    tags: ["users", "single"],
    parameters: [
      { 
        name: "id", 
        type: "string", 
        required: true, 
        description: "Unique user identifier", 
        example: "usr_1234567890" 
      },
    ],
    sampleResponse: {
      status: 200,
      data: {
        id: "usr_1234567890",
        name: "John Doe",
        email: "john@example.com", 
        role: "user",
        created_at: "2024-01-15T10:30:00Z",
        status: "active"
      }
    }
  },
  {
    id: "create-user",
    method: "POST",
    path: "/api/v1/users",
    title: "Create User",
    description: "Create a new user account",
    category: "users",
    tags: ["users", "create"],
    parameters: [
      { 
        name: "name", 
        type: "string", 
        required: true, 
        description: "User's full name", 
        example: "Jane Smith" 
      },
      { 
        name: "email", 
        type: "string", 
        required: true, 
        description: "User's email address", 
        example: "jane@example.com" 
      },
      { 
        name: "role", 
        type: "string", 
        required: false, 
        description: "User role (default: user)", 
        example: "user" 
      },
    ],
    sampleResponse: {
      status: 201,
      data: {
        id: "usr_0987654321",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "user", 
        created_at: "2024-01-16T14:22:00Z",
        status: "active"
      }
    }
  },
];