import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  BookOpen, 
  Plus, 
  Search, 
  MoreHorizontal,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Clock,
  Users,
  Filter
} from "lucide-react";
import { useAdminTutorials } from "@/hooks/useTutorials";
import { CreateTutorialDialog } from "@/components/CreateTutorialDialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const TutorialManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const { tutorials, categories, isLoading, updateTutorial, deleteTutorial } = useAdminTutorials();
  const { isSysadmin } = useAuth();
  const { toast } = useToast();

  if (!isSysadmin) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You need sysadmin privileges to access tutorial management.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tutorial.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tutorial.category_id === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleTogglePublished = async (id: string, currentStatus: boolean) => {
    const result = await updateTutorial(id, { 
      is_published: !currentStatus,
      published_at: !currentStatus ? new Date().toISOString() : undefined
    });
    
    if (result.success) {
      toast({
        title: "Success",
        description: `Tutorial ${!currentStatus ? 'published' : 'unpublished'} successfully`,
      });
    }
  };

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    const result = await updateTutorial(id, { is_featured: !currentStatus });
    
    if (result.success) {
      toast({
        title: "Success",
        description: `Tutorial ${!currentStatus ? 'featured' : 'unfeatured'} successfully`,
      });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      const result = await deleteTutorial(id);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Tutorial deleted successfully",
        });
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-50';
      case 'intermediate': return 'text-yellow-600 bg-yellow-50';
      case 'advanced': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            Tutorial Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage tutorials, categories, and content for your platform
          </p>
        </div>
        <CreateTutorialDialog>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Tutorial
          </Button>
        </CreateTutorialDialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tutorials</p>
                <p className="text-2xl font-bold">{tutorials.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Published</p>
                <p className="text-2xl font-bold text-green-600">
                  {tutorials.filter(t => t.is_published).length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Featured</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {tutorials.filter(t => t.is_featured).length}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">
                  {tutorials.reduce((sum, t) => sum + (t.view_count || 0), 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tutorials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tutorials Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tutorials ({filteredTutorials.length})</CardTitle>
          <CardDescription>
            Manage all tutorials, their visibility, and content
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded"></div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Views</TableHead>
                  <TableHead className="text-center">Likes</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTutorials.map((tutorial) => (
                  <TableRow key={tutorial.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium flex items-center gap-2">
                          {tutorial.title}
                          {tutorial.is_featured && (
                            <Star className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        {tutorial.excerpt && (
                          <p className="text-sm text-muted-foreground truncate max-w-md">
                            {tutorial.excerpt}
                          </p>
                        )}
                        {tutorial.estimated_time && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {tutorial.estimated_time} min
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {tutorial.category_name ? (
                        <Badge variant="secondary">{tutorial.category_name}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={getDifficultyColor(tutorial.difficulty)}>
                        {tutorial.difficulty}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {tutorial.is_published ? (
                          <Badge className="bg-green-100 text-green-800">Published</Badge>
                        ) : (
                          <Badge variant="secondary">Draft</Badge>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-center">
                      {tutorial.view_count || 0}
                    </TableCell>
                    
                    <TableCell className="text-center">
                      {tutorial.likes_count || 0}
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        {new Date(tutorial.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem
                            onClick={() => handleTogglePublished(tutorial.id, tutorial.is_published)}
                          >
                            {tutorial.is_published ? (
                              <>
                                <EyeOff className="h-4 w-4 mr-2" />
                                Unpublish
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-2" />
                                Publish
                              </>
                            )}
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem
                            onClick={() => handleToggleFeatured(tutorial.id, tutorial.is_featured)}
                          >
                            {tutorial.is_featured ? (
                              <>
                                <StarOff className="h-4 w-4 mr-2" />
                                Unfeature
                              </>
                            ) : (
                              <>
                                <Star className="h-4 w-4 mr-2" />
                                Feature
                              </>
                            )}
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem
                            onClick={() => handleDelete(tutorial.id, tutorial.title)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {filteredTutorials.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tutorials found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedCategory !== "all" 
                  ? "No tutorials match your current filters." 
                  : "Create your first tutorial to get started."}
              </p>
              <CreateTutorialDialog>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Tutorial
                </Button>
              </CreateTutorialDialog>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TutorialManagement;