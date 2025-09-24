import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Brain,
  Zap,
  Send,
  RotateCcw,
  Download,
  Copy,
  Sparkles,
  Atom,
  Waves,
  Target,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QLLMPlaygroundProps {
  onConceptMastered?: (concept: string) => void;
}

interface GenerationResult {
  text: string;
  tokensGenerated: number;
  stopReason: string;
  modelId: string;
  resonanceMetrics?: {
    iterationsUsed: number;
    finalEntropy: number;
    coherenceScore: number;
    quantumResonance: number;
  };
  generationTime: number;
}

interface EncodingResult {
  vectors: Array<{
    values: number[];
    primeBasis: number[];
    magnitude: number;
  }>;
  tokenCount: number;
  encodingTime: number;
  metadata: {
    hidden_dim?: number;
    prime_basis?: number[];
    [key: string]: unknown;
  };
}

interface SimilarityResult {
  similarity: number;
  method: string;
  vector1: {
    values: number[];
    primeBasis: number[];
    magnitude: number;
  };
  vector2: {
    values: number[];
    primeBasis: number[];
    magnitude: number;
  };
  resonanceDetails?: Record<string, unknown>;
}

export const QLLMPlayground: React.FC<QLLMPlaygroundProps> = ({
  onConceptMastered
}) => {
  const [activeTab, setActiveTab] = useState('generate');
  const [prompt, setPrompt] = useState('');
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [modelId, setModelId] = useState('qllm-base');
  const [maxTokens, setMaxTokens] = useState([100]);
  const [temperature, setTemperature] = useState([1.0]);
  const [useResonance, setUseResonance] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | EncodingResult | SimilarityResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const { toast } = useToast();
  const resultRef = useRef<HTMLDivElement>(null);

  const models = [
    { id: 'qllm-base', name: 'QLLM Base', description: 'Standard quantum resonance model' },
    { id: 'qllm-small', name: 'QLLM Small', description: 'Lightweight model for fast inference' },
    { id: 'qllm-large', name: 'QLLM Large', description: 'High-capacity model for complex tasks' },
    { id: 'qllm-creative', name: 'QLLM Creative', description: 'Enhanced creativity with higher temperature' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProgress(0);

    try {
      const response = await fetch('/api/v1/qllm/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          model_id: modelId,
          max_tokens: maxTokens[0],
          temperature: temperature[0],
          use_resonance: useResonance,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GenerationResult = await response.json();
      setResult(data);

      toast({
        title: "Generation Complete",
        description: `Generated ${data.tokensGenerated} tokens in ${data.generationTime}ms`,
      });

      // Scroll to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };

  const handleEncode = async () => {
    if (!prompt.trim()) {
      setError('Please enter text to encode');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProgress(0);

    try {
      const response = await fetch('/api/v1/qllm/encode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: prompt.trim(),
          model_id: modelId,
          options: {
            use_prime_basis: true,
            apply_stability: true,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: EncodingResult = await response.json();
      setResult(data);

      toast({
        title: "Encoding Complete",
        description: `Encoded ${data.tokenCount} tokens in ${data.encodingTime}ms`,
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };

  const handleSimilarity = async () => {
    if (!text1.trim() || !text2.trim()) {
      setError('Please enter both texts for comparison');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProgress(0);

    try {
      const response = await fetch('/api/v1/qllm/similarity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text1: text1.trim(),
          text2: text2.trim(),
          model_id: modelId,
          method: 'resonance',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SimilarityResult = await response.json();
      setResult(data);

      toast({
        title: "Similarity Analysis Complete",
        description: `Similarity: ${(data.similarity * 100).toFixed(1)}%`,
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied to your clipboard",
    });
  };

  const renderGenerationResult = (data: GenerationResult) => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Generated Text
        </CardTitle>
        <div className="flex gap-2">
          <Badge variant="secondary">{data.modelId}</Badge>
          <Badge variant="outline">{data.tokensGenerated} tokens</Badge>
          <Badge variant="outline">{data.generationTime}ms</Badge>
          <Badge variant="outline">{data.stopReason}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-4">
          <pre className="whitespace-pre-wrap text-sm">{data.text}</pre>
        </div>

        <div className="flex gap-2 mb-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => copyToClipboard(data.text)}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPrompt(data.text)}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Use as Prompt
          </Button>
        </div>

        {data.resonanceMetrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-3">
              <div className="text-sm text-muted-foreground">Iterations</div>
              <div className="text-lg font-semibold">{data.resonanceMetrics.iterationsUsed}</div>
            </Card>
            <Card className="p-3">
              <div className="text-sm text-muted-foreground">Entropy</div>
              <div className="text-lg font-semibold">{data.resonanceMetrics.finalEntropy.toFixed(3)}</div>
            </Card>
            <Card className="p-3">
              <div className="text-sm text-muted-foreground">Coherence</div>
              <div className="text-lg font-semibold">{(data.resonanceMetrics.coherenceScore * 100).toFixed(1)}%</div>
            </Card>
            <Card className="p-3">
              <div className="text-sm text-muted-foreground">Quantum Resonance</div>
              <div className="text-lg font-semibold">{(data.resonanceMetrics.quantumResonance * 100).toFixed(1)}%</div>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderEncodingResult = (data: EncodingResult) => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Atom className="w-5 h-5" />
          Quantum Encoding Results
        </CardTitle>
        <div className="flex gap-2">
          <Badge variant="secondary">{data.tokenCount} tokens</Badge>
          <Badge variant="outline">{data.encodingTime}ms</Badge>
          <Badge variant="outline">{data.vectors.length} vectors</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.vectors.slice(0, 3).map((vector, idx) => (
            <Card key={idx} className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Vector {idx + 1}</span>
                <Badge variant="outline">Magnitude: {vector.magnitude.toFixed(3)}</Badge>
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                Prime Basis: [{vector.primeBasis.slice(0, 5).join(', ')}...]
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono overflow-x-auto">
                [{vector.values.slice(0, 10).map(v => v.toFixed(3)).join(', ')}...]
              </div>
            </Card>
          ))}

          {data.metadata && (
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-3">
                <div className="text-sm text-muted-foreground">Hidden Dim</div>
                <div className="text-lg font-semibold">{data.metadata.hidden_dim}</div>
              </Card>
              <Card className="p-3">
                <div className="text-sm text-muted-foreground">Prime Basis Size</div>
                <div className="text-lg font-semibold">{data.metadata.prime_basis?.length || 0}</div>
              </Card>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderSimilarityResult = (data: SimilarityResult) => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Similarity Analysis
        </CardTitle>
        <div className="flex gap-2">
          <Badge variant="secondary">{data.method} method</Badge>
          <Badge variant="outline">{(data.similarity * 100).toFixed(1)}% similar</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Card className="p-4">
            <div className="text-sm font-medium mb-2">Text 1 Vector</div>
            <div className="text-xs text-muted-foreground mb-1">
              Magnitude: {data.vector1.magnitude.toFixed(3)}
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono overflow-x-auto">
              [{data.vector1.values.slice(0, 8).map(v => v.toFixed(3)).join(', ')}...]
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-sm font-medium mb-2">Text 2 Vector</div>
            <div className="text-xs text-muted-foreground mb-1">
              Magnitude: {data.vector2.magnitude.toFixed(3)}
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono overflow-x-auto">
              [{data.vector2.values.slice(0, 8).map(v => v.toFixed(3)).join(', ')}...]
            </div>
          </Card>
        </div>

        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {(data.similarity * 100).toFixed(1)}%
          </div>
          <Progress value={data.similarity * 100} className="w-full max-w-xs mx-auto" />
        </div>

        {data.resonanceDetails && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium mb-2">Resonance Details</h4>
            <pre className="text-xs text-muted-foreground">
              {JSON.stringify(data.resonanceDetails, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6" />
            Quantum Resonance Language Model (QLLM)
          </CardTitle>
          <CardDescription>
            Experience quantum-enhanced language processing with prime-based encoding and resonance attention
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Text Generation</TabsTrigger>
          <TabsTrigger value="encode">Quantum Encoding</TabsTrigger>
          <TabsTrigger value="similarity">Similarity Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Generate Text
              </CardTitle>
              <CardDescription>
                Create text using quantum resonance principles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Prompt</label>
                <Textarea
                  placeholder="Enter your prompt here..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Model</label>
                  <Select value={modelId} onValueChange={setModelId}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div>
                            <div className="font-medium">{model.name}</div>
                            <div className="text-xs text-muted-foreground">{model.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Max Tokens: {maxTokens[0]}
                  </label>
                  <Slider
                    value={maxTokens}
                    onValueChange={setMaxTokens}
                    max={500}
                    min={10}
                    step={10}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Temperature: {temperature[0].toFixed(1)}
                  </label>
                  <Slider
                    value={temperature}
                    onValueChange={setTemperature}
                    max={2.0}
                    min={0.1}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="resonance"
                    checked={useResonance}
                    onChange={(e) => setUseResonance(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="resonance" className="text-sm font-medium">
                    Use Resonance Attention
                  </label>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="encode" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Atom className="w-5 h-5" />
                Quantum Encoding
              </CardTitle>
              <CardDescription>
                Transform text into quantum vectors using prime-based Hilbert spaces
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Text to Encode</label>
                <Textarea
                  placeholder="Enter text to transform into quantum vectors..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Model</label>
                <Select value={modelId} onValueChange={setModelId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleEncode}
                disabled={isLoading || !prompt.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Encoding...
                  </>
                ) : (
                  <>
                    <Atom className="w-4 h-4 mr-2" />
                    Encode
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="similarity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Quantum Similarity Analysis
              </CardTitle>
              <CardDescription>
                Compare texts using quantum resonance and cosine similarity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Text 1</label>
                  <Textarea
                    placeholder="Enter first text..."
                    value={text1}
                    onChange={(e) => setText1(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Text 2</label>
                  <Textarea
                    placeholder="Enter second text..."
                    value={text2}
                    onChange={(e) => setText2(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Model</label>
                <Select value={modelId} onValueChange={setModelId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleSimilarity}
                disabled={isLoading || !text1.trim() || !text2.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 mr-2" />
                    Compare Texts
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Progress Bar */}
      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Processing...</span>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results */}
      <div ref={resultRef}>
        {result && !error && (
          <>
            {activeTab === 'generate' && renderGenerationResult(result as GenerationResult)}
            {activeTab === 'encode' && renderEncodingResult(result as EncodingResult)}
            {activeTab === 'similarity' && renderSimilarityResult(result as SimilarityResult)}
          </>
        )}
      </div>

      {/* Educational Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waves className="w-5 h-5" />
            Quantum Resonance Principles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <div className="font-medium text-blue-600">Prime Hilbert Encoding</div>
              <div className="text-muted-foreground">
                Text tokens are mapped to prime-based Hilbert spaces, enabling efficient semantic representation.
              </div>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-green-600">Resonance Attention</div>
              <div className="text-muted-foreground">
                Iterative attention mechanism converges to optimal attention patterns through entropy minimization.
              </div>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-purple-600">Quantum Coherence</div>
              <div className="text-muted-foreground">
                Maintains quantum-like coherence in semantic spaces, enabling novel similarity measures.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QLLMPlayground;