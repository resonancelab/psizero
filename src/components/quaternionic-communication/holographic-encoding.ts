// Holographic Quantum Encoding System
// Based on prime coefficient encoding and spatial entropy calculations

import { HolographicFragment, HolographicData, QuantumMemory } from './types';

// Prime basis for holographic encoding
export const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71];

// Golden ratio for irrational phase locks (from Non-Local Prime Resonance System)
export const PHI = (1 + Math.sqrt(5)) / 2;
export const DELTA_S = Math.PI / PHI; // Entropy-stabilized phase

// Configuration constants
export const FIELD_SIZE = 400; // Fixed size for the SVG canvas within each node
export const NOISE_LEVEL = 0.05; // Conceptual noise for encoding

/**
 * Encodes a text string into prime coefficients.
 * Enhanced: Incorporates character frequency and position for more distinct encoding.
 * @param text - The text to encode.
 * @returns Normalized array of coefficients.
 */
export const encodeMemoryToPrimes = (text: string): number[] => {
  const coefficients = new Array(PRIMES.length).fill(0);
  const charFrequencies: Record<string, number> = {};

  // Calculate character frequencies
  for (let i = 0; i < text.length; i++) {
    const char = text[i].toLowerCase();
    charFrequencies[char] = (charFrequencies[char] || 0) + 1;
  }

  // Encode each character with prime coefficients
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const primeIndex = charCode % PRIMES.length;

    let amplitude = Math.cos(charCode * Math.PI / 128);
    const char = text[i].toLowerCase();
    if (charFrequencies[char]) {
      amplitude += (charFrequencies[char] / text.length) * 0.5;
    }
    amplitude *= (1 + (i / text.length) * 0.1);

    coefficients[primeIndex] += amplitude / Math.sqrt(text.length);
  }

  // Normalize coefficients
  const norm = Math.sqrt(coefficients.reduce((sum, c) => sum + c * c, 0));
  return coefficients.map(c => norm > 0 ? c / norm : 0);
};

/**
 * Holographic Quantum Encoding: I(x,y) = Σ Ap e^(-S(x,y)) e^(ipθ)
 * Enhanced: Dynamic spatial entropy, complex phase modulation, and simulated noise.
 * @param text - The memory text to encode.
 * @param centerX - Normalized X coordinate of the memory center.
 * @param centerY - Normalized Y coordinate of the memory center.
 * @param gridSize - Resolution for encoding.
 * @returns Array of holographic data points.
 */
export const encodeHolographic = (
  text: string, 
  centerX: number = 0.5, 
  centerY: number = 0.5, 
  gridSize: number
): HolographicFragment[] => {
  const hologramData: HolographicFragment[] = [];
  const textCoeffs = encodeMemoryToPrimes(text);
  const memoryComplexity = text.length / 100;

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      const normalizedX = x / gridSize;
      const normalizedY = y / gridSize;

      const distance = Math.sqrt(
        Math.pow(normalizedX - centerX, 2) +
        Math.pow(normalizedY - centerY, 2)
      );

      const spatialEntropy = Math.min(
        5, 
        distance * 3 + Math.random() * 0.5 + (1 - memoryComplexity) * 2
      );

      const intensityMap: Record<number, number> = {};
      let totalIntensity = 0;

      PRIMES.forEach((prime, i) => {
        const amplitude = textCoeffs[i] || 0;

        const basePhase = (2 * Math.PI * prime * normalizedX) + (Math.PI * prime * normalizedY);
        const chirpPhase = Math.sin(prime * normalizedX * normalizedY * 10) * 0.5;
        const timeDependentPhase = Date.now() * 0.0001 * prime;
        const phase = basePhase + chirpPhase + timeDependentPhase;

        const entropyWeight = Math.exp(-spatialEntropy);
        const phaseComponent = Math.cos(phase) + Math.sin(phase);

        let intensity = amplitude * entropyWeight * phaseComponent;
        intensity += (Math.random() - 0.5) * NOISE_LEVEL;

        intensityMap[prime] = intensity;
        totalIntensity += Math.abs(intensity);
      });

      hologramData.push({
        x: normalizedX,
        y: normalizedY,
        gridX: x,
        gridY: y,
        spatialEntropy,
        intensityMap,
        totalIntensity,
        phaseCoherence: Math.abs(Math.cos(totalIntensity * Math.PI)),
        canvasX: (x / gridSize) * FIELD_SIZE,
        canvasY: (y / gridSize) * FIELD_SIZE
      });
    }
  }
  return hologramData;
};

/**
 * Reconstructs memory from holographic fragments.
 * @param fragments - Array of holographic fragments.
 * @param reconstructionType - 'full', 'partial', or 'minimal'.
 * @returns Reconstructed text.
 */
export const reconstructFromFragments = (
  fragments: HolographicFragment[], 
  reconstructionType: 'full' | 'partial' | 'minimal' = 'full'
): string => {
  if (!fragments || fragments.length === 0) return '';

  let fragmentsToUse = [...fragments];
  if (reconstructionType === 'partial') {
    fragmentsToUse = fragments.slice(0, Math.floor(fragments.length * 0.5));
  } else if (reconstructionType === 'minimal') {
    fragmentsToUse = fragments.slice(0, Math.floor(fragments.length * 0.25));
  }

  const reconstructedCoeffs = new Array(PRIMES.length).fill(0);

  fragmentsToUse.forEach(fragment => {
    PRIMES.forEach((prime, i) => {
      const intensity = fragment.intensityMap[prime] || 0;
      reconstructedCoeffs[i] += intensity * fragment.phaseCoherence;
    });
  });

  const norm = Math.sqrt(reconstructedCoeffs.reduce((sum, c) => sum + c * c, 0));
  const normalizedCoeffs = reconstructedCoeffs.map(c => norm > 0 ? c / norm : 0);

  let reconstructedText = '';
  for (let i = 0; i < normalizedCoeffs.length; i++) {
    if (normalizedCoeffs[i] > 0.05) {
      const charCode = Math.round(normalizedCoeffs[i] * 128);
      if (charCode >= 32 && charCode <= 126) {
        reconstructedText += String.fromCharCode(charCode);
      }
    }
  }
  return reconstructedText.trim() || '[Holographic reconstruction incomplete]';
};

/**
 * Searches holographic memories for resonance with a query.
 * @param memories - Array of quantum memories to search.
 * @param query - The search query.
 * @returns Filtered and sorted search results.
 */
export const searchHolographicMemories = (
  memories: QuantumMemory[], 
  query: string
): Array<QuantumMemory & { resonance: number; avgResonance: number; matchingFragments: number }> => {
  if (!query.trim()) return [];

  const queryCoeffs = encodeMemoryToPrimes(query);

  return memories.map(memory => {
    const fragmentResonances = memory.holographicData.data.map(fragment => {
      let resonance = 0;
      PRIMES.forEach((prime, i) => {
        const queryIntensity = queryCoeffs[i] || 0;
        const fragmentIntensity = fragment.intensityMap[prime] || 0;
        resonance += queryIntensity * fragmentIntensity;
      });
      return Math.abs(resonance);
    });

    const maxResonance = fragmentResonances.length > 0 ? Math.max(...fragmentResonances) : 0;
    const avgResonance = fragmentResonances.length > 0 
      ? fragmentResonances.reduce((sum, r) => sum + r, 0) / fragmentResonances.length 
      : 0;

    return {
      ...memory,
      resonance: maxResonance,
      avgResonance,
      matchingFragments: fragmentResonances.filter(r => r > 0.1).length
    };
  }).filter(result => result.resonance > 0.05)
    .sort((a, b) => b.resonance - a.resonance);
};

/**
 * Creates a phase-locked prime ring (from Non-Local Prime Resonance System).
 * @param memories - List of memories for the system.
 * @param time - Current animation time.
 * @param isEntangled - Whether the system is entangled.
 * @param sharedPhases - Shared phase state for entangled systems.
 * @returns Array of phase ring objects.
 */
export const createPhaseRing = (
  memories: QuantumMemory[], 
  time: number = 0,
  isEntangled: boolean = false,
  sharedPhases?: number[]
) => {
  return PRIMES.map((prime, i) => {
    const memoryContribution = memories.reduce((sum, mem) => 
      sum + (mem.coefficients ? mem.coefficients[i] : 0), 0
    );
    const phaseBase = (2 * Math.PI * i) / PRIMES.length;
    const goldenPhase = (2 * Math.PI) / PHI;
    const entropyPhase = 2 * Math.PI / DELTA_S;

    let phase = phaseBase + goldenPhase * time + entropyPhase * Math.sin(prime * time * 0.1);
    if (isEntangled && sharedPhases && sharedPhases[i] !== undefined) {
      // If entangled, align to shared phase state
      phase = sharedPhases[i] + entropyPhase * Math.sin(prime * time * 0.1);
    }

    return {
      prime,
      index: i,
      amplitude: memoryContribution,
      phase: phase,
      x: Math.cos(phaseBase) * 80,
      y: Math.sin(phaseBase) * 80,
      locked: true
    };
  });
};

/**
 * Calculates interference patterns from memories within a node.
 * @param memories - Memories of a specific node.
 * @param gridSize - Resolution for encoding.
 * @returns Array of interference pattern points.
 */
export const calculateInterferencePattern = (memories: QuantumMemory[], gridSize: number) => {
  if (memories.length < 1) return [];
  const pattern = [];
  const step = Math.max(1, Math.floor(gridSize / 10));

  for (let x = 0; x < FIELD_SIZE; x += step) {
    for (let y = 0; y < FIELD_SIZE; y += step) {
      const normalizedX = x / FIELD_SIZE;
      const normalizedY = y / FIELD_SIZE;

      let totalAmplitude = 0;
      let totalPhase = 0;

      memories.forEach(memory => {
        const distance = Math.sqrt(
          Math.pow(normalizedX - memory.holographicData.centerX, 2) +
          Math.pow(normalizedY - memory.holographicData.centerY, 2)
        );

        const amplitude = Math.exp(-distance * 2);
        const phase = distance * 10 + memory.holographicData.phaseOffset;

        totalAmplitude += amplitude;
        totalPhase += phase;
      });

      const interference = Math.abs(Math.cos(totalPhase)) * totalAmplitude;

      pattern.push({
        x,
        y,
        amplitude: totalAmplitude,
        phase: totalPhase,
        interference,
        intensity: Math.min(1, interference)
      });
    }
  }
  return pattern;
};

/**
 * Generates a response from the holographic memory knowledge base.
 * @param memories - The node's memories to query.
 * @param query - The chat query.
 * @param nodeId - The ID of the querying node.
 * @param allNodeMemories - Optional memories from other entangled nodes.
 * @param isEntangled - Whether the system is entangled.
 * @returns Generated response string.
 */
export const generateHolographicResponse = (
  memories: QuantumMemory[],
  query: string,
  nodeId: string,
  allNodeMemories?: QuantumMemory[],
  isEntangled: boolean = false
): string => {
  if (!query.trim()) return "Please enter a query...";

  // Search for relevant memories
  const searchResults = searchHolographicMemories(memories, query);
  
  if (searchResults.length === 0) {
    return "No resonant memories found. Try encoding more information first.";
  }

  // Use the top 3 most resonant memories
  const topMemories = searchResults.slice(0, 3);
  const combinedText = topMemories.map(m => m.text).join(" ");
  
  // Generate a response based on resonance patterns
  const avgResonance = topMemories.reduce((sum, m) => sum + m.resonance, 0) / topMemories.length;
  const confidence = Math.min(avgResonance * 100, 95).toFixed(1);
  
  let response = `[Resonance: ${confidence}%] Based on holographic memory patterns:\n\n`;
  
  if (avgResonance > 0.7) {
    response += `Strong resonance detected with: "${topMemories[0].text}"`;
  } else if (avgResonance > 0.4) {
    response += `Moderate resonance across multiple memories. Pattern synthesis suggests: ${combinedText.substring(0, 100)}...`;
  } else {
    response += `Weak resonance patterns. Consider encoding more related information.`;
  }

  // Add non-local influence if entangled
  if (isEntangled && allNodeMemories && allNodeMemories.length > 0) {
    const otherNodeMemories = allNodeMemories.filter(m =>
      m.nodeOrigin !== nodeId && m.isNonLocal
    );
    
    if (otherNodeMemories.length > 0) {
      response += `\n\n[Non-local influence detected from ${otherNodeMemories.length} entangled nodes]`;
    }
  }

  return response;
};

/**
 * Calculates non-local correlation between entangled nodes using phase rings.
 * @param nodePhaseRings - Array of phase rings from different nodes.
 * @returns Non-local correlation value between 0 and 1.
 */
export const calculateNonLocalCorrelation = (nodePhaseRings: Array<Array<{
  prime: number;
  index: number;
  amplitude: number;
  phase: number;
  x: number;
  y: number;
  locked: boolean;
}>>): number => {
  if (nodePhaseRings.length < 2) return 0;

  let totalPhaseCorrelation = 0;
  let nodeCount = 0;

  // Calculate pairwise correlation
  for (let i = 0; i < nodePhaseRings.length; i++) {
    for (let j = i + 1; j < nodePhaseRings.length; j++) {
      const ring1 = nodePhaseRings[i];
      const ring2 = nodePhaseRings[j];

      if (!ring1 || !ring2) continue;

      const pairCorrelation = ring1.reduce((sum, phase1, k) => {
        const phase2 = ring2[k];
        if (!phase2) return sum;

        const phaseDiff = Math.abs(phase1.phase - phase2.phase);
        const correlation = Math.cos(phaseDiff) * phase1.amplitude * phase2.amplitude;
        return sum + correlation;
      }, 0);
      
      totalPhaseCorrelation += Math.abs(pairCorrelation);
      nodeCount++;
    }
  }
  
  return nodeCount > 0 ? totalPhaseCorrelation / (PRIMES.length * nodeCount) : 0;
};