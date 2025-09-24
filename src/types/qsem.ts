export interface ConceptNode {
  id: string;
  name: string;
  description?: string;
  type: 'entity' | 'concept' | 'relation' | 'attribute';
  embedding: number[];
  metadata: {
    frequency: number;
    importance: number;
    lastUsed: string;
    source: string[];
  };
  tags: string[];
  properties: Record<string, string | number | boolean>;
}

export interface SemanticRelation {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'is-a' | 'part-of' | 'related-to' | 'causes' | 'similar-to' | 'opposite-of';
  strength: number;
  confidence: number;
  direction: 'bidirectional' | 'unidirectional';
  metadata: {
    createdAt: string;
    source: string;
    verified: boolean;
  };
}

export interface ConceptGraph {
  id: string;
  name: string;
  description?: string;
  domain: string;
  nodes: ConceptNode[];
  relations: SemanticRelation[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: string;
    size: number;
    density: number;
  };
  status: 'building' | 'analyzing' | 'ready' | 'error';
  visibility: 'private' | 'shared' | 'public';
}

export interface SemanticProject {
  id: string;
  name: string;
  description?: string;
  type: 'knowledge-extraction' | 'similarity-analysis' | 'concept-clustering' | 'ontology-mapping';
  status: 'draft' | 'running' | 'completed' | 'failed';
  graphIds: string[];
  config: {
    vectorDimensions: number;
    similarityThreshold: number;
    clusteringAlgorithm: 'kmeans' | 'hierarchical' | 'dbscan';
    embeddingModel: 'sentence-transformer' | 'openai' | 'custom';
    quantumEnhanced: boolean;
  };
  results?: {
    clustersFound: number;
    semanticSimilarity: number;
    extractedConcepts: number;
    confidence: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface VectorStore {
  id: string;
  name: string;
  description?: string;
  type: 'faiss' | 'pinecone' | 'chroma' | 'quantum-enhanced';
  dimensions: number;
  vectorCount: number;
  indexType: 'flat' | 'ivf' | 'hnsw' | 'quantum';
  metadata: {
    createdAt: string;
    lastIndexed: string;
    size: number; // in MB
    accuracy: number;
  };
  config: {
    distanceMetric: 'cosine' | 'euclidean' | 'dot-product';
    nProbe: number;
    efSearch: number;
    quantumOptimized: boolean;
  };
  status: 'building' | 'ready' | 'indexing' | 'error';
  usedBy: string[]; // project IDs
}

export interface SemanticQuery {
  id: string;
  query: string;
  type: 'similarity' | 'concept-search' | 'relation-discovery' | 'graph-traversal';
  vectorStoreId: string;
  results: {
    matches: {
      conceptId: string;
      score: number;
      concept: ConceptNode;
    }[];
    executionTime: number;
    totalResults: number;
  };
  timestamp: string;
  userId: string;
}

export interface SemanticAnalytics {
  totalConcepts: number;
  totalRelations: number;
  totalProjects: number;
  totalVectorStores: number;
  averageGraphSize: number;
  conceptGrowth: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  topDomains: {
    domain: string;
    count: number;
  }[];
  queryStats: {
    totalQueries: number;
    averageResponseTime: number;
    popularQueryTypes: {
      type: string;
      count: number;
    }[];
  };
}