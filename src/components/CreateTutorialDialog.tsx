import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useAdminTutorials, TutorialCategory } from "@/hooks/useTutorials";
import { Plus, X } from "lucide-react";

interface CreateTutorialDialogProps {
  children?: React.ReactNode;
}

export function CreateTutorialDialog({ children }: CreateTutorialDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [prerequisites, setPrerequisites] = useState<string[]>([]);
  const [prerequisiteInput, setPrerequisiteInput] = useState("");
  const [learningObjectives, setLearningObjectives] = useState<string[]>([]);
  const [objectiveInput, setObjectiveInput] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const { categories, createTutorial } = useAdminTutorials();

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const addPrerequisite = () => {
    if (prerequisiteInput.trim() && !prerequisites.includes(prerequisiteInput.trim())) {
      setPrerequisites([...prerequisites, prerequisiteInput.trim()]);
      setPrerequisiteInput("");
    }
  };

  const removePrerequisite = (prereq: string) => {
    setPrerequisites(prerequisites.filter(p => p !== prereq));
  };

  const addObjective = () => {
    if (objectiveInput.trim() && !learningObjectives.includes(objectiveInput.trim())) {
      setLearningObjectives([...learningObjectives, objectiveInput.trim()]);
      setObjectiveInput("");
    }
  };

  const removeObjective = (objective: string) => {
    setLearningObjectives(learningObjectives.filter(o => o !== objective));
  };

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setDescription("");
    setExcerpt("");
    setContent("");
    setDifficulty('beginner');
    setEstimatedTime(0);
    setCategoryId("");
    setTags([]);
    setTagInput("");
    setPrerequisites([]);
    setPrerequisiteInput("");
    setLearningObjectives([]);
    setObjectiveInput("");
    setCoverImageUrl("");
    setIsPublished(false);
    setIsFeatured(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    const tutorialData = {
      title,
      slug,
      description,
      excerpt,
      content,
      difficulty,
      estimated_time: estimatedTime || undefined,
      category_id: categoryId || undefined,
      tags: tags.length > 0 ? tags : undefined,
      prerequisites: prerequisites.length > 0 ? prerequisites : undefined,
      learning_objectives: learningObjectives.length > 0 ? learningObjectives : undefined,
      cover_image_url: coverImageUrl || undefined,
      is_published: isPublished,
      is_featured: isFeatured,
      published_at: isPublished ? new Date().toISOString() : undefined,
    };

    const result = await createTutorial(tutorialData);
    
    if (result.success) {
      setOpen(false);
      resetForm();
    }
    
    setIsCreating(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Tutorial
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Tutorial</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Getting Started with API Integration"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="getting-started-api-integration"
                pattern="[a-z0-9-]+"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Input
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short description for tutorial cards..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of what this tutorial covers..."
              rows={3}
            />
          </div>

          {/* Settings */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={difficulty} onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => setDifficulty(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated-time">Estimated Time (minutes)</Label>
              <Input
                id="estimated-time"
                type="number"
                value={estimatedTime || ""}
                onChange={(e) => setEstimatedTime(parseInt(e.target.value) || 0)}
                placeholder="15"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex space-x-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                  <span>{tag}</span>
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Prerequisites */}
          <div className="space-y-2">
            <Label>Prerequisites (Tutorial Slugs)</Label>
            <div className="flex space-x-2">
              <Input
                value={prerequisiteInput}
                onChange={(e) => setPrerequisiteInput(e.target.value)}
                placeholder="basic-setup-tutorial"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())}
              />
              <Button type="button" onClick={addPrerequisite} size="sm">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {prerequisites.map((prereq) => (
                <Badge key={prereq} variant="outline" className="flex items-center space-x-1">
                  <span>{prereq}</span>
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removePrerequisite(prereq)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="space-y-2">
            <Label>Learning Objectives</Label>
            <div className="flex space-x-2">
              <Input
                value={objectiveInput}
                onChange={(e) => setObjectiveInput(e.target.value)}
                placeholder="Learn how to authenticate API requests"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
              />
              <Button type="button" onClick={addObjective} size="sm">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {learningObjectives.map((objective) => (
                <Badge key={objective} variant="outline" className="flex items-center space-x-1">
                  <span>{objective}</span>
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeObjective(objective)} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover-image">Cover Image URL</Label>
            <Input
              id="cover-image"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="https://example.com/tutorial-cover.jpg"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content (Markdown)</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="# Tutorial Content

Write your tutorial content in Markdown format..."
              rows={10}
            />
          </div>

          {/* Publishing Options */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={isPublished}
                onCheckedChange={setIsPublished}
              />
              <Label htmlFor="published">Published</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={isFeatured}
                onCheckedChange={setIsFeatured}
              />
              <Label htmlFor="featured">Featured</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Tutorial"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}