/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from '../client';
import {
  QSemEncodeRequest,
  QSemEncodeResponse,
  QSemResonanceRequest,
  QSemResonanceResponse,
  QSemVector,
  QSemConfig,
  ApiResponse
} from '../types';

export class QSemApiService {
  /**
   * Encode concepts into prime-basis vectors
   */
  async encode(request: QSemEncodeRequest): Promise<ApiResponse<QSemEncodeResponse>> {
    return apiClient.post<QSemEncodeResponse>('/qsem/encode', request);
  }

  /**
   * Compute resonance/coherence among concept vectors
   */
  async resonance(request: QSemResonanceRequest): Promise<ApiResponse<QSemResonanceResponse>> {
    return apiClient.post<QSemResonanceResponse>('/qsem/resonance', request);
  }

  /**
   * Quick encoding with default settings
   */
  async quickEncode(concepts: string[], basis: 'prime' | 'hybrid' = 'prime'): Promise<ApiResponse<QSemEncodeResponse>> {
    const request: QSemEncodeRequest = {
      Concepts: concepts,
      Basis: basis
    };
    return this.encode(request);
  }

  /**
   * Compute resonance between two sets of vectors
   */
  async computeResonance(vectors: QSemVector[], config?: QSemConfig): Promise<ApiResponse<QSemResonanceResponse>> {
    const request: QSemResonanceRequest = {
      Vectors: vectors,
      Config: config
    };
    return this.resonance(request);
  }

  /**
   * Encode and analyze concept relationships in one call
   */
  async encodeAndAnalyze(concepts: string[]): Promise<ApiResponse<{
    vectors: QSemVector[];
    coherence: number;
    pairwise: Array<{
      a: number;
      b: number;
      resonance: number;
    }>;
  } | unknown>> {
    try {
      // First encode the concepts
      const encodeResponse = await this.quickEncode(concepts);
      if (!encodeResponse.data) {
        return {
          error: encodeResponse.error,
          status: encodeResponse.status,
          message: encodeResponse.message
        } as ApiResponse<unknown>;
      }

      // Then compute resonance
      const resonanceResponse = await this.computeResonance(encodeResponse.data.vectors);
      if (!resonanceResponse.data) {
        return {
          error: resonanceResponse.error,
          status: resonanceResponse.status,
          message: resonanceResponse.message
        } as ApiResponse<unknown>;
      }

      // Combine results
      return {
        data: {
          vectors: encodeResponse.data.vectors,
          coherence: resonanceResponse.data.coherence,
          pairwise: resonanceResponse.data.pairwise
        },
        status: 200,
        message: 'Encoding and analysis complete'
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Encoding and analysis failed',
        status: 500,
        message: 'Failed to encode and analyze concepts'
      };
    }
  }

  /**
   * Find most similar concepts to a query
   */
  async findSimilar(
    queryConcept: string,
    candidateConcepts: string[],
    limit: number = 10
  ): Promise<ApiResponse<any>> {
    try {
      // Encode all concepts
      const allConcepts = [queryConcept, ...candidateConcepts];
      const encodeResponse = await this.quickEncode(allConcepts);

      if (!encodeResponse.data) {
        return encodeResponse as ApiResponse<unknown>;
      }

      const [queryVector, ...candidateVectors] = encodeResponse.data.vectors;

      // Compute similarities (simple cosine similarity)
      const similarities = candidateVectors.map((vector, index) => {
        const similarity = this.cosineSimilarity(queryVector.alpha, vector.alpha);
        return {
          vector,
          similarity
        };
      });

      // Sort by similarity and limit results
      similarities.sort((a, b) => b.similarity - a.similarity);
      const topCandidates = similarities.slice(0, limit);

      return {
        data: {
          query: queryVector,
          candidates: topCandidates
        },
        status: 200,
        message: 'Similarity analysis complete'
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Similarity analysis failed',
        status: 500,
        message: 'Failed to find similar concepts'
      };
    }
  }

  /**
   * Compute cosine similarity between two vectors
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    if (normA === 0 || normB === 0) return 0;

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Get default encoding options for different use cases
   */
  getDefaultOptions(useCase: 'general' | 'technical' | 'creative' | 'analysis' = 'general') {
    const options = {
      general: {
        basis: 'prime' as const,
        config: {
          semantic_dimensions: 300,
          prime_basis_size: 100,
          coherence_threshold: 0.7
        }
      },
      technical: {
        basis: 'hybrid' as const,
        config: {
          semantic_dimensions: 500,
          prime_basis_size: 150,
          coherence_threshold: 0.8,
          context_depth: 7
        }
      },
      creative: {
        basis: 'prime' as const,
        config: {
          semantic_dimensions: 400,
          prime_basis_size: 120,
          coherence_threshold: 0.6,
          semantic_radius: 3.0
        }
      },
      analysis: {
        basis: 'prime' as const,
        config: {
          semantic_dimensions: 600,
          prime_basis_size: 200,
          coherence_threshold: 0.85,
          context_depth: 10
        }
      }
    };

    return options[useCase];
  }
}

// Create singleton instance
const qsemApi = new QSemApiService();

export default qsemApi;