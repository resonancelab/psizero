// I-Ching (Quantum Oracle) Client - Ancient Wisdom through Quantum Computation

import { DynamicApi } from '../dynamic-api';
import { HexagramName } from '../core/types';
import {
  Hexagram,
  QuantumDynamics,
  InterpretationMode,
  IChingEvolution
} from './types';
import { loggers } from '../utils/logger';
import { validateRequiredProperties } from '../utils/validation';

/**
 * I-Ching Client - Quantum Oracle for ancient wisdom and divination
 */
export class IChingClient {
  constructor(private api: DynamicApi) {}

  /**
   * Cast hexagram using quantum computation
   */
  async castHexagram(
    question: string,
    method: 'coin-toss' | 'yarrow-stalk' | 'quantum-random' | 'prime-sequence' = 'quantum-random'
  ): Promise<{
    primary: Hexagram;
    transformed?: Hexagram;
    changingLines: number[];
    probability: number;
    resonance: number;
  }> {
    loggers.engines.debug('I-Ching casting hexagram', {
      questionLength: question.length,
      method
    });

    const apiMethods = this.api.createApiMethods();
    const startTime = performance.now();

    const castMethod = apiMethods['iching.castHexagram'];
    if (!castMethod) {
      throw new Error('I-Ching castHexagram method not available');
    }

    const result = await castMethod({ question, method });

    const processingTime = performance.now() - startTime;
    loggers.engines.info('I-Ching hexagram cast', {
      primary: result.primary.primary,
      transformed: result.transformed?.primary,
      changingLines: result.changingLines.length,
      probability: result.probability,
      resonance: result.resonance,
      processingTime
    });

    return result;
  }

  /**
   * Evolve hexagram through quantum dynamics
   */
  async evolveHexagram(
    initialHexagram: Hexagram,
    dynamics: QuantumDynamics
  ): Promise<IChingEvolution> {
    loggers.engines.debug('I-Ching evolving hexagram', {
      initial: initialHexagram.primary,
      timeSteps: dynamics.timeSteps,
      probabilityMethod: dynamics.probability
    });

    // Validate evolution parameters
    this.validateQuantumDynamics(dynamics);

    const apiMethods = this.api.createApiMethods();
    const startTime = performance.now();

    const evolveMethod = apiMethods['iching.evolveHexagram'];
    if (!evolveMethod) {
      throw new Error('I-Ching evolveHexagram method not available');
    }

    const evolution = await evolveMethod({ initialHexagram, dynamics });

    const processingTime = performance.now() - startTime;
    loggers.engines.info('I-Ching hexagram evolved', {
      initial: initialHexagram.primary,
      final: evolution.final.primary,
      steps: evolution.evolutionPath?.length || 0,
      probability: evolution.probability,
      resonance: evolution.resonance,
      processingTime
    });

    return evolution;
  }

  /**
   * Interpret hexagram with multiple modes
   */
  async interpretHexagram(
    hexagram: Hexagram,
    mode: InterpretationMode
  ): Promise<{
    symbolic: string;
    probabilistic: number;
    quantum: string;
    meaning: string;
    advice: string;
    warning?: string;
  }> {
    loggers.engines.debug('I-Ching interpreting hexagram', {
      hexagram: hexagram.primary,
      changingLines: hexagram.changingLines?.length,
      mode
    });

    const apiMethods = this.api.createApiMethods();
    const interpretMethod = apiMethods['iching.interpretHexagram'];
    if (!interpretMethod) {
      throw new Error('I-Ching interpretHexagram method not available');
    }

    const interpretation = await interpretMethod({ hexagram, mode });

    loggers.engines.info('I-Ching hexagram interpreted', {
      hexagram: hexagram.primary,
      symbolicLength: interpretation.symbolic.length,
      probabilistic: interpretation.probabilistic,
      quantumLength: interpretation.quantum.length
    });

    return interpretation;
  }

  /**
   * Create hexagram from line values
   */
  async createHexagram(lines: number[]): Promise<Hexagram> {
    if (lines.length !== 6) {
      throw new Error('Hexagram must have exactly 6 lines');
    }

    // Validate line values (traditional I-Ching: 6, 7, 8, 9)
    for (const line of lines) {
      if (![6, 7, 8, 9].includes(line)) {
        throw new Error('Line values must be 6, 7, 8, or 9');
      }
    }

    const changingLines = lines
      .map((line, index) => (line === 6 || line === 9) ? index + 1 : null)
      .filter((line): line is number => line !== null);

    return {
      primary: this.linesToHexagramName(lines),
      lines,
      changingLines
    };
  }

  /**
   * Generate quantum dynamics for evolution
   */
  async createQuantumDynamics(
    probabilityMethod: 'quantum-tunnel' | 'resonance-field' | 'prime-basis' = 'quantum-tunnel',
    timeSteps: number = 10,
    resonanceFrequencies: number[] = [1.0, 1.618, 2.0, 3.14159]
  ): Promise<QuantumDynamics> {
    return {
      probability: probabilityMethod,
      resonance: resonanceFrequencies,
      timeSteps,
      noise: 0.01
    };
  }

  /**
   * Create interpretation mode
   */
  async createInterpretationMode(
    symbolic: boolean = true,
    probabilistic: boolean = true,
    quantum: boolean = true,
    parameters?: Record<string, unknown>
  ): Promise<InterpretationMode> {
    return {
      symbolic,
      probabilistic,
      quantum,
      parameters: {
        depth: 'comprehensive',
        cultural: 'traditional',
        modern: 'contemporary',
        ...parameters
      }
    };
  }

  /**
   * Consult oracle with question
   */
  async consultOracle(
    question: string,
    context?: Record<string, unknown>
  ): Promise<{
    hexagram: Hexagram;
    interpretation: string;
    advice: string;
    probability: number;
    resonance: number;
    context?: Record<string, unknown>;
  }> {
    const result: {
      hexagram: Hexagram;
      interpretation: string;
      advice: string;
      probability: number;
      resonance: number;
      context?: Record<string, unknown>;
    } = {
      hexagram: {} as Hexagram,
      interpretation: '',
      advice: '',
      probability: 0,
      resonance: 0
    };
    loggers.engines.debug('I-Ching consulting oracle', {
      questionLength: question.length,
      hasContext: !!context
    });

    // Cast hexagram
    const castResult = await this.castHexagram(question);

    // Create interpretation mode
    const mode = await this.createInterpretationMode();

    // Interpret hexagram
    const interpretation = await this.interpretHexagram(castResult.primary, mode);

    result.hexagram = castResult.primary;
    result.interpretation = interpretation.meaning;
    result.advice = interpretation.advice;
    result.probability = castResult.probability;
    result.resonance = castResult.resonance;

    if (context !== undefined) {
      result.context = context;
    }

    loggers.engines.info('I-Ching oracle consulted', {
      hexagram: castResult.primary.primary,
      probability: castResult.probability,
      resonance: castResult.resonance
    });

    return result;
  }

  /**
   * Analyze hexagram transformation
   */
  async analyzeTransformation(
    primary: Hexagram,
    transformed: Hexagram
  ): Promise<{
    transformation: string;
    significance: string;
    energyFlow: number[];
    resonanceChange: number;
    advice: string;
  }> {
    loggers.engines.debug('I-Ching analyzing transformation', {
      primary: primary.primary,
      transformed: transformed.primary
    });

    const apiMethods = this.api.createApiMethods();
    const analyzeMethod = apiMethods['iching.analyzeTransformation'];
    if (!analyzeMethod) {
      throw new Error('I-Ching analyzeTransformation method not available');
    }

    const analysis = await analyzeMethod({ primary, transformed });

    loggers.engines.info('I-Ching transformation analyzed', {
      primary: primary.primary,
      transformed: transformed.primary,
      resonanceChange: analysis.resonanceChange
    });

    return analysis;
  }

  /**
   * Generate hexagram sequence
   */
  async generateSequence(
    startHexagram: Hexagram,
    length: number,
    dynamics: QuantumDynamics
  ): Promise<Hexagram[]> {
    loggers.engines.debug('I-Ching generating sequence', {
      start: startHexagram.primary,
      length,
      timeSteps: dynamics.timeSteps
    });

    const sequence = [startHexagram];

    for (let i = 1; i < length; i++) {
      const previousHexagram = sequence[i - 1];
      if (!previousHexagram) {
        throw new Error(`Invalid hexagram at index ${i - 1}`);
      }

      const evolution = await this.evolveHexagram(previousHexagram, {
        ...dynamics,
        timeSteps: 1
      });
      sequence.push(evolution.final);
    }

    const lastHexagram = sequence[sequence.length - 1];
    if (!lastHexagram) {
      throw new Error('Failed to generate sequence');
    }

    loggers.engines.info('I-Ching sequence generated', {
      start: startHexagram.primary,
      length: sequence.length,
      end: lastHexagram.primary
    });

    return sequence;
  }

  /**
   * Measure hexagram resonance
   */
  async measureResonance(
    hexagram: Hexagram,
    referenceFrequencies: number[] = [1.0, 1.618, 2.0, 3.14159]
  ): Promise<{
    resonance: number;
    frequency: number;
    coherence: number;
    stability: number;
  }> {
    const apiMethods = this.api.createApiMethods();
    const measureMethod = apiMethods['iching.measureResonance'];
    if (!measureMethod) {
      throw new Error('I-Ching measureResonance method not available');
    }

    return await measureMethod({ hexagram, referenceFrequencies });
  }

  /**
   * Find related hexagrams
   */
  async findRelatedHexagrams(
    hexagram: Hexagram,
    relationship: 'complementary' | 'opposite' | 'nuclear' | 'resonant' = 'complementary'
  ): Promise<Hexagram[]> {
    loggers.engines.debug('I-Ching finding related hexagrams', {
      hexagram: hexagram.primary,
      relationship
    });

    const apiMethods = this.api.createApiMethods();
    const findMethod = apiMethods['iching.findRelatedHexagrams'];
    if (!findMethod) {
      throw new Error('I-Ching findRelatedHexagrams method not available');
    }

    const related = await findMethod({ hexagram, relationship });

    loggers.engines.info('I-Ching related hexagrams found', {
      hexagram: hexagram.primary,
      relationship,
      count: related.length
    });

    return related;
  }

  /**
   * Get hexagram information
   */
  async getHexagramInfo(hexagramName: HexagramName): Promise<{
    name: string;
    number: number;
    lines: number[];
    meaning: string;
    judgment: string;
    image: string;
    characteristics: string[];
  }> {
    const apiMethods = this.api.createApiMethods();
    const getInfoMethod = apiMethods['iching.getHexagramInfo'];
    if (!getInfoMethod) {
      throw new Error('I-Ching getHexagramInfo method not available');
    }

    return await getInfoMethod({ hexagramName });
  }

  /**
   * Get I-Ching statistics
   */
  async getOracleStats(): Promise<{
    totalConsultations: number;
    popularHexagrams: Record<HexagramName, number>;
    averageResonance: number;
    evolutionSuccessRate: number;
    interpretationAccuracy: number;
    methodDistribution: Record<string, number>;
  }> {
    const apiMethods = this.api.createApiMethods();
    const getStatsMethod = apiMethods['iching.getStats'];
    if (!getStatsMethod) {
      throw new Error('I-Ching getStats method not available');
    }

    return await getStatsMethod();
  }

  /**
   * Get I-Ching engine status
   */
  async getStatus(): Promise<{
    online: boolean;
    quantumCoherence: number;
    oracleWisdom: number;
    evolutionCapacity: number;
    interpretationDepth: number;
    resonanceField: number;
  }> {
    const apiMethods = this.api.createApiMethods();
    const getStatusMethod = apiMethods['iching.getStatus'];
    if (!getStatusMethod) {
      throw new Error('I-Ching getStatus method not available');
    }

    return await getStatusMethod();
  }

  /**
   * Benchmark oracle performance
   */
  async benchmarkOracle(
    questions: string[],
    methods: string[] = ['coin-toss', 'yarrow-stalk', 'quantum-random', 'prime-sequence']
  ): Promise<Array<{
    method: string;
    question: string;
    castingTime: number;
    resonance: number;
    probability: number;
    interpretationTime: number;
    coherence: number;
  }>> {
    loggers.engines.debug('I-Ching benchmarking oracle', {
      questionCount: questions.length,
      methods
    });

    const results = [];

    for (const method of methods) {
      for (const question of questions.slice(0, 5)) { // Sample first 5 questions
        // Cast hexagram
        const castStart = performance.now();
        const castResult = await this.castHexagram(question, method as any);
        const castingTime = performance.now() - castStart;

        // Interpret hexagram
        const mode = await this.createInterpretationMode();
        const interpretStart = performance.now();
        await this.interpretHexagram(castResult.primary, mode);
        const interpretationTime = performance.now() - interpretStart;

        results.push({
          method,
          question,
          castingTime,
          resonance: castResult.resonance,
          probability: castResult.probability,
          interpretationTime,
          coherence: 0.95 // Placeholder - would be computed from actual metrics
        });
      }
    }

    loggers.engines.info('I-Ching oracle benchmark completed', {
      resultsCount: results.length
    });

    return results;
  }

  /**
   * Convert line values to hexagram name
   */
  private linesToHexagramName(lines: number[]): HexagramName {
    // This is a simplified mapping - in reality, this would be a complex lookup
    // based on the traditional I-Ching hexagram table
    const binary = lines.map(line => (line === 7 || line === 9) ? 1 : 0).join('');
    const decimal = parseInt(binary, 2);

    // Simplified mapping - would need full I-Ching hexagram table
    const hexagramNames: HexagramName[] = [
      'QIAN_HEAVEN', 'KUN_EARTH', 'ZHUN_DIFFICULTY', 'MENG_YOUTHFUL_FOLLY'
    ];

    return hexagramNames[decimal] || 'QIAN_HEAVEN';
  }

  /**
   * Validate quantum dynamics
   */
  private validateQuantumDynamics(dynamics: QuantumDynamics): void {
    validateRequiredProperties(
      dynamics as unknown as Record<string, unknown>,
      ['probability', 'resonance', 'timeSteps']
    );

    const validMethods = ['quantum-tunnel', 'resonance-field', 'prime-basis'];
    if (!validMethods.includes(dynamics.probability)) {
      throw new Error(`Invalid probability method. Must be one of: ${validMethods.join(', ')}`);
    }

    if (dynamics.timeSteps <= 0) {
      throw new Error('Time steps must be positive');
    }

    if (dynamics.resonance.length === 0) {
      throw new Error('Resonance frequencies cannot be empty');
    }

    if (dynamics.noise && (dynamics.noise < 0 || dynamics.noise > 1)) {
      throw new Error('Noise level must be between 0 and 1');
    }
  }
}