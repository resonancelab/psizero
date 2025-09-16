// Validation utility functions

import { ValidationError } from '../core/errors';
import { PrimeBasis } from '../core/types';

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate email address format
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Invalid email format');
    }
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate API key format
 */
export function validateApiKey(apiKey: string): ValidationResult {
  const errors: string[] = [];
  
  if (!apiKey) {
    errors.push('API key is required');
  } else if (!apiKey.startsWith('nmx_')) {
    errors.push('API key must start with "nmx_"');
  } else if (apiKey.length < 20) {
    errors.push('API key is too short');
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate space name
 */
export function validateSpaceName(name: string): ValidationResult {
  const errors: string[] = [];
  
  if (!name) {
    errors.push('Space name is required');
  } else {
    if (name.length < 3) {
      errors.push('Space name must be at least 3 characters');
    }
    if (name.length > 100) {
      errors.push('Space name must be less than 100 characters');
    }
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(name)) {
      errors.push('Space name contains invalid characters');
    }
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate prime basis
 */
export function validatePrimeBasis(basis: PrimeBasis): ValidationResult {
  const errors: string[] = [];
  
  if (!basis.primes || !Array.isArray(basis.primes)) {
    errors.push('Prime numbers array is required');
  } else {
    if (basis.primes.length === 0) {
      errors.push('At least one prime number is required');
    }
    
    if (basis.primes.length > 20) {
      errors.push('Too many prime numbers (maximum 20)');
    }
    
    for (const prime of basis.primes) {
      if (!isPrime(prime)) {
        errors.push(`${prime} is not a prime number`);
      }
    }
    
    // Check for duplicates
    const uniquePrimes = new Set(basis.primes);
    if (uniquePrimes.size !== basis.primes.length) {
      errors.push('Duplicate prime numbers are not allowed');
    }
  }
  
  if (basis.dimension <= 0) {
    errors.push('Dimension must be positive');
  }
  
  if (basis.dimension > 1000) {
    errors.push('Dimension too large (maximum 1000)');
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Check if a number is prime
 */
export function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  
  return true;
}

/**
 * Validate URL format
 */
export function validateUrl(url: string): ValidationResult {
  const errors: string[] = [];
  
  if (!url) {
    errors.push('URL is required');
  } else {
    try {
      new URL(url);
    } catch {
      errors.push('Invalid URL format');
    }
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate timeout value
 */
export function validateTimeout(timeout: number): ValidationResult {
  const errors: string[] = [];
  
  if (timeout <= 0) {
    errors.push('Timeout must be positive');
  }
  
  if (timeout > 300000) { // 5 minutes
    errors.push('Timeout too large (maximum 5 minutes)');
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate retry count
 */
export function validateRetryCount(retries: number): ValidationResult {
  const errors: string[] = [];
  
  if (retries < 0) {
    errors.push('Retry count cannot be negative');
  }
  
  if (retries > 10) {
    errors.push('Too many retries (maximum 10)');
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate quantum gate parameters
 */
export function validateQuantumGate(gate: {
  type: string;
  target: number;
  control?: number;
  angle?: number;
}): ValidationResult {
  const errors: string[] = [];
  
  const validGates = ['H', 'X', 'Y', 'Z', 'CNOT', 'CZ', 'SWAP', 'RX', 'RY', 'RZ', 'Toffoli', 'Fredkin'];
  
  if (!validGates.includes(gate.type)) {
    errors.push(`Invalid gate type: ${gate.type}`);
  }
  
  if (gate.target < 0) {
    errors.push('Target qubit must be non-negative');
  }
  
  if (gate.control !== undefined) {
    if (gate.control < 0) {
      errors.push('Control qubit must be non-negative');
    }
    if (gate.control === gate.target) {
      errors.push('Control and target qubits must be different');
    }
  }
  
  if (gate.angle !== undefined) {
    if (typeof gate.angle !== 'number' || isNaN(gate.angle)) {
      errors.push('Angle must be a valid number');
    }
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate quantum circuit
 */
export function validateQuantumCircuit(circuit: {
  qubits: number;
  gates: Array<{
    type: string;
    target: number;
    control?: number;
    angle?: number;
  }>;
}): ValidationResult {
  const errors: string[] = [];
  
  if (circuit.qubits <= 0) {
    errors.push('Number of qubits must be positive');
  }
  
  if (circuit.qubits > 100) {
    errors.push('Too many qubits (maximum 100)');
  }
  
  if (!Array.isArray(circuit.gates)) {
    errors.push('Gates must be an array');
  } else {
    for (let i = 0; i < circuit.gates.length; i++) {
      const gate = circuit.gates[i];
      
      if (!gate) {
        errors.push(`Gate ${i}: Gate is undefined`);
        continue;
      }
      
      const gateValidation = validateQuantumGate(gate);
      
      if (!gateValidation.valid) {
        errors.push(`Gate ${i}: ${gateValidation.errors.join(', ')}`);
      }
      
      // Check if target/control qubits are within range
      if (gate.target >= circuit.qubits) {
        errors.push(`Gate ${i}: Target qubit ${gate.target} is out of range`);
      }
      
      if (gate.control !== undefined && gate.control >= circuit.qubits) {
        errors.push(`Gate ${i}: Control qubit ${gate.control} is out of range`);
      }
    }
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate JSON structure
 */
export function validateJson(jsonString: string): ValidationResult {
  const errors: string[] = [];
  
  try {
    JSON.parse(jsonString);
  } catch (error) {
    errors.push('Invalid JSON format');
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate file size
 */
export function validateFileSize(size: number, maxSize: number = 10 * 1024 * 1024): ValidationResult {
  const errors: string[] = [];
  
  if (size <= 0) {
    errors.push('File size must be positive');
  }
  
  if (size > maxSize) {
    errors.push(`File too large (maximum ${maxSize / 1024 / 1024}MB)`);
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validate object has required properties
 */
export function validateRequiredProperties<T extends Record<string, unknown>>(
  obj: T,
  required: (keyof T)[]
): ValidationResult {
  const errors: string[] = [];
  
  for (const prop of required) {
    if (!(prop in obj) || obj[prop] === undefined || obj[prop] === null) {
      errors.push(`Property '${String(prop)}' is required`);
    }
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Assert validation result and throw error if invalid
 */
export function assertValid(result: ValidationResult, field?: string): void {
  if (!result.valid) {
    throw new ValidationError(
      result.errors.join(', '),
      field,
      { errors: result.errors }
    );
  }
}

/**
 * Validate and assert in one function
 */
export function validateAndAssert<T>(
  value: T,
  validator: (value: T) => ValidationResult,
  field?: string
): void {
  const result = validator(value);
  assertValid(result, field);
}

/**
 * Create a validator function that can be reused
 */
export function createValidator<T>(
  validatorFn: (value: T) => ValidationResult
): (value: T, field?: string) => void {
  return (value: T, field?: string) => {
    validateAndAssert(value, validatorFn, field);
  };
}

// Pre-created validators for common use cases
export const validateEmailAndAssert = createValidator(validateEmail);
export const validateApiKeyAndAssert = createValidator(validateApiKey);
export const validateSpaceNameAndAssert = createValidator(validateSpaceName);
export const validatePrimeBasisAndAssert = createValidator(validatePrimeBasis);
export const validateUrlAndAssert = createValidator(validateUrl);