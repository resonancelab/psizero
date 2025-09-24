import apiClient from '../client';
import {
  NLCSessionCreate,
  NLCSession,
  NLCMessage,
  ApiResponse
} from '../types';

export class NLCApiService {
  /**
   * Create a non-local communication session
   */
  async createSession(request: NLCSessionCreate): Promise<ApiResponse<NLCSession>> {
    return apiClient.post<NLCSession>('/nlc/sessions', request);
  }

  /**
   * Get session status and metrics
   */
  async getSession(sessionId: string): Promise<ApiResponse<NLCSession>> {
    return apiClient.get<NLCSession>(`/nlc/sessions/${sessionId}`);
  }

  /**
   * Send a message through the non-local channel
   */
  async sendMessage(sessionId: string, content: string): Promise<ApiResponse<NLCMessage>> {
    return apiClient.post<NLCMessage>(`/nlc/sessions/${sessionId}/messages`, {
      content
    });
  }

  /**
   * Quick session creation with defaults
   */
  async quickSession(
    primes: number[] = [2, 3, 5, 7],
    goldenPhase: boolean = true,
    silverPhase: boolean = true
  ): Promise<ApiResponse<NLCSession>> {
    const request: NLCSessionCreate = {
      primes,
      goldenPhase,
      silverPhase
    };

    return this.createSession(request);
  }

  /**
   * Advanced session with custom phases
   */
  async advancedSession(
    primes: number[],
    options: {
      phases?: number[];
      goldenPhase?: boolean;
      silverPhase?: boolean;
    } = {}
  ): Promise<ApiResponse<NLCSession>> {
    const request: NLCSessionCreate = {
      primes,
      ...options
    };

    return this.createSession(request);
  }

  /**
   * Send multiple messages in sequence
   */
  async sendMessageSequence(
    sessionId: string,
    messages: string[],
    delayMs: number = 1000
  ): Promise<ApiResponse<NLCMessage[]>> {
    try {
      const results: NLCMessage[] = [];

      for (const message of messages) {
        const response = await this.sendMessage(sessionId, message);
        if (response.data) {
          results.push(response.data);
        } else {
          throw new Error(response.error || 'Failed to send message');
        }

        // Add delay between messages
        if (delayMs > 0 && messages.indexOf(message) < messages.length - 1) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }

      return {
        data: results,
        status: 200,
        message: 'Message sequence sent successfully'
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to send message sequence',
        status: 500,
        message: 'Message sequence failed'
      };
    }
  }

  /**
   * Monitor session quality over time
   */
  async monitorSession(
    sessionId: string,
    durationMs: number = 30000,
    intervalMs: number = 5000
  ): Promise<ApiResponse<{
    session: NLCSession;
    metrics: Array<{
      timestamp: number;
      quality: number;
      entropy: number;
      resonanceStrength: number;
    }>;
  }>> {
    try {
      const startTime = Date.now();
      const metrics = [];

      // Initial session check
      const sessionResponse = await this.getSession(sessionId);
      if (!sessionResponse.data) {
        throw new Error(sessionResponse.error || 'Failed to get session');
      }

      while (Date.now() - startTime < durationMs) {
        const sessionCheck = await this.getSession(sessionId);
        if (sessionCheck.data) {
          metrics.push({
            timestamp: Date.now(),
            quality: sessionCheck.data.metrics.locality,
            entropy: sessionCheck.data.metrics.entropy,
            resonanceStrength: sessionCheck.data.metrics.resonanceStrength
          });
        }

        await new Promise(resolve => setTimeout(resolve, intervalMs));
      }

      return {
        data: {
          session: sessionResponse.data,
          metrics
        },
        status: 200,
        message: 'Session monitoring complete'
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Session monitoring failed',
        status: 500,
        message: 'Failed to monitor session'
      };
    }
  }

  /**
   * Test channel quality with echo messages
   */
  async testChannelQuality(
    sessionId: string,
    testMessages: string[] = ['test1', 'test2', 'test3']
  ): Promise<ApiResponse<{
    messages: NLCMessage[];
    averageQuality: number;
    successRate: number;
  }>> {
    try {
      const messages: NLCMessage[] = [];
      let totalQuality = 0;
      let successCount = 0;

      for (const testMessage of testMessages) {
        const response = await this.sendMessage(sessionId, testMessage);
        if (response.data) {
          messages.push(response.data);
          totalQuality += response.data.channelQuality;
          successCount++;
        }
      }

      const averageQuality = successCount > 0 ? totalQuality / successCount : 0;
      const successRate = successCount / testMessages.length;

      return {
        data: {
          messages,
          averageQuality,
          successRate
        },
        status: 200,
        message: 'Channel quality test complete'
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Channel quality test failed',
        status: 500,
        message: 'Failed to test channel quality'
      };
    }
  }

  /**
   * Get default configuration for different use cases
   */
  getDefaultConfig(useCase: 'basic' | 'research' | 'communication' | 'monitoring' = 'basic') {
    const configs = {
      basic: {
        primes: [2, 3, 5, 7],
        goldenPhase: true,
        silverPhase: true
      },
      research: {
        primes: [2, 3, 5, 7, 11, 13],
        goldenPhase: true,
        silverPhase: true,
        phases: [0, Math.PI/2, Math.PI, 3*Math.PI/2]
      },
      communication: {
        primes: [2, 3, 5, 7, 11],
        goldenPhase: true,
        silverPhase: false,
        phases: [0, Math.PI/4, Math.PI/2, 3*Math.PI/4]
      },
      monitoring: {
        primes: [2, 3, 5, 7],
        goldenPhase: true,
        silverPhase: true
      }
    };

    return configs[useCase];
  }
}

// Create singleton instance
const nlcApi = new NLCApiService();

export default nlcApi;