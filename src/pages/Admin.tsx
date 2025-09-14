import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Code } from "lucide-react";
import { useApiEndpoints, type ApiEndpoint } from "@/hooks/useApiEndpoints";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

const Admin = () => {
  const { endpoints, isLoading, createEndpoint, updateEndpoint, deleteEndpoint } = useApiEndpoints();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEndpoint, setEditingEndpoint] = useState<ApiEndpoint | null>(null);
  const [formData, setFormData] = useState({
    method: "GET" as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    path: "",
    title: "",
    description: "",
    category: "",
    tags: "",
    sampleResponse: "",
    parameters: [] as Array<{
      name: string;
      type: 'string' | 'integer' | 'boolean' | 'array' | 'object';
      required: boolean;
      description: string;
      example: string;
    }>
  });

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET": return "bg-api-success/10 text-api-success";
      case "POST": return "bg-api-secondary/10 text-api-secondary";
      case "PUT": return "bg-api-warning/10 text-api-warning";
      case "DELETE": return "bg-destructive/10 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const resetForm = () => {
    setFormData({
      method: "GET" as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
      path: "",
      title: "",
      description: "",
      category: "",
      tags: "",
      sampleResponse: "",
      parameters: []
    });
    setEditingEndpoint(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (endpoint: ApiEndpoint) => {
    setEditingEndpoint(endpoint);
    setFormData({
      method: endpoint.method,
      path: endpoint.path,
      title: endpoint.title,
      description: endpoint.description,
      category: endpoint.category,
      tags: endpoint.tags.join(", "),
      sampleResponse: endpoint.sampleResponse ? JSON.stringify(endpoint.sampleResponse, null, 2) : "",
      parameters: endpoint.parameters.map(p => ({
        name: p.name,
        type: p.type,
        required: p.required,
        description: p.description,
        example: typeof p.example === 'string' ? p.example : JSON.stringify(p.example)
      }))
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    const endpointData = {
      method: formData.method,
      path: formData.path,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
      sampleResponse: formData.sampleResponse ? JSON.parse(formData.sampleResponse) : null,
      parameters: formData.parameters.map((p, index) => ({
        id: `temp-${index}`, // Temporary ID for new parameters
        name: p.name,
        type: p.type,
        required: p.required,
        description: p.description,
        example: p.example ? JSON.parse(p.example) : null
      }))
    };

    if (editingEndpoint) {
      await updateEndpoint(editingEndpoint.id, endpointData);
    } else {
      await createEndpoint(endpointData);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const addParameter = () => {
    setFormData({
      ...formData,
      parameters: [...formData.parameters, {
        name: "",
        type: "string",
        required: false,
        description: "",
        example: ""
      }]
    });
  };

  const updateParameter = (index: number, field: string, value: any) => {
    const updatedParameters = [...formData.parameters];
    updatedParameters[index] = { ...updatedParameters[index], [field]: value };
    setFormData({ ...formData, parameters: updatedParameters });
  };

  const removeParameter = (index: number) => {
    setFormData({
      ...formData,
      parameters: formData.parameters.filter((_, i) => i !== index)
    });
  };

  return (
    <PageLayout>
      <Section>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">API Admin</h1>
              <p className="text-xl text-muted-foreground">
                Manage API endpoints and documentation
              </p>
            </div>
            <Button onClick={openCreateDialog} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Endpoint
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="grid gap-6">
              {endpoints.map((endpoint) => (
                <Card key={endpoint.id} className="border-border hover:shadow-elegant transition-all">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={getMethodColor(endpoint.method)}>
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {endpoint.path}
                        </code>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(endpoint)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteEndpoint(endpoint.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{endpoint.title}</CardTitle>
                      <CardDescription>{endpoint.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline">{endpoint.category}</Badge>
                      {endpoint.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Parameters: {endpoint.parameters.length} | 
                      Created: {endpoint.created_at ? new Date(endpoint.created_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingEndpoint ? 'Edit API Endpoint' : 'Create New API Endpoint'}
                </DialogTitle>
                <DialogDescription>
                  {editingEndpoint ? 'Update the API endpoint details.' : 'Add a new API endpoint to the documentation.'}
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="parameters">Parameters</TabsTrigger>
                  <TabsTrigger value="response">Response</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="method">Method</Label>
                      <Select value={formData.method} onValueChange={(value: any) => setFormData({ ...formData, method: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                          <SelectItem value="PATCH">PATCH</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="path">Path</Label>
                      <Input
                        id="path"
                        value={formData.path}
                        onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                        placeholder="/api/v1/example"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Get Example Data"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe what this endpoint does..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="users, data, auth, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="api, users, list"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="parameters" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold">Parameters</h4>
                    <Button onClick={addParameter} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Parameter
                    </Button>
                  </div>

                  {formData.parameters.map((param, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={param.name}
                            onChange={(e) => updateParameter(index, 'name', e.target.value)}
                            placeholder="Parameter name"
                          />
                        </div>
                        <div>
                          <Label>Type</Label>
                          <Select
                            value={param.type}
                            onValueChange={(value) => updateParameter(index, 'type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="string">String</SelectItem>
                              <SelectItem value="integer">Integer</SelectItem>
                              <SelectItem value="boolean">Boolean</SelectItem>
                              <SelectItem value="array">Array</SelectItem>
                              <SelectItem value="object">Object</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <Label>Description</Label>
                        <Input
                          value={param.description}
                          onChange={(e) => updateParameter(index, 'description', e.target.value)}
                          placeholder="Parameter description"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 items-end">
                        <div>
                          <Label>Example (JSON)</Label>
                          <Input
                            value={param.example}
                            onChange={(e) => updateParameter(index, 'example', e.target.value)}
                            placeholder='"example value"'
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={param.required}
                              onCheckedChange={(checked) => updateParameter(index, 'required', checked)}
                            />
                            <Label>Required</Label>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeParameter(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="response" className="space-y-4">
                  <div>
                    <Label htmlFor="sampleResponse">Sample Response (JSON)</Label>
                    <Textarea
                      id="sampleResponse"
                      value={formData.sampleResponse}
                      onChange={(e) => setFormData({ ...formData, sampleResponse: e.target.value })}
                      placeholder='{"status": 200, "data": {...}}'
                      className="min-h-[200px] font-mono"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingEndpoint ? 'Update' : 'Create'} Endpoint
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Section>
    </PageLayout>
  );
};

export default Admin;