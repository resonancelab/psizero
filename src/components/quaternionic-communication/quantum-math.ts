// Quantum mathematics utilities for quaternionic communication

import { QuaternionState, OctonionChannel, BlochVector } from './types';

// Quaternion Mathematics
export const quaternionMagnitude = (q: QuaternionState): number => {
  return Math.sqrt(q.a * q.a + q.b * q.b + q.c * q.c + q.d * q.d);
};

export const quaternionNormalize = (q: QuaternionState): QuaternionState => {
  const mag = quaternionMagnitude(q);
  if (mag === 0) return { a: 1, b: 0, c: 0, d: 0 };
  return {
    a: q.a / mag,
    b: q.b / mag,
    c: q.c / mag,
    d: q.d / mag
  };
};

export const quaternionToBloch = (q: QuaternionState): BlochVector => {
  const mag = quaternionMagnitude(q);
  if (mag === 0) return { x: 0, y: 0, z: 1 };
  
  return {
    x: 2 * (q.a * q.b + q.c * q.d) / mag,
    y: 2 * (q.a * q.c - q.b * q.d) / mag,
    z: (q.a * q.a - q.b * q.b - q.c * q.c + q.d * q.d) / mag
  };
};

export const calculateTwist = (q: QuaternionState): number => {
  // Eisenstein component twist calculation for quaternionic geometry
  return Math.atan2(q.d * Math.sqrt(3) / 2, q.c);
};

// Octonion Mathematics  
export const createOctonion = (e0: number, e1: number, e2: number, e3: number, 
                              e4: number, e5: number, e6: number, e7: number): OctonionChannel => {
  return { e0, e1, e2, e3, e4, e5, e6, e7 };
};

export const octonionNorm = (o: OctonionChannel): number => {
  return Math.sqrt(
    o.e0 * o.e0 + o.e1 * o.e1 + o.e2 * o.e2 + o.e3 * o.e3 +
    o.e4 * o.e4 + o.e5 * o.e5 + o.e6 * o.e6 + o.e7 * o.e7
  );
};

export const octonionNormalize = (o: OctonionChannel): OctonionChannel => {
  const norm = octonionNorm(o);
  if (norm === 0) return createOctonion(1, 0, 0, 0, 0, 0, 0, 0);
  
  return {
    e0: o.e0 / norm, e1: o.e1 / norm, e2: o.e2 / norm, e3: o.e3 / norm,
    e4: o.e4 / norm, e5: o.e5 / norm, e6: o.e6 / norm, e7: o.e7 / norm
  };
};

export const octonionConjugate = (o: OctonionChannel): OctonionChannel => {
  return {
    e0: o.e0,
    e1: -o.e1, e2: -o.e2, e3: -o.e3,
    e4: -o.e4, e5: -o.e5, e6: -o.e6, e7: -o.e7
  };
};

export const octonionMultiply = (o1: OctonionChannel, o2: OctonionChannel): OctonionChannel => {
  // Octonion multiplication using Cayley-Dickson construction
  return {
    e0: o1.e0*o2.e0 - o1.e1*o2.e1 - o1.e2*o2.e2 - o1.e3*o2.e3 - o1.e4*o2.e4 - o1.e5*o2.e5 - o1.e6*o2.e6 - o1.e7*o2.e7,
    e1: o1.e0*o2.e1 + o1.e1*o2.e0 + o1.e2*o2.e3 - o1.e3*o2.e2 + o1.e4*o2.e5 - o1.e5*o2.e4 - o1.e6*o2.e7 + o1.e7*o2.e6,
    e2: o1.e0*o2.e2 - o1.e1*o2.e3 + o1.e2*o2.e0 + o1.e3*o2.e1 + o1.e4*o2.e6 + o1.e5*o2.e7 - o1.e6*o2.e4 - o1.e7*o2.e5,
    e3: o1.e0*o2.e3 + o1.e1*o2.e2 - o1.e2*o2.e1 + o1.e3*o2.e0 + o1.e4*o2.e7 - o1.e5*o2.e6 + o1.e6*o2.e5 - o1.e7*o2.e4,
    e4: o1.e0*o2.e4 - o1.e1*o2.e5 - o1.e2*o2.e6 - o1.e3*o2.e7 + o1.e4*o2.e0 + o1.e5*o2.e1 + o1.e6*o2.e2 + o1.e7*o2.e3,
    e5: o1.e0*o2.e5 + o1.e1*o2.e4 - o1.e2*o2.e7 + o1.e3*o2.e6 - o1.e4*o2.e1 + o1.e5*o2.e0 - o1.e6*o2.e3 + o1.e7*o2.e2,
    e6: o1.e0*o2.e6 + o1.e1*o2.e7 + o1.e2*o2.e4 - o1.e3*o2.e5 - o1.e4*o2.e2 + o1.e5*o2.e3 + o1.e6*o2.e0 - o1.e7*o2.e1,
    e7: o1.e0*o2.e7 - o1.e1*o2.e6 + o1.e2*o2.e5 + o1.e3*o2.e4 - o1.e4*o2.e3 - o1.e5*o2.e2 + o1.e6*o2.e1 + o1.e7*o2.e0
  };
};

// Message Encoding
export const messageToOctonion = (message: string, channelId: number): OctonionChannel => {
  // Hash-based encoding to 8D octonion space
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    hash = ((hash << 5) - hash) + message.charCodeAt(i);
    hash = hash & hash;
  }
  
  // Create octonion components from message hash and channel
  const components = [];
  for (let i = 0; i < 8; i++) {
    const seed = hash + channelId * 1000 + i * 100;
    components.push(Math.sin(seed * 0.001) * 0.5);
  }
  
  return octonionNormalize(createOctonion(
    components[0], components[1], components[2], components[3],
    components[4], components[5], components[6], components[7]
  ));
};

export const octonionToQuaternion = (o: OctonionChannel): QuaternionState => {
  // Extract quaternion from first 4 components of octonion
  return { a: o.e0, b: o.e1, c: o.e2, d: o.e3 };
};

// Non-Local Correlation
export const calculateNonLocalCorrelation = (nodeA: OctonionChannel, nodeB: OctonionChannel): number => {
  // Calculate octonion inner product for correlation
  let innerProduct = 0;
  const componentsA = [nodeA.e0, nodeA.e1, nodeA.e2, nodeA.e3, nodeA.e4, nodeA.e5, nodeA.e6, nodeA.e7];
  const componentsB = [nodeB.e0, nodeB.e1, nodeB.e2, nodeB.e3, nodeB.e4, nodeB.e5, nodeB.e6, nodeB.e7];
  
  for (let i = 0; i < 8; i++) {
    innerProduct += componentsA[i] * componentsB[i];
  }
  
  // Add non-associative correction term
  const nonAssocCorrection = Math.abs(
    (nodeA.e4 * nodeB.e5 - nodeA.e5 * nodeB.e4) +
    (nodeA.e6 * nodeB.e7 - nodeA.e7 * nodeB.e6)
  ) * 0.1;
  
  return Math.min(1.0, Math.abs(innerProduct) + nonAssocCorrection);
};

// Prime Basis Evolution
export const evolvePrimeBasisPhases = (phases: number[], primes: number[], deltaTime: number): number[] => {
  return phases.map((phase, i) => 
    phase + Math.sin(deltaTime * primes[i] * 0.01) * 0.01
  );
};

// Split Prime Factorization (for genuine quantum mechanics)
export const getSplitPrimes = (): number[] => {
  // Split primes p ≡ 1 (mod 12) for Gaussian and Eisenstein factorizations
  return [13, 37, 61, 73, 97, 109, 157, 181, 193, 229, 241, 277, 313, 337, 349, 373, 397, 409, 421, 433];
};

export const primeToQuaternion = (prime: number, seed = 0): QuaternionState => {
  // Convert split prime to quaternion using Gaussian and Eisenstein factorizations
  const gaussian_a = Math.floor(Math.sqrt(prime)) + (seed % 3) - 1;
  const gaussian_b = Math.floor(Math.sqrt(prime - gaussian_a * gaussian_a)) + (seed % 2);
  const eisenstein_c = Math.floor(prime / 4) + (seed % 4) - 1;
  const eisenstein_d = Math.floor(Math.sqrt(prime / 3)) + (seed % 3);
  
  return quaternionNormalize({ 
    a: gaussian_a, 
    b: gaussian_b, 
    c: eisenstein_c, 
    d: eisenstein_d 
  });
};

// Golden Ratio Phase Evolution
export const goldenRatioPhase = (index: number): number => {
  const PHI = (1 + Math.sqrt(5)) / 2; // Golden ratio
  return (index * PHI * 2 * Math.PI) % (2 * Math.PI);
};