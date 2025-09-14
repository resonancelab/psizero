import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, ExternalLink } from "lucide-react";
import CodeBlock from "@/components/ui/code-block";

const Examples = () => {
  const languages = [
    { id: "javascript", name: "JavaScript", icon: "🟨" },
    { id: "python", name: "Python", icon: "🐍" },
    { id: "php", name: "PHP", icon: "🐘" },
    { id: "go", name: "Go", icon: "🔷" },
    { id: "java", name: "Java", icon: "☕" },
    { id: "ruby", name: "Ruby", icon: "💎" }
  ];

  const examples = {
    javascript: {
      auth: `// Authentication
const apiKey = 'your-api-key';
const headers = {
  'Authorization': \`Bearer \${apiKey}\`,
  'Content-Type': 'application/json'
};

// Make authenticated request
fetch('https://api.apiflow.com/v1/users', { headers })
  .then(response => response.json())
  .then(data => console.log(data));`,
      
      crud: `// Create a new resource
const createUser = async (userData) => {
  const response = await fetch('https://api.apiflow.com/v1/users', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${apiKey}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  return response.json();
};

// Get user by ID
const getUser = async (userId) => {
  const response = await fetch(\`https://api.apiflow.com/v1/users/\${userId}\`, {
    headers: { 'Authorization': \`Bearer \${apiKey}\` }
  });
  return response.json();
};`,
      
      pagination: `// Handle paginated results
const getAllUsers = async (page = 1, limit = 10) => {
  const response = await fetch(
    \`https://api.apiflow.com/v1/users?page=\${page}&limit=\${limit}\`,
    { headers: { 'Authorization': \`Bearer \${apiKey}\` } }
  );
  
  const data = await response.json();
  return {
    users: data.data,
    pagination: {
      total: data.total,
      page: data.page,
      hasNext: data.hasNext
    }
  };
};`
    },
    python: {
      auth: `# Authentication
import requests

api_key = "your-api-key"
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

# Make authenticated request
response = requests.get("https://api.apiflow.com/v1/users", headers=headers)
data = response.json()
print(data)`,
      
      crud: `# Create a new resource
def create_user(user_data):
    response = requests.post(
        "https://api.apiflow.com/v1/users",
        headers=headers,
        json=user_data
    )
    return response.json()

# Get user by ID
def get_user(user_id):
    response = requests.get(
        f"https://api.apiflow.com/v1/users/{user_id}",
        headers=headers
    )
    return response.json()`,
      
      pagination: `# Handle paginated results
def get_all_users(page=1, limit=10):
    response = requests.get(
        f"https://api.apiflow.com/v1/users?page={page}&limit={limit}",
        headers=headers
    )
    
    data = response.json()
    return {
        "users": data["data"],
        "pagination": {
            "total": data["total"],
            "page": data["page"],
            "has_next": data["hasNext"]
        }
    }`
    }
  };

  return (
    <PageLayout>
      <Section padding="lg">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Code Examples
            </h1>
            <p className="text-muted-foreground">
              Language-specific implementation guides and working code examples
            </p>
          </div>

          <Tabs defaultValue="javascript" className="space-y-8">
            <TabsList className="grid grid-cols-6 w-full">
              {languages.map((lang) => (
                <TabsTrigger key={lang.id} value={lang.id} className="flex items-center gap-2">
                  <span>{lang.icon}</span>
                  <span className="hidden sm:inline">{lang.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {languages.map((lang) => (
              <TabsContent key={lang.id} value={lang.id} className="space-y-6">
                <div className="grid gap-6">
                  {/* Authentication Example */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          Authentication
                          <Badge variant="secondary">Basic</Badge>
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language={lang.name.toLowerCase()}
                        code={examples[lang.id]?.auth || examples.javascript.auth}
                      />
                    </CardContent>
                  </Card>

                  {/* CRUD Operations Example */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          CRUD Operations
                          <Badge variant="secondary">Intermediate</Badge>
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language={lang.name.toLowerCase()}
                        code={examples[lang.id]?.crud || examples.javascript.crud}
                      />
                    </CardContent>
                  </Card>

                  {/* Pagination Example */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          Pagination
                          <Badge variant="secondary">Advanced</Badge>
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        language={lang.name.toLowerCase()}
                        code={examples[lang.id]?.pagination || examples.javascript.pagination}
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Getting Started Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Need More Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Looking for more comprehensive guides or having trouble with implementation?
              </p>
              <div className="flex gap-3">
                <Button variant="outline">
                  View Tutorials
                </Button>
                <Button variant="outline">
                  API Playground
                </Button>
                <Button>
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </PageLayout>
  );
};

export default Examples;