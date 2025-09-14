import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, BookOpen, Play, CheckCircle } from "lucide-react";

const Tutorials = () => {
  const tutorials = [
    {
      id: 1,
      title: "Getting Started with APIFlow",
      description: "Learn the basics of authentication, making your first API call, and understanding responses",
      difficulty: "Beginner",
      duration: "15 min",
      category: "Fundamentals",
      progress: 100,
      chapters: 5,
      students: 1284,
      icon: BookOpen
    },
    {
      id: 2,
      title: "Building a Real-time Dashboard",
      description: "Create a live dashboard using webhooks and real-time data streams",
      difficulty: "Intermediate",
      duration: "45 min",
      category: "Integration",
      progress: 60,
      chapters: 8,
      students: 892,
      icon: Play
    },
    {
      id: 3,
      title: "Advanced Authentication Patterns",
      description: "Implement OAuth flows, JWT validation, and secure API key management",
      difficulty: "Advanced",
      duration: "30 min",
      category: "Security",
      progress: 0,
      chapters: 6,
      students: 543,
      icon: CheckCircle
    },
    {
      id: 4,
      title: "Rate Limiting and Error Handling",
      description: "Best practices for handling API limits, retries, and graceful error recovery",
      difficulty: "Intermediate",
      duration: "25 min",
      category: "Best Practices",
      progress: 0,
      chapters: 4,
      students: 721,
      icon: BookOpen
    },
    {
      id: 5,
      title: "Scaling with Batch Operations",
      description: "Optimize performance using batch requests, pagination, and caching strategies",
      difficulty: "Advanced",
      duration: "40 min",
      category: "Performance",
      progress: 0,
      chapters: 7,
      students: 456,
      icon: Play
    },
    {
      id: 6,
      title: "Webhook Integration Guide",
      description: "Set up webhooks, handle events, and build event-driven applications",
      difficulty: "Intermediate",
      duration: "35 min",
      category: "Integration",
      progress: 0,
      chapters: 6,
      students: 634,
      icon: BookOpen
    }
  ];

  const categories = ["All", "Fundamentals", "Integration", "Security", "Best Practices", "Performance"];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500/10 text-green-600";
      case "Intermediate":
        return "bg-yellow-500/10 text-yellow-600";
      case "Advanced":
        return "bg-red-500/10 text-red-600";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <PageLayout>
      <Section padding="lg">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Tutorials
            </h1>
            <p className="text-muted-foreground">
              Step-by-step guides to master APIFlow integration and best practices
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === "All" ? "default" : "outline"}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Tutorial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tutorials.map((tutorial) => {
              const Icon = tutorial.icon;
              return (
                <Card key={tutorial.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{tutorial.title}</CardTitle>
                          <p className="text-muted-foreground text-sm">
                            {tutorial.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Progress Bar */}
                    {tutorial.progress > 0 && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Progress</span>
                          <span className="text-sm font-medium">{tutorial.progress}%</span>
                        </div>
                        <Progress value={tutorial.progress} className="h-2" />
                      </div>
                    )}

                    {/* Tutorial Meta */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {tutorial.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {tutorial.chapters} chapters
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {tutorial.students}
                        </div>
                      </div>
                    </div>

                    {/* Badges and Action */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Badge className={getDifficultyColor(tutorial.difficulty)}>
                          {tutorial.difficulty}
                        </Badge>
                        <Badge variant="secondary">
                          {tutorial.category}
                        </Badge>
                      </div>
                      <Button 
                        size="sm" 
                        variant={tutorial.progress > 0 ? "outline" : "default"}
                      >
                        {tutorial.progress > 0 ? "Continue" : "Start Tutorial"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Learning Path Section */}
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Learning Path</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  New to APIFlow? Follow this curated learning path to get up to speed quickly.
                </p>
                <div className="space-y-4">
                  {[
                    { step: 1, title: "Getting Started with APIFlow", completed: true },
                    { step: 2, title: "Rate Limiting and Error Handling", completed: false },
                    { step: 3, title: "Webhook Integration Guide", completed: false },
                    { step: 4, title: "Advanced Authentication Patterns", completed: false }
                  ].map((item) => (
                    <div key={item.step} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        item.completed ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {item.completed ? <CheckCircle className="h-4 w-4" /> : item.step}
                      </div>
                      <span className={item.completed ? 'text-muted-foreground line-through' : 'text-foreground'}>
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};

export default Tutorials;