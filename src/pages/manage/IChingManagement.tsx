import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import {
  Circle,
  Plus,
  Eye,
  BarChart3,
  Clock,
  Target,
  Star,
  TrendingUp,
  BookOpen,
  Sparkles,
  Zap,
  Brain,
  Calendar,
  Tag,
  Users,
  Award
} from 'lucide-react';
import { Consultation, ConsultationSession, ConsultationStats, Hexagram } from "@/types/iching";

const IChingManagement = () => {
  const { toast } = useToast();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [sessions, setSessions] = useState<ConsultationSession[]>([]);
  const [stats, setStats] = useState<ConsultationStats | null>(null);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data initialization
  useEffect(() => {
    const mockConsultations: Consultation[] = [
      {
        id: 'consultation_1',
        question: 'Should I pursue this new business opportunity?',
        timestamp: '2024-01-20T10:30:00Z',
        method: 'coins',
        hexagram: {
          primary: {
            id: 'hex_1',
            number: 1,
            name: 'The Creative',
            chineseName: '乾',
            symbol: '☰',
            trigrams: { upper: '☰', lower: '☰' },
            judgment: 'The Creative works sublime success, furthering through perseverance.',
            image: 'The movement of heaven is full of power.',
            tags: ['leadership', 'creativity', 'initiative']
          },
          changingLines: [1, 4]
        },
        interpretation: {
          summary: 'Strong creative energy favors new ventures',
          guidance: 'This is an auspicious time for leadership and initiative. The creative force is strong.',
          timeframe: '3-6 months',
          confidence: 0.87
        },
        tags: ['business', 'opportunity', 'leadership'],
        isPrivate: false,
        outcome: {
          followUp: 'Started the business, initial success exceeded expectations',
          accuracy: 0.92,
          addedAt: '2024-01-25T15:00:00Z'
        }
      },
      {
        id: 'consultation_2',
        question: 'How should I approach the relationship difficulties?',
        timestamp: '2024-01-18T14:15:00Z',
        method: 'yarrow',
        hexagram: {
          primary: {
            id: 'hex_8',
            number: 8,
            name: 'Holding Together',
            chineseName: '比',
            symbol: '☵',
            trigrams: { upper: '☵', lower: '☷' },
            judgment: 'Holding together brings good fortune.',
            image: 'On the earth is water: the image of holding together.',
            tags: ['unity', 'cooperation', 'relationships']
          },
          changingLines: [2, 5]
        },
        interpretation: {
          summary: 'Unity and cooperation will resolve difficulties',
          guidance: 'Seek common ground and work together toward shared goals.',
          timeframe: '1-2 months',
          confidence: 0.74
        },
        tags: ['relationships', 'cooperation', 'healing'],
        isPrivate: true
      },
      {
        id: 'consultation_3',
        question: 'What is the best timing for launching the project?',
        timestamp: '2024-01-15T09:45:00Z',
        method: 'random',
        hexagram: {
          primary: {
            id: 'hex_25',
            number: 25,
            name: 'Innocence',
            chineseName: '無妄',
            symbol: '☰',
            trigrams: { upper: '☰', lower: '☳' },
            judgment: 'Innocence. Supreme success. Perseverance furthers.',
            image: 'Under heaven thunder rolls.',
            tags: ['timing', 'natural-flow', 'authenticity']
          },
          changingLines: [3]
        },
        interpretation: {
          summary: 'Follow natural timing rather than forcing outcomes',
          guidance: 'Wait for the right moment when conditions naturally align.',
          timeframe: '2-4 weeks',
          confidence: 0.81
        },
        tags: ['timing', 'project', 'patience'],
        isPrivate: false
      }
    ];

    const mockSessions: ConsultationSession[] = [
      {
        id: 'session_1',
        title: 'Business Strategy Session',
        description: 'Exploring various business decisions and opportunities',
        consultations: ['consultation_1', 'consultation_3'],
        createdAt: '2024-01-15T08:00:00Z',
        updatedAt: '2024-01-20T11:00:00Z',
        theme: 'business',
        status: 'active'
      },
      {
        id: 'session_2',
        title: 'Personal Relationships',
        description: 'Understanding relationship dynamics and healing',
        consultations: ['consultation_2'],
        createdAt: '2024-01-18T13:00:00Z',
        updatedAt: '2024-01-18T15:00:00Z',
        theme: 'relationships',
        status: 'completed'
      }
    ];

    const mockStats: ConsultationStats = {
      totalConsultations: 47,
      thisWeek: 8,
      thisMonth: 23,
      averagePerDay: 1.2,
      mostFrequentHexagrams: [
        {
          hexagram: {
            id: 'hex_1',
            number: 1,
            name: 'The Creative',
            chineseName: '乾',
            symbol: '☰',
            trigrams: { upper: '☰', lower: '☰' },
            judgment: 'The Creative works sublime success',
            image: 'The movement of heaven is full of power',
            tags: ['leadership', 'creativity']
          },
          count: 7
        },
        {
          hexagram: {
            id: 'hex_8',
            number: 8,
            name: 'Holding Together',
            chineseName: '比',
            symbol: '☵',
            trigrams: { upper: '☵', lower: '☷' },
            judgment: 'Holding together brings good fortune',
            image: 'On the earth is water',
            tags: ['unity', 'cooperation']
          },
          count: 5
        }
      ],
      accuracyRate: 0.84,
      topTags: ['business', 'relationships', 'timing', 'leadership', 'cooperation']
    };

    setTimeout(() => {
      setConsultations(mockConsultations);
      setSessions(mockSessions);
      setStats(mockStats);
      setSelectedConsultation(mockConsultations[0]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleNewConsultation = () => {
    toast({
      title: "Feature Coming Soon",
      description: "New consultation wizard will be available in the next update.",
    });
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'coins':
        return <Badge className="bg-amber-500">Coins</Badge>;
      case 'yarrow':
        return <Badge className="bg-green-500">Yarrow</Badge>;
      case 'random':
        return <Badge className="bg-blue-500">Random</Badge>;
      case 'manual':
        return <Badge variant="outline">Manual</Badge>;
      default:
        return <Badge variant="secondary">{method}</Badge>;
    }
  };

  const getSessionStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Completed</Badge>;
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <Section>
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-64 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </Section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Section>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center gap-3">
                  <Circle className="h-10 w-10 text-purple-600" />
                  I-Ching Management
                </h1>
                <p className="text-xl text-muted-foreground">
                  Track oracle consultations, analyze hexagram patterns, and gain wisdom insights through ancient divination.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Hexagram Library
                </Button>
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600" onClick={handleNewConsultation}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Consultation
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="consultations" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="consultations">Consultations</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="wisdom">Wisdom</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="consultations" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {consultations.map((consultation) => (
                  <Card key={consultation.id} className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setSelectedConsultation(consultation)}>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-600/5" />
                    <CardHeader className="relative">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="text-2xl">{consultation.hexagram.primary.symbol}</div>
                          <div>
                            <CardTitle className="text-sm font-medium">
                              {consultation.hexagram.primary.name}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">
                              #{consultation.hexagram.primary.number}
                            </p>
                          </div>
                        </div>
                        {getMethodBadge(consultation.method)}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {consultation.question}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Guidance:</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {consultation.interpretation.guidance}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Confidence</p>
                          <div className="flex items-center gap-2">
                            <Progress value={consultation.interpretation.confidence * 100} className="flex-1 h-2" />
                            <span className="text-xs font-medium">
                              {(consultation.interpretation.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Timeframe</p>
                          <p className="font-semibold">{consultation.interpretation.timeframe}</p>
                        </div>
                      </div>

                      {consultation.outcome && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Award className="h-4 w-4 text-green-600" />
                            <span className="text-xs font-medium text-green-700 dark:text-green-400">
                              Outcome Tracked
                            </span>
                          </div>
                          <p className="text-xs text-green-600 dark:text-green-300">
                            Accuracy: {(consultation.outcome.accuracy * 100).toFixed(0)}%
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1">
                        {consultation.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {consultation.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{consultation.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1" onClick={(e) => {
                          e.stopPropagation();
                        }}>
                          <Eye className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                        <Button size="sm" variant="outline" onClick={(e) => {
                          e.stopPropagation();
                        }}>
                          <Tag className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="sessions" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {sessions.map((session) => (
                  <Card key={session.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{session.title}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {session.description}
                          </CardDescription>
                        </div>
                        {getSessionStatusBadge(session.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Consultations</p>
                          <p className="font-semibold">{session.consultations.length}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Theme</p>
                          <Badge variant="outline" className="capitalize">{session.theme}</Badge>
                        </div>
                      </div>

                      <div className="text-sm">
                        <p className="text-muted-foreground">Created</p>
                        <p className="font-medium">{new Date(session.createdAt).toLocaleDateString()}</p>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View Session
                        </Button>
                        <Button size="sm" variant="outline">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="wisdom" className="space-y-6">
              <Card>
                <CardContent className="py-8 text-center">
                  <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Wisdom insights and interpretations will be available here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              {stats && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Consultations</p>
                          <p className="text-2xl font-bold">{stats.totalConsultations}</p>
                        </div>
                        <BookOpen className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">This Week</p>
                          <p className="text-2xl font-bold text-blue-600">{stats.thisWeek}</p>
                        </div>
                        <Calendar className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Accuracy Rate</p>
                          <p className="text-2xl font-bold text-green-600">
                            {(stats.accuracyRate * 100).toFixed(0)}%
                          </p>
                        </div>
                        <Target className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Daily Average</p>
                          <p className="text-2xl font-bold text-purple-600">{stats.averagePerDay}</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {stats && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        Most Frequent Hexagrams
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {stats.mostFrequentHexagrams.map((item, index) => (
                        <div key={item.hexagram.id} className="flex items-center gap-3">
                          <div className="text-2xl">{item.hexagram.symbol}</div>
                          <div className="flex-1">
                            <p className="font-medium">{item.hexagram.name}</p>
                            <p className="text-sm text-muted-foreground">#{item.hexagram.number}</p>
                          </div>
                          <Badge variant="secondary">{item.count} times</Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5" />
                        Popular Topics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {stats.topTags.map((tag) => (
                          <Badge key={tag} variant="outline" className="capitalize">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </Section>
    </PageLayout>
  );
};

export default IChingManagement;