-- Create tables for playground examples

-- Main playground examples table
CREATE TABLE public.playground_examples (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  service text NOT NULL CHECK (service IN ('RNET', 'SAI', 'SRS', 'QLLM', 'I-Ching', 'QSEM')),
  category text NOT NULL CHECK (category IN ('tutorial', 'advanced', 'showcase', 'integration')),
  difficulty text NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_time text NOT NULL,
  tags text[] DEFAULT '{}',
  code_snippet text,
  full_code text,
  live_demo boolean DEFAULT false,
  featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  view_count integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_playground_examples_service ON public.playground_examples(service);
CREATE INDEX idx_playground_examples_category ON public.playground_examples(category);
CREATE INDEX idx_playground_examples_difficulty ON public.playground_examples(difficulty);
CREATE INDEX idx_playground_examples_featured ON public.playground_examples(featured);
CREATE INDEX idx_playground_examples_is_active ON public.playground_examples(is_active);

-- Enable RLS
ALTER TABLE public.playground_examples ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active playground examples" 
ON public.playground_examples 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Authenticated users can manage playground examples" 
ON public.playground_examples 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_playground_examples_updated_at
BEFORE UPDATE ON public.playground_examples
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial playground examples
INSERT INTO public.playground_examples (
  title, description, service, category, difficulty, estimated_time, tags, 
  code_snippet, live_demo, featured
) VALUES
-- RNET Collaborative Space
(
  'Collaborative Quantum Space',
  'Create a shared workspace for real-time quantum collaboration with multi-user resonance synchronization.',
  'RNET',
  'tutorial',
  'beginner',
  '10 minutes',
  ARRAY['collaboration', 'real-time', 'quantum-sync'],
  '// Create collaborative quantum space
const space = await rnet.createSpace({
  name: "Quantum Research Lab",
  participants: ["alice", "bob", "charlie"],
  resonanceSync: true,
  primeBasis: "fibonacci"
});

// Join the space and sync quantum states
await space.join();
await space.syncResonance();',
  true,
  true
),
-- SAI Sentiment Engine
(
  'Prime-Based Sentiment Analysis',
  'Build a symbolic AI engine that uses prime number mappings for advanced sentiment analysis.',
  'SAI',
  'showcase',
  'intermediate',
  '25 minutes',
  ARRAY['sentiment', 'prime-basis', 'nlp'],
  '// Create SAI sentiment engine
const engine = new SAI.SymbolicEngine({
  primeBasis: "ascending",
  symbolMappingSize: 10000,
  temperatureDynamics: true
});

// Train on sentiment data
await engine.train({
  dataset: "movie_reviews",
  epochs: 100,
  quantumEnhanced: true
});',
  true,
  false
),
-- SRS TSP Solver
(
  'Quantum TSP Solver',
  'Solve the Traveling Salesman Problem using quantum-enhanced symbolic resonance algorithms.',
  'SRS',
  'advanced',
  'advanced',
  '45 minutes',
  ARRAY['optimization', 'tsp', 'quantum-annealing'],
  '// Configure quantum TSP solver
const solver = new SRS.QuantumSolver({
  algorithm: "quantum_annealing",
  primeBasisSize: 23,
  resonanceThreshold: 0.95
});

// Solve TSP instance
const solution = await solver.solve({
  problem: tspInstance,
  maxIterations: 1000
});',
  true,
  true
),
-- QLLM Chatbot
(
  'Quantum-Enhanced Chatbot',
  'Fine-tune a language model with quantum processing for more coherent conversations.',
  'QLLM',
  'tutorial',
  'intermediate',
  '30 minutes',
  ARRAY['chatbot', 'fine-tuning', 'conversation'],
  '// Create quantum-enhanced LLM
const model = new QLLM.LanguageModel({
  baseModel: "gpt-4",
  quantumEnhanced: true,
  primeBasisIntegration: true
});

// Fine-tune for chatbot
await model.fineTune({
  dataset: "customer_support_conversations",
  quantumOptimization: true
});',
  true,
  false
),
-- I-Ching Oracle
(
  'Digital I-Ching Oracle',
  'Create an intelligent divination system with quantum randomness and wisdom analytics.',
  'I-Ching',
  'showcase',
  'beginner',
  '15 minutes',
  ARRAY['divination', 'quantum-random', 'wisdom'],
  '// Create quantum I-Ching consultation
const oracle = new IChing.QuantumOracle({
  method: "quantum_coins",
  enhancedInterpretation: true
});

// Perform consultation
const reading = await oracle.consult({
  question: "Should I pursue this opportunity?",
  trackOutcome: true
});',
  true,
  false
),
-- QSEM Knowledge Graph
(
  'Quantum Knowledge Graph',
  'Build a semantic knowledge graph with quantum-enhanced concept embeddings and relation discovery.',
  'QSEM',
  'advanced',
  'advanced',
  '60 minutes',
  ARRAY['knowledge-graph', 'embeddings', 'semantic-search'],
  '// Create quantum knowledge graph
const graph = new QSEM.ConceptGraph({
  domain: "medical_research",
  quantumEmbeddings: true,
  vectorDimensions: 768
});

// Add concepts and discover relations
await graph.addConcepts(medicalConcepts);
const relations = await graph.discoverRelations({
  algorithm: "quantum_clustering"
});',
  true,
  true
),
-- Multi-Service Integration
(
  'Multi-Service AI Pipeline',
  'Integrate multiple quantum services to create a comprehensive AI processing pipeline.',
  'QSEM',
  'integration',
  'advanced',
  '90 minutes',
  ARRAY['integration', 'pipeline', 'multi-service'],
  '// Multi-service AI pipeline
const pipeline = new QuantumPipeline([
  new QLLM.TextProcessor(),
  new SAI.ConceptExtractor(),
  new QSEM.KnowledgeMapper(),
  new SRS.OptimizationEngine()
]);

// Process complex data
const result = await pipeline.process(inputData);',
  false,
  true
);

-- Create a view for easy access to featured examples
CREATE VIEW public.featured_playground_examples AS
SELECT * FROM public.playground_examples
WHERE featured = true AND is_active = true
ORDER BY created_at DESC;

-- Grant access to the view
GRANT SELECT ON public.featured_playground_examples TO anon, authenticated;