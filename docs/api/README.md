# API Documentation

This directory contains comprehensive JSON API documentation for all services in the quantum computing platform. Each service has its own detailed specification file following a consistent structure.

## Documentation Structure

Each API documentation file contains:
- Service metadata (name, description, version, base URL)
- Authentication requirements
- Complete endpoint specifications with examples
- Detailed type definitions
- Error codes and handling
- Request/response schemas

## Available APIs

### Core Quantum Services

- **[FastFactor](./fastfactor.json)** - Integer factorization using quantum-inspired resonance patterns
- **[HQE](./hqe.json)** - Holographic Quantum Engine for prime eigenstate evolution
- **[I-Ching](./iching.json)** - Oracle service for hexagram evolution and symbolic entropy dynamics
- **[NLC](./nlc.json)** - Non-Local Communication for quantum entanglement-based messaging
- **[QCR](./qcr.json)** - Quantum Cognitive Reasoning for triadic consciousness simulation
- **[QSEM](./qsem.json)** - Quantum Semantic Enhancement Model for concept encoding
- **[RNET](./rnet.json)** - Reality Network for managing quantum resonance spaces
- **[SAI](./sai.json)** - Synthetic AI for symbolic AI engines and text processing
- **[SRS](./srs.json)** - Symbolic Resonance Solver for NP-complete problems
- **[Unified Physics](./unified.json)** - Emergent gravity computation and field analysis

### Schema and Templates

- **[Schema](./schema.json)** - JSON schema template for API documentation structure

## Service Categories

### Quantum Computing & Algorithms
- **FastFactor** - Quantum-inspired factorization
- **SRS** - NP-complete problem solving
- **HQE** - Prime eigenstate evolution

### Communication & Networks
- **NLC** - Quantum communication channels
- **RNET** - Reality network management
- **I-Ching** - Oracle consultation system

### AI & Consciousness
- **QCR** - Consciousness simulation
- **SAI** - Symbolic AI engines
- **QSEM** - Semantic analysis

### Physics Simulation
- **Unified Physics** - Gravity and field analysis

## Authentication

All APIs require authentication using one or more of the following methods:
- **API Key Authentication** (`X-Api-Key` header)
- **Bearer Token Authentication** (`Authorization: Bearer <token>` header)

## Base URL Structure

All APIs follow the pattern: `https://api.example.com/v1/{service}`

Where `{service}` is one of:
- `fastfactor`, `hqe`, `iching`, `nlc`, `qcr`, `qsem`, `rnet`, `sai`, `srs`, `unified`

## Common Response Format

All APIs return responses in a consistent format:

```json
{
  "data": { /* Response data */ },
  "status": 200,
  "request_id": "unique_request_identifier"
}
```

Error responses follow the same pattern with additional error information:

```json
{
  "error": "Error message",
  "error_code": "SERVICE_XXX",
  "error_details": "Detailed error information",
  "request_id": "unique_request_identifier",
  "status": 400
}
```

## Usage Examples

### Quantum Factorization (FastFactor)
```bash
curl -X POST https://api.example.com/v1/fastfactor/factorize \
  -H "X-Api-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"n": 15, "max_iterations": 1000}'
```

### Consciousness Simulation (QCR)
```bash
curl -X POST https://api.example.com/v1/qcr/sessions \
  -H "X-Api-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"modes": ["analytical", "creative", "ethical"]}'
```

### Semantic Analysis (QSEM)
```bash
curl -X POST https://api.example.com/v1/qsem/encode \
  -H "X-Api-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"concepts": ["love", "entropy", "pattern"]}'
```

## Rate Limiting

Most services implement rate limiting:
- Default: 1000 requests per hour per API key
- Headers returned: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Error Handling

Each service defines specific error codes in the format `SERVICE_XXX`:
- `FastFactor`: FF_001, FF_002, etc.
- `HQE`: HQE_001, HQE_002, etc.
- `QCR`: QCR_001, QCR_002, etc.
- And so on...

See individual service documentation for complete error code listings.

## Telemetry and Monitoring

Many services provide real-time telemetry and monitoring:
- **Server-Sent Events** for real-time data streams
- **WebSocket connections** for interactive sessions
- **Telemetry endpoints** for performance metrics

## SDKs and Libraries

SDKs are available for multiple programming languages:
- JavaScript/TypeScript (Node.js)
- Python
- Go
- Java
- C#

See the main platform documentation for SDK installation and usage instructions.

## Support and Contact

For API support, documentation issues, or feature requests:
- Email: api-support@example.com
- Documentation: https://docs.example.com
- GitHub Issues: https://github.com/example/api-docs/issues

## Version History

- **v1.0.0** - Initial release with all core services
- Each service maintains its own versioning as specified in individual documentation files

---

*Last updated: January 2024*