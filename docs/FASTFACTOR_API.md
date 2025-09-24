# FastFactor API Documentation

## Overview

FastFactor is a quantum-inspired integer factorization service that uses resonance patterns and phase relationships to efficiently factor large integers. The algorithm demonstrates unprecedented performance in factoring numbers with thousands of digits, achieving factorization times orders of magnitude faster than classical methods.

## Key Features

- **Quantum-Inspired Algorithm**: Leverages resonance patterns and phase coherence for factor detection
- **High Performance**: Achieves factorization times orders of magnitude faster than classical methods
- **Adaptive Thresholding**: Automatically adjusts detection sensitivity during computation
- **Phase Memory Optimization**: Caches resonance patterns for improved performance
- **Massive Scalability**: Handles numbers with tens of thousands of digits (default limit: 25,000 digits, configurable)

## API Endpoints

### Base URL
```
https://api.psizero.dev/v1/fastfactor
```

### Authentication
All endpoints require authentication via API key:
```bash
curl -H "X-API-Key: your_api_key" https://api.psizero.dev/v1/fastfactor/status
```

### Endpoints

#### 1. Factorize Number
**POST** `/factorize`

Factorizes a large integer using quantum-inspired resonance patterns.

**Request Body:**
```json
{
  "number": "1234567890123456789",
  "config": {
    "max_iterations": 10000,
    "resonance_threshold": 0.95,
    "phase_coherence": 0.98,
    "basis_set_size": 100,
    "adaptive_thresholding": true,
    "parallel_processors": 4,
    "timeout_seconds": 300,
    "max_digits": 10000
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "number": "1234567890123456789",
    "factors": [
      {
        "value": "3607",
        "confidence": 1.0,
        "resonance_strength": 0.987,
        "phase_signature": [2.141, 0.987, 3607],
        "discovered_at": 245
      },
      {
        "value": "342391",
        "confidence": 1.0,
        "resonance_strength": 0.993,
        "phase_signature": [1.829, 0.993, 342391],
        "discovered_at": 312
      }
    ],
    "is_prime": false,
    "is_complete": true,
    "confidence": 1.0,
    "resonance_metrics": {
      "average_resonance": 0.942,
      "peak_resonance": 0.993,
      "coherence_strength": 0.987,
      "pattern_stability": 0.934,
      "quantum_interference": 0.821
    },
    "metrics": {
      "entropy": 0.942,
      "plateauDetected": true,
      "dominance": 1.0,
      "resonanceStrength": 0.993,
      "convergenceTime": 1247.5,
      "iterations": 456
    },
    "timing": {
      "start_time": "2024-01-01T12:00:00Z",
      "end_time": "2024-01-01T12:00:01Z",
      "duration_ms": 1247.5,
      "iterations": 456
    }
  },
  "request_id": "req_abc123",
  "timestamp": "2024-01-01T12:00:01Z"
}
```

#### 2. Get Service Status
**GET** `/status`

Returns the current status and health of the FastFactor service.

**Response:**
```json
{
  "success": true,
  "data": {
    "service": "fastfactor",
    "status": "operational",
    "version": "1.0.0",
    "description": "Quantum-inspired integer factorization using resonance patterns",
    "capabilities": [
      "large_integer_factorization",
      "quantum_resonance_detection",
      "adaptive_thresholding",
      "phase_coherence_analysis"
    ],
    "engine_status": {
      "iteration": 0,
      "elapsed_time": 0,
      "factors_found": 0
    }
  }
}
```

#### 3. Get Performance Metrics
**GET** `/performance`

Returns detailed performance metrics and telemetry data.

**Response:**
```json
{
  "success": true,
  "data": {
    "telemetry_points": 1250,
    "current_state": {
      "iteration": 0,
      "elapsed_time": 0,
      "factors_found": 0
    },
    "recent_telemetry": [
      {
        "t": 1240,
        "S": 0.942,
        "L": 0.987,
        "satRate": 1.0,
        "resonanceStrength": 0.993,
        "dominance": 1.0,
        "timestamp": "2024-01-01T12:00:01Z"
      }
    ],
    "statistics": {
      "average_entropy": 0.923,
      "average_resonance": 0.945,
      "total_measurements": 1250
    }
  }
}
```

## Configuration Parameters

### Core Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `max_iterations` | integer | 10000 | Maximum number of iterations before timeout |
| `resonance_threshold` | float | 0.95 | Minimum resonance strength to consider a factor |
| `phase_coherence` | float | 0.98 | Phase coherence level for quantum state evolution |
| `basis_set_size` | integer | 100 | Size of the prime basis set |
| `adaptive_thresholding` | boolean | true | Enable adaptive threshold adjustment |
| `parallel_processors` | integer | 4 | Number of parallel processing units |
| `timeout_seconds` | integer | 300 | Maximum execution time in seconds |
| `max_digits` | integer | 25000 | Maximum number of digits in input number |

### Optimization Presets

The service supports three optimization presets for different use cases:

#### Speed Optimized
```json
{
  "max_iterations": 2000,
  "resonance_threshold": 0.9,
  "phase_coherence": 0.95,
  "basis_set_size": 50,
  "parallel_processors": 8,
  "timeout_seconds": 60
}
```

#### Accuracy Optimized  
```json
{
  "max_iterations": 20000,
  "resonance_threshold": 0.98,
  "phase_coherence": 0.995,
  "basis_set_size": 200,
  "parallel_processors": 2,
  "timeout_seconds": 600
}
```

#### Balanced
```json
{
  "max_iterations": 10000,
  "resonance_threshold": 0.95,
  "phase_coherence": 0.98,
  "basis_set_size": 100,
  "parallel_processors": 4,
  "timeout_seconds": 300
}
```

## Usage Examples

### Basic Factorization
```bash
curl -X POST https://api.psizero.dev/v1/fastfactor/factorize \
  -H "X-API-Key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "number": "12345"
  }'
```

### Advanced Configuration
```bash
curl -X POST https://api.psizero.dev/v1/fastfactor/factorize \
  -H "X-API-Key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "number": "1234567890123456789",
    "config": {
      "max_iterations": 15000,
      "resonance_threshold": 0.97,
      "timeout_seconds": 600,
      "adaptive_thresholding": true
    }
  }'
```

### JavaScript/TypeScript Usage
```javascript
import { fastFactorApi } from '@/lib/api';

// Basic factorization
const result = await fastFactorApi.quickFactorize('12345');

// Advanced factorization with custom config
const advancedResult = await fastFactorApi.advancedFactorize(
  '1234567890123456789',
  {
    maxIterations: 15000,
    resonanceThreshold: 0.97,
    timeoutSeconds: 600
  }
);

// Optimized for speed
const speedResult = await fastFactorApi.factorizeOptimized(
  '987654321',
  'speed'
);
```

## Response Fields

### Factor Information
- `value`: The factor as a string
- `confidence`: Confidence level (0.0 to 1.0)
- `resonance_strength`: Quantum resonance strength
- `phase_signature`: Phase relationship signatures
- `discovered_at`: Iteration when factor was found

### Resonance Metrics
- `average_resonance`: Average resonance across all iterations
- `peak_resonance`: Highest resonance achieved
- `coherence_strength`: Quantum coherence level
- `pattern_stability`: Stability of resonance patterns
- `quantum_interference`: Quantum interference effects

### Timing Information
- `start_time`: Factorization start time (ISO 8601)
- `end_time`: Factorization end time (ISO 8601)
- `duration_ms`: Total duration in milliseconds
- `iterations`: Number of iterations completed

## Error Handling

### Common Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| `FASTFACTOR_001` | Invalid request format | Check request JSON structure |
| `FASTFACTOR_002` | Invalid number format | Ensure number contains only digits |
| `FASTFACTOR_003` | Factorization failed | Check number size and configuration |

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "FASTFACTOR_002",
    "message": "Invalid number format",
    "details": "Number must be a valid integer"
  },
  "request_id": "req_abc123",
  "timestamp": "2024-01-01T12:00:01Z"
}
```

## Performance Guidelines

### Number Size Recommendations

| Digits | Difficulty | Estimated Time | Recommended Config |
|--------|------------|----------------|-------------------|
| 1-100 | Trivial | < 1 second | Default |
| 101-1000 | Easy | < 1 second | Speed optimized |
| 1001-5000 | Moderate | < 1 second | Balanced |
| 5001-10000 | Hard | 1-10 seconds | Accuracy optimized |
| 10001-25000 | Very Hard | 10 seconds - 2 minutes | High-performance |
| 25000+ | Extreme | 2-30 minutes | Custom ultra-performance |

### Best Practices

1. **Use appropriate timeouts**: Set realistic timeout values based on number size
2. **Enable adaptive thresholding**: Improves convergence for difficult numbers
3. **Validate input**: Use the validation utility before sending requests
4. **Monitor telemetry**: Track resonance metrics for optimization insights
5. **Batch processing**: For multiple numbers, process sequentially to avoid overload

## Rate Limits

- **Requests per minute**: 60
- **Concurrent requests**: 5
- **Maximum computation time**: 30 minutes per request (most factorizations complete in seconds)

## SDK Support

The FastFactor API is supported in the following SDKs:

- **JavaScript/TypeScript**: Full support with type definitions
- **Python**: Coming soon
- **Go**: Coming soon
- **Rust**: Coming soon

## Theoretical Background

The FastFactor algorithm is based on the theoretical framework presented in the research paper:

**"FastFactor: A Quantum-Inspired Framework for High-Performance Integer Factorization Using Resonance Patterns"**

Key concepts:
- **Quprime State Space**: Numbers exhibit quantum-like properties in specialized mathematical space
- **Resonance Operators**: Phase relationships encode multiplicative structure
- **Phase Coherence Metrics**: Quantify relationships between potential factors
- **Adaptive Resonance Thresholding**: Dynamic sensitivity adjustment
- **Phase Memory Optimization**: Pattern caching for performance enhancement

## Support

For technical support and questions:
- Documentation: https://docs.psizero.dev/fastfactor
- API Status: https://status.psizero.dev
- Support: support@psizero.dev

## Changelog

### Version 1.0.0 (2024-01-01)
- Initial release
- Quantum-inspired factorization algorithm
- Adaptive thresholding support
- Phase memory optimization
- REST API with full documentation