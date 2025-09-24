# API Reference

## Core API Endpoints

### Health Check

**GET** `/health`

Returns the health status of the Reson.net platform.

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime": "24h30m45s",
  "coherence": 0.923,
  "active_nodes": 8,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### System Status

**GET** `/api/v1/status`

Returns comprehensive system status information.

**Response:**
```json
{
  "system": {
    "version": "1.0.0",
    "uptime": "24h30m45s",
    "memory_usage": 0.68,
    "cpu_usage": 0.45
  },
  "quaternionic": {
    "active_states": 1250,
    "coherence_level": 0.923,
    "phase_alignment": 0.887,
    "entropy": 1.234
  },
  "resonance": {
    "prime_basis_size": 1000,
    "active_operations": 45,
    "computation_load": 0.67
  },
  "distributed": {
    "active_nodes": 8,
    "network_latency": 12.5,
    "sync_status": "synchronized"
  }
}
```

## Quaternionic State Operations

### Create Quaternionic State

**POST** `/api/v1/quaternionic/states`

Creates a new quaternionic state with specified parameters.

**Request:**
```json
{
  "position": [1.0, 2.0, 3.0],
  "base_amplitude": {
    "real": 2.0,
    "imag": 3.0
  },
  "gaussian_coords": [0.5, 0.7],
  "eisenstein_coords": [0.3, 0.6],
  "normalization": true
}
```

**Response:**
```json
{
  "state_id": "qs_1234567890",
  "normalization_factor": 0.2,
  "phase": 0.0,
  "created_at": "2024-01-15T10:30:00Z",
  "amplitude": {
    "real": 0.4,
    "imag": 0.6
  }
}
```

**Mathematical Foundation:**
```
ψq(x,t) = N⁻¹ψ̄q(x)·exp(iφ(x,t))

Where:
- ψq(x,t): Time-dependent quaternionic wave function
- N⁻¹: Normalization factor (1/|ψ̄q|)
- ψ̄q(x): Base quaternionic amplitude
- exp(iφ(x,t)): Phase evolution factor
```

### Update State Phase

**PUT** `/api/v1/quaternionic/states/{state_id}/phase`

Updates the phase of a quaternionic state.

**Request:**
```json
{
  "delta_time": 0.01,
  "frequency": 6.283185307,  // 2π
  "damping": 0.02
}
```

**Response:**
```json
{
  "state_id": "qs_1234567890",
  "old_phase": 0.0,
  "new_phase": 0.0628,
  "phase_velocity": 6.283185307,
  "updated_at": "2024-01-15T10:30:01Z"
}
```

**Mathematical Foundation:**
```
φ(t+Δt) = φ(t) + 2π·f·Δt·e^(-γ·t)

Where:
- φ: Phase angle (radians)
- f: Frequency (Hz)
- γ: Damping coefficient
- Δt: Time step
```

### Compute State Coherence

**GET** `/api/v1/quaternionic/states/{state_id}/coherence`

Computes the quantum coherence of a quaternionic state.

**Query Parameters:**
- `other_states`: Comma-separated list of other state IDs
- `weights`: Optional coupling weights matrix

**Response:**
```json
{
  "state_id": "qs_1234567890",
  "coherence": 0.923,
  "phase_alignment": 0.887,
  "entanglement_depth": 3,
  "computation_time": 0.023
}
```

**Mathematical Foundation:**
```
C(t) = Σᵢⱼwᵢⱼ·cos(Φᵢ(t) - Φⱼ(t))

Where:
- C(t): Global coherence function
- wᵢⱼ: Coupling weights between nodes i,j
- Φᵢ(t): Phase of node i at time t
```

### Measure State Entropy

**GET** `/api/v1/quaternionic/states/{state_id}/entropy`

Computes the von Neumann entropy of a quaternionic state.

**Response:**
```json
{
  "state_id": "qs_1234567890",
  "entropy": 1.234,
  "purity": 0.456,
  "mixedness": 0.544,
  "computation_time": 0.015
}
```

**Mathematical Foundation:**
```
S = -Tr(ρ ln ρ) = -Σᵢ |αᵢ|² ln|αᵢ|²

Where:
- S: von Neumann entropy
- ρ: Density matrix
- αᵢ: Amplitude coefficients
```

## Prime Resonance Operations

### Get Prime Basis

**GET** `/api/v1/primes/basis`

Returns the prime number basis for Hilbert space construction.

**Query Parameters:**
- `count`: Number of primes to return (default: 100)
- `max_value`: Maximum prime value (optional)

**Response:**
```json
{
  "primes": [2, 3, 5, 7, 11, 13, 17, 19, 23, 29],
  "count": 10,
  "max_prime": 29,
  "computation_time": 0.001
}
```

### Factorize Number

**GET** `/api/v1/primes/factorize/{number}`

Returns the prime factorization of a given number.

**Response:**
```json
{
  "number": 123456,
  "factors": [
    {"prime": 2, "exponent": 6},
    {"prime": 3, "exponent": 1},
    {"prime": 643, "exponent": 1}
  ],
  "prime_factors": [2, 3, 643],
  "computation_time": 0.005
}
```

**Mathematical Foundation:**
```
n = ∏ᵢ pᵢ^aᵢ

Where:
- n: Number to factorize
- pᵢ: Prime factors
- aᵢ: Exponents
```

### Compute Prime Resonance

**GET** `/api/v1/primes/resonance`

Computes the resonance relationship between two prime numbers.

**Query Parameters:**
- `prime1`: First prime number
- `prime2`: Second prime number
- `strength`: Coupling strength (default: 1.0)

**Response:**
```json
{
  "prime1": 2,
  "prime2": 3,
  "resonance": 0.723,
  "phase_difference": 1.0986,
  "gap_similarity": 0.8,
  "computation_time": 0.002
}
```

**Mathematical Foundation:**
```
R(p₁,p₂) = 0.5·(S_gap + |cos(2π·log_p₁(p₂))|)

Where:
- R: Resonance strength
- S_gap: Prime gap similarity
- log_p₁(p₂): Logarithm base p₁ of p₂
```

## Distributed Operations

### Node Synchronization

**POST** `/api/v1/distributed/sync`

Initiates phase synchronization across distributed nodes.

**Request:**
```json
{
  "nodes": ["node-1", "node-2", "node-3"],
  "tolerance": 0.01,
  "max_iterations": 1000,
  "sync_algorithm": "kuramoto"
}
```

**Response:**
```json
{
  "sync_id": "sync_1234567890",
  "status": "in_progress",
  "nodes": ["node-1", "node-2", "node-3"],
  "target_coherence": 0.95,
  "started_at": "2024-01-15T10:30:00Z"
}
```

**Mathematical Foundation:**
```
dΦᵢ/dt = ωᵢ + (K/N)·Σⱼsin(Φⱼ - Φᵢ)

Where:
- Φᵢ: Phase of oscillator i
- ωᵢ: Natural frequency of oscillator i
- K: Coupling strength
- N: Number of oscillators
```

### Consensus Operation

**POST** `/api/v1/distributed/consensus`

Initiates a Proof-of-Resonance consensus operation.

**Request:**
```json
{
  "operation": "state_update",
  "proposals": [
    {"node": "node-1", "value": 0.85, "confidence": 0.92},
    {"node": "node-2", "value": 0.87, "confidence": 0.89},
    {"node": "node-3", "value": 0.83, "confidence": 0.95}
  ],
  "threshold": 0.67,
  "timeout": 30
}
```

**Response:**
```json
{
  "consensus_id": "cons_1234567890",
  "status": "agreed",
  "agreed_value": 0.85,
  "confidence": 0.92,
  "participating_nodes": 3,
  "rounds_taken": 2,
  "computation_time": 0.145
}
```

## Quantum Resonance Language Model (QLLM) Operations

### Generate Text

**POST** `/api/v1/qllm/generate`

Generates text using quantum resonance language processing.

**Request:**
```json
{
  "prompt": "The future of quantum computing",
  "model_id": "qllm-base",
  "max_tokens": 100,
  "temperature": 1.0,
  "use_resonance": true
}
```

**Response:**
```json
{
  "text": "The future of quantum computing holds unprecedented possibilities...",
  "tokensGenerated": 85,
  "stopReason": "max_tokens",
  "modelId": "qllm-base",
  "resonanceMetrics": {
    "iterationsUsed": 12,
    "finalEntropy": 0.234,
    "coherenceScore": 0.89,
    "quantumResonance": 0.76
  },
  "generationTime": 0.145
}
```

**Mathematical Foundation:**
```
Attention(Q,K,V) = softmax((Q·Kᵀ + R)/√d)·V

Where:
- R: Resonance attention matrix
- Q,K,V: Query, Key, Value matrices
- d: Hidden dimension
```

### Encode Text

**POST** `/api/v1/qllm/encode`

Transforms text into quantum vectors using prime-based encoding.

**Request:**
```json
{
  "text": "quantum resonance language model",
  "model_id": "qllm-base",
  "options": {
    "use_prime_basis": true,
    "apply_stability": true
  }
}
```

**Response:**
```json
{
  "vectors": [
    {
      "values": [0.123, 0.456, 0.789, ...],
      "primeBasis": [2, 3, 5, 7, 11, ...],
      "magnitude": 1.234
    }
  ],
  "tokenCount": 4,
  "encodingTime": 0.023,
  "metadata": {
    "hidden_dim": 768,
    "prime_basis": [2, 3, 5, 7, 11, ...]
  }
}
```

**Mathematical Foundation:**
```
vᵢ = Σⱼ wⱼ·φ(pⱼ)·cos(2π·i·log_pⱼ(tⱼ))

Where:
- vᵢ: Encoded vector component
- wⱼ: Token weights
- φ(pⱼ): Prime basis function
- tⱼ: Token values
```

### Compute Similarity

**POST** `/api/v1/qllm/similarity`

Computes semantic similarity between two texts using quantum resonance.

**Request:**
```json
{
  "text1": "quantum computing",
  "text2": "quantum mechanics",
  "model_id": "qllm-base",
  "method": "resonance"
}
```

**Response:**
```json
{
  "similarity": 0.87,
  "method": "resonance",
  "vector1": {
    "values": [0.123, 0.456, ...],
    "primeBasis": [2, 3, 5, ...],
    "magnitude": 1.234
  },
  "vector2": {
    "values": [0.156, 0.489, ...],
    "primeBasis": [2, 3, 5, ...],
    "magnitude": 1.345
  },
  "resonanceDetails": {
    "coherence": 0.92,
    "phase_alignment": 0.85,
    "entanglement_depth": 3
  }
}
```

**Mathematical Foundation:**
```
S(v₁,v₂) = |⟨v₁|v₂⟩| / (||v₁||·||v₂||)

Where:
- S: Similarity score [0,1]
- ⟨v₁|v₂⟩: Inner product
- ||v||: Vector magnitude
```

## ResoLang Operations

### Compile Program

**POST** `/api/v1/resolang/compile`

Compiles a ResoLang program.

**Request:**
```json
{
  "program": "PROGRAM HelloWorld { EXECUTE { LOG(\"Hello, Reson.net!\") } }",
  "optimization_level": "high",
  "target_platform": "distributed"
}
```

**Response:**
```json
{
  "program_id": "prog_1234567890",
  "status": "compiled",
  "bytecode_size": 2048,
  "compilation_time": 0.023,
  "warnings": [],
  "errors": []
}
```

### Execute Program

**POST** `/api/v1/resolang/execute`

Executes a compiled ResoLang program.

**Request:**
```json
{
  "program_id": "prog_1234567890",
  "parameters": {
    "input_data": [1.0, 2.0, 3.0],
    "iterations": 1000
  },
  "execution_mode": "distributed",
  "timeout": 300
}
```

**Response:**
```json
{
  "execution_id": "exec_1234567890",
  "status": "completed",
  "result": {
    "output": [2.0, 4.0, 6.0],
    "computation_time": 0.145,
    "nodes_used": 3
  },
  "telemetry": {
    "coherence_maintained": 0.94,
    "energy_consumed": 0.023,
    "network_overhead": 0.012
  }
}
```

## Token Economy Operations

### Get Token Balance

**GET** `/api/v1/tokens/balance/{address}`

Returns the RSN token balance for an address.

**Response:**
```json
{
  "address": "rsn_1a2b3c4d...",
  "balance": "1234.567890",
  "available": "1000.123456",
  "staked": "234.444434",
  "last_updated": "2024-01-15T10:30:00Z"
}
```

### Submit Transaction

**POST** `/api/v1/tokens/transfer`

Submits an RSN token transfer transaction.

**Request:**
```json
{
  "from": "rsn_1a2b3c4d...",
  "to": "rsn_5e6f7g8h...",
  "amount": "100.0",
  "memo": "Payment for computation",
  "fee": "0.001"
}
```

**Response:**
```json
{
  "transaction_id": "txn_1234567890",
  "status": "submitted",
  "from": "rsn_1a2b3c4d...",
  "to": "rsn_5e6f7g8h...",
  "amount": "100.0",
  "fee": "0.001",
  "submitted_at": "2024-01-15T10:30:00Z"
}
```

### Stake Tokens

**POST** `/api/v1/tokens/stake`

Stakes RSN tokens for network participation.

**Request:**
```json
{
  "address": "rsn_1a2b3c4d...",
  "amount": "500.0",
  "lock_period": 30,
  "purpose": "consensus_validation"
}
```

**Response:**
```json
{
  "stake_id": "stake_1234567890",
  "address": "rsn_1a2b3c4d...",
  "amount": "500.0",
  "lock_period": 30,
  "unlock_date": "2024-02-14T10:30:00Z",
  "rewards_rate": "0.08",
  "created_at": "2024-01-15T10:30:00Z"
}
```

## Monitoring and Telemetry

### Get System Metrics

**GET** `/api/v1/metrics`

Returns comprehensive system metrics.

**Response:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "system": {
    "cpu_usage": 0.45,
    "memory_usage": 0.68,
    "disk_usage": 0.34,
    "network_rx": 1250000,
    "network_tx": 980000
  },
  "quaternionic": {
    "active_states": 1250,
    "coherence_level": 0.923,
    "phase_alignment": 0.887,
    "entropy": 1.234,
    "computation_rate": 450.5
  },
  "distributed": {
    "active_nodes": 8,
    "network_latency": 12.5,
    "sync_operations": 45,
    "failed_syncs": 2
  },
  "tokens": {
    "total_supply": "10000000.0",
    "circulating_supply": "2500000.0",
    "transactions_per_second": 12.5,
    "average_fee": "0.0012"
  }
}
```

### Get Telemetry Data

**GET** `/api/v1/telemetry`

Returns detailed telemetry data for analysis.

**Query Parameters:**
- `start_time`: Start time for telemetry data
- `end_time`: End time for telemetry data
- `metrics`: Comma-separated list of metrics
- `resolution`: Data resolution (1s, 1m, 1h)

**Response:**
```json
{
  "time_range": {
    "start": "2024-01-15T10:00:00Z",
    "end": "2024-01-15T11:00:00Z",
    "resolution": "1m"
  },
  "metrics": {
    "coherence_level": [
      {"timestamp": "2024-01-15T10:00:00Z", "value": 0.85},
      {"timestamp": "2024-01-15T10:01:00Z", "value": 0.87},
      {"timestamp": "2024-01-15T10:02:00Z", "value": 0.89}
    ],
    "computation_load": [
      {"timestamp": "2024-01-15T10:00:00Z", "value": 0.65},
      {"timestamp": "2024-01-15T10:01:00Z", "value": 0.72},
      {"timestamp": "2024-01-15T10:02:00Z", "value": 0.68}
    ]
  }
}
```

## Error Handling

All API endpoints follow consistent error handling patterns:

**Error Response:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid quaternionic state parameters",
    "details": {
      "field": "position",
      "reason": "must be 3-dimensional vector"
    },
    "request_id": "req_1234567890",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR`: Invalid request parameters
- `NOT_FOUND`: Resource not found
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `INTERNAL_ERROR`: Server internal error
- `QUANTUM_ERROR`: Quantum computation error
- `NETWORK_ERROR`: Distributed network error

## Rate Limiting

API endpoints implement rate limiting based on:

- **Anonymous requests**: 100 requests per minute
- **Authenticated requests**: 1000 requests per minute
- **Premium accounts**: 10000 requests per minute

Rate limit headers are included in all responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642242600
X-RateLimit-Retry-After: 60
```

## Authentication

API authentication uses JWT tokens:

**Header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Payload:**
```json
{
  "sub": "user_123",
  "address": "rsn_1a2b3c4d...",
  "permissions": ["read", "write", "execute"],
  "exp": 1642242600,
  "iat": 1642156200
}
```

## WebSocket Streaming

Real-time data streaming via WebSocket:

**Connect:**
```javascript
const ws = new WebSocket('ws://api.resonet.io/stream');
```

**Subscribe to metrics:**
```json
{
  "type": "subscribe",
  "channels": ["coherence", "computation_load", "network_status"],
  "resolution": "1s"
}
```

**Receive data:**
```json
{
  "type": "data",
  "channel": "coherence",
  "timestamp": "2024-01-15T10:30:00Z",
  "value": 0.923
}
```

This API reference provides comprehensive documentation for all Reson.net platform endpoints. For more detailed examples and tutorials, see the [Examples](../examples/) directory.