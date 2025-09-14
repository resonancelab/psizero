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
    id: "solve-3sat",
    method: "POST",
    path: "/solve/3sat",
    title: "Solve 3-SAT Problem",
    description: "Solves a 3-SAT problem using the Symbolic Resonance Transformer algorithm",
    category: "solver",
    tags: ["3sat", "np-complete", "solver"],
    parameters: [
      { 
        name: "clauses", 
        type: "array", 
        required: true, 
        description: "Array of clauses, each containing up to 3 literals (e.g., 'x1' for positive, '-x2' for negated)", 
        example: [["x1", "-x2", "x3"], ["-x1", "x2", "-x3"]]
      },
      { 
        name: "max_iterations", 
        type: "integer", 
        required: false, 
        description: "Maximum iterations for convergence (default: 1000)", 
        example: 1000 
      },
      { 
        name: "epsilon", 
        type: "string", 
        required: false, 
        description: "Entropy threshold for convergence (default: 1e-6)", 
        example: "1e-6" 
      },
    ],
    sampleResponse: {
      status: 200,
      data: {
        x1: true,
        x2: true,
        x3: false
      }
    }
  },
  {
    id: "user-quota",
    method: "GET",
    path: "/user/quota",
    title: "Get User Quota",
    description: "Retrieves the user's subscription plan and remaining request quota",
    category: "account",
    tags: ["quota", "subscription", "billing"],
    parameters: [],
    sampleResponse: {
      status: 200,
      data: {
        username: "user1",
        subscription_plan: "basic",
        requests_remaining: 100
      }
    }
  },
  {
    id: "solve-flexible",
    method: "POST", 
    path: "/solve",
    title: "Solve Custom Problem",
    description: "Flexible endpoint for solving user-defined NP-complete problems with custom encoding schemes",
    category: "solver",
    tags: ["flexible", "custom", "np-complete"],
    parameters: [
      { 
        name: "problem", 
        type: "object", 
        required: true, 
        description: "Problem definition with constraints, variables, and encoding scheme", 
        example: {
          problem_type: "3sat",
          variables: ["x1", "x2", "x3"],
          constraints: [
            {
              id: "c1",
              type: "boolean", 
              elements: ["x1", "-x2", "x3"]
            }
          ],
          encoding_scheme: {
            type: "boolean"
          }
        }
      },
      { 
        name: "config", 
        type: "object", 
        required: false, 
        description: "SRT algorithm configuration parameters", 
        example: {
          max_iterations: 1000,
          epsilon: 0.000001
        }
      },
    ],
    sampleResponse: {
      status: 200,
      data: {
        x1: true,
        x2: false,
        x3: true
      }
    }
  },
];