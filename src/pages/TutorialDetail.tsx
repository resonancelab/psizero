import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  ArrowLeft,
  CheckCircle,
  Circle,
  Play,
  Eye,
  Heart
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { useTutorials, Tutorial } from "@/hooks/useTutorials";

const TutorialDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const { getTutorialBySlug, updateViewCount } = useTutorials();

  useEffect(() => {
    const loadTutorial = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      const tutorialData = await getTutorialBySlug(slug);
      setTutorial(tutorialData);
      
      // Update view count
      if (tutorialData) {
        updateViewCount(tutorialData.id);
      }
      
      setIsLoading(false);
    };

    loadTutorial();
  }, [slug]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-50';
      case 'intermediate': return 'text-yellow-600 bg-yellow-50';  
      case 'advanced': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Tutorial Not Found</h1>
          <p className="text-muted-foreground mb-8">The tutorial you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/tutorials">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tutorials
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const steps = Array.isArray(tutorial.steps) ? tutorial.steps : [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/tutorials">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tutorials
          </Link>
        </Button>

        {/* Tutorial Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {tutorial.category_name && (
              <Badge variant="secondary">{tutorial.category_name}</Badge>
            )}
            <Badge className={getDifficultyColor(tutorial.difficulty)}>
              {tutorial.difficulty}
            </Badge>
            {tutorial.estimated_time && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {tutorial.estimated_time} min
              </Badge>
            )}
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {tutorial.title}
          </h1>
          
          {tutorial.description && (
            <p className="text-xl text-muted-foreground mb-6">
              {tutorial.description}
            </p>
          )}

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {tutorial.view_count} views
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {tutorial.likes_count} likes
            </div>
            {tutorial.published_at && (
              <div>
                Published {new Date(tutorial.published_at).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        {/* Learning Objectives */}
        {tutorial.learning_objectives && tutorial.learning_objectives.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                What You'll Learn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {tutorial.learning_objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Prerequisites */}
        {tutorial.prerequisites && tutorial.prerequisites.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Prerequisites</CardTitle>
              <CardDescription>
                Complete these tutorials before starting this one
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tutorial.prerequisites.map((prereq, index) => (
                  <Badge key={index} variant="outline">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {prereq}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tutorial Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Tutorial Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tutorial.content ? (
              <div className="prose prose-lg max-w-none">
                <pre className="whitespace-pre-wrap">{tutorial.content}</pre>
              </div>
            ) : (
              <p className="text-muted-foreground">No content available yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Steps (if available) */}
        {steps.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Step-by-Step Guide
              </CardTitle>
              <CardDescription>
                Follow these steps to complete the tutorial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <div key={step.id} className="border-l-2 border-muted pl-6 relative">
                    <div className="absolute -left-2 w-4 h-4 bg-primary rounded-full border-2 border-background"></div>
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        Step {step.step_number}: {step.title}
                      </h3>
                      {step.content && (
                        <div className="prose max-w-none">
                          <pre className="whitespace-pre-wrap text-sm">{step.content}</pre>
                        </div>
                      )}
                      {step.code_example && (
                        <div className="bg-muted p-4 rounded-md">
                          <pre className="text-sm overflow-x-auto">
                            <code>{step.code_example}</code>
                          </pre>
                        </div>
                      )}
                      {step.expected_output && (
                        <div className="bg-green-50 border border-green-200 p-3 rounded-md">
                          <p className="text-sm font-medium text-green-800 mb-1">Expected Output:</p>
                          <pre className="text-xs text-green-700">{step.expected_output}</pre>
                        </div>
                      )}
                      {step.tips && step.tips.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
                          <p className="text-sm font-medium text-blue-800 mb-2">💡 Tips:</p>
                          <ul className="text-sm text-blue-700 space-y-1">
                            {step.tips.map((tip, tipIndex) => (
                              <li key={tipIndex}>• {tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tags */}
        {tutorial.tags && tutorial.tags.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tutorial.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TutorialDetail;