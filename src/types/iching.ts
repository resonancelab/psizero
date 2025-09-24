export interface Hexagram {
  id: string;
  number: number;
  name: string;
  chineseName: string;
  symbol: string;
  trigrams: {
    upper: string;
    lower: string;
  };
  judgment: string;
  image: string;
  changingLines?: {
    [key: number]: string;
  };
  tags: string[];
}

export interface Consultation {
  id: string;
  question: string;
  timestamp: string;
  method: 'coins' | 'yarrow' | 'random' | 'manual';
  hexagram: {
    primary: Hexagram;
    changing?: Hexagram;
    changingLines: number[];
  };
  interpretation: {
    summary: string;
    guidance: string;
    timeframe: string;
    confidence: number;
  };
  tags: string[];
  isPrivate: boolean;
  outcome?: {
    followUp: string;
    accuracy: number;
    addedAt: string;
  };
}

export interface ConsultationSession {
  id: string;
  title: string;
  description?: string;
  consultations: string[];
  createdAt: string;
  updatedAt: string;
  theme: string;
  status: 'active' | 'completed' | 'archived';
}

export interface WisdomInsight {
  id: string;
  hexagramId: string;
  insight: string;
  category: 'business' | 'personal' | 'relationships' | 'health' | 'spiritual';
  relevance: number;
  source: 'traditional' | 'modern' | 'ai-generated';
  createdAt: string;
  upvotes: number;
  downvotes: number;
}

export interface ConsultationStats {
  totalConsultations: number;
  thisWeek: number;
  thisMonth: number;
  averagePerDay: number;
  mostFrequentHexagrams: {
    hexagram: Hexagram;
    count: number;
  }[];
  accuracyRate: number;
  topTags: string[];
}

export interface DivinationMethod {
  id: string;
  name: string;
  description: string;
  complexity: 'simple' | 'medium' | 'advanced';
  traditionLevel: 'modern' | 'traditional' | 'ancient';
  timeRequired: number; // in minutes
  accuracy: number;
  isQuantumEnhanced: boolean;
}