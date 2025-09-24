# Quantum Engine Backend API Specification

This document outlines the exact backend API specifications for all quantum engines to enable proper frontend-backend alignment.

## Summary of Issues

**Current Problem**: Frontend request schemas don't match backend expectations, causing 400/500 errors.

**Solution**: Document exact backend specs and align frontend types accordingly.

---

## 1. HQE (Holographic Quantum Encoder) API

### POST `/v1/hqe/simulate`

**Backend Requirements** (`api/gateway/router/hqe.go:35-42`):
```go
type HQERequest struct {
    SimulationType string                 `json:"simulation_type" binding:"required"`  // ⚠️ MISSING IN FRONTEND
    Primes         []int                  `json:"primes" binding:"required"`
    Steps          int                    `json:"steps" binding:"required"`             // ⚠️ OPTIONAL IN FRONTEND
    Lambda         float64                `json:"lambda" binding:"required"`            // ⚠️ OPTIONAL IN FRONTEND
    Config         *HQEConfig             `json:"config,omitempty"`
    Parameters     map[string]interface{} `json:"parameters,omitempty"`
}
```

**Frontend Current** (`src/lib/api/types.ts:108-116`):
```typescript
interface HQERequest {
  primes: number[];           // ✅ matches
  dt?: number;               // ⚠️ not in backend
  steps?: number;            // ⚠️ should be required
  lambda?: number;           // ⚠️ should be required
  resonanceTarget?: number;  // ⚠️ not in backend
  initialAmplitudes?: number[]; // ⚠️ not in backend
}
```

**Required Changes**:
- Add required `simulation_type` field (default: "holographic_reconstruction")
- Make `steps` and `lambda` required fields
- Remove unused fields: `dt`, `resonanceTarget`, `initialAmplitudes`

---

## 2. QSEM (Quantum Semantic) API

### POST `/v1/qsem/encode`

**Backend Requirements** (`api/gateway/router/qsem.go:15-19`):
```go
type QSEMEncodeRequest struct {
    Concepts []string    `json:"concepts" binding:"required"`
    Basis    string      `json:"basis" example:"prime"`          // ⚠️ not required but expected
    Config   *QSEMConfig `json:"config,omitempty"`
}
```

**Frontend Current** (`src/lib/api/types.ts:136-139`):
```typescript
interface QSemEncodeRequest {
  concepts: string[];     // ✅ matches
  basis?: 'prime' | 'hybrid'; // ✅ matches (optional)
}
```

**Status**: ✅ **ALIGNED** - Frontend matches backend requirements

### POST `/v1/qsem/resonance`

**Backend Requirements** (`api/gateway/router/qsem.go:21-24`):
```go
type QSEMResonanceRequest struct {
    Vectors []QuantumVector `json:"vectors" binding:"required"`
    Config  *QSEMConfig     `json:"config,omitempty"`
}

type QuantumVector struct {
    Concept string    `json:"concept"`
    Alpha   []float64 `json:"alpha"`
}
```

**Frontend Current** (`src/lib/api/types.ts:150-157`):
```typescript
interface QSemResonanceRequest {
  vectors: QSemVector[];  // ✅ matches
  graph?: Array<{         // ⚠️ not in backend
    i: number;
    j: number;
    w: number;
  }>;
}

interface QSemVector {
  concept: string;    // ✅ matches
  alpha: number[];    // ✅ matches
}
```

**Required Changes**:
- `graph` field is not supported by backend - should be removed or made backend optional

---

## 3. I-Ching Oracle API

### POST `/v1/iching/evolve`

**Backend Requirements** (`api/gateway/router/iching.go:14-20`):
```go
type IChingRequest struct {
    Question string        `json:"question" binding:"required"`
    Context  string        `json:"context,omitempty"`
    Querent  string        `json:"querent,omitempty"`
    Steps    int           `json:"steps,omitempty"`
    Config   *IChingConfig `json:"config,omitempty"`
}
```

**Frontend Current** (`src/lib/api/types.ts:208-211`):
```typescript
interface IChingEvolveRequest {
  question: string;  // ✅ matches
  steps?: number;    // ✅ matches
}
```

**Required Changes**:
- Add optional `context` and `querent` fields for enhanced functionality

---

## 4. Unified Physics API

### POST `/v1/unified/gravity/compute`

**Backend Requirements** (`api/gateway/router/unified.go:16-20`):
```go
type UnifiedGravityRequest struct {
    ObserverEntropyReductionRate float64        `json:"observerEntropyReductionRate" binding:"required"`
    RegionEntropyGradient        float64        `json:"regionEntropyGradient" binding:"required"`  // ⚠️ MISSING IN FRONTEND
    Config                       *UnifiedConfig `json:"config,omitempty"`
}
```

**Frontend Current** (`src/lib/api/types.ts:226-230`):
```typescript
interface GravityRequest {
  observerEntropyReductionRate: number;    // ✅ matches
  regionEntropyGradient?: number;          // ⚠️ should be required
  blackHoleProxyDensity?: number;          // ⚠️ not in backend
}
```

**Required Changes**:
- Make `regionEntropyGradient` required field  
- Remove `blackHoleProxyDensity` (not supported by backend)

---

## 5. Schema Alignment Strategy

### Option A: Update Frontend (Recommended)
- Modify frontend types to match exact backend requirements
- Ensures 100% compatibility
- Minimal backend changes

### Option B: Relax Backend Validation
- Make some backend fields optional that are currently required
- Add backward compatibility for frontend fields
- More backend changes required

### Option C: Hybrid Approach
- Critical fields remain required (simulation_type, concepts, question)
- Optional fields made more flexible on backend
- Best balance of compatibility and functionality

---

## 6. Implementation Priority

1. **HQE** - Most critical (missing required `simulation_type`)
2. **Unified Physics** - Missing required `regionEntropyGradient`
3. **QSEM** - Minor (unsupported `graph` field)
4. **I-Ching** - Enhancement (add optional fields)

---

## 7. Backend Validation Relaxation Candidates

These fields could be made optional in the backend to improve frontend compatibility:

**HQE**:
- `steps` - can default to 256
- `lambda` - can default to 0.02

**Unified Physics**:
- `regionEntropyGradient` - can default to 0.002

This would allow existing frontend code to work while maintaining API functionality.

---

## Next Steps

1. Choose alignment strategy (A, B, or C)
2. Update frontend types or backend validation accordingly
3. Test quantum engine endpoints
4. Update API documentation