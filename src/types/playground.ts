export interface PlaygroundExample {
  id: string;
  title: string;
  description: string;
  service: 'RNET' | 'SAI' | 'SRS' | 'QLLM' | 'I-Ching' | 'QSEM';
  category: 'tutorial' | 'advanced' | 'showcase' | 'integration';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  tags: string[];
  codeSnippet?: string;
  fullCode?: string;
  liveDemo: boolean;
  featured: boolean;
  isActive: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface PlaygroundFilters {
  service?: string;
  category?: string;
  difficulty?: string;
  featured?: boolean;
  search?: string;
}

export interface CreatePlaygroundExampleInput {
  title: string;
  description: string;
  service: PlaygroundExample['service'];
  category: PlaygroundExample['category'];
  difficulty: PlaygroundExample['difficulty'];
  estimatedTime: string;
  tags: string[];
  codeSnippet?: string;
  fullCode?: string;
  liveDemo?: boolean;
  featured?: boolean;
}

export interface UpdatePlaygroundExampleInput extends Partial<CreatePlaygroundExampleInput> {
  isActive?: boolean;
}