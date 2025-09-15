openapi: 3.1.0
info:
  title: Prime-Wave Quantum Information API (PWI)
  version: 1.0.0
  description: |
    Prime-basis quantum-like information processing on classical systems with
    resonance operators, p-adic/quantum-group enhancements, protected transforms,
    entanglement, interference, measurement, and crypto utilities.
    Semantics derived from prime Hilbert spaces, resonance operators R(n),
    quantum-group enhancements, p-adic spaces H_p, and topological/TQFT-style protections
    with optional golden/silver phase scaffolds for non-local stabilization.
    See framework references.
  x-references:
    - Condensed Quantum Consciousness Prime Resonance Formalism [oai_citation:2‡condensed-quantum-formalism.md](file-service://file-3RisF1NHjwcBGPJtgYy8Rg)
    - Non-Local Communication Using Prime Eigenstates [oai_citation:3‡nonlocal-prime-communication.md](file-service://file-UNzFcw5xbAYXJ7z8G9fhSE)

servers:
  - url: https://api.psizero.com
    description: Production
  - url: https://sandbox.psizero.com
    description: Sandbox

tags:
  - name: PWI
  - name: States
  - name: Evolution
  - name: Entanglement
  - name: Interference
  - name: Measurement
  - name: Protection
  - name: Crypto
  - name: Telemetry
  - name: Webhooks

security:
  - ApiKeyAuth: []
  - OAuth2CC: [pwi.read, pwi.write]

components:
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: X-Api-Key
    OAuth2CC:
      type: oauth2
      flows:
        clientCredentials:
          tokenUrl: https://auth.psizero.com/oauth/token
          scopes:
            pwi.read: Read PWI states/metrics
            pwi.write: Create/transform/measure PWI states

  parameters:
    IdempotencyKey:
      in: header
      name: Idempotency-Key
      schema: { type: string, maxLength: 128 }
      required: false
      description: Idempotency for POST/PUT (UUID recommended).
    Cursor:
      in: query
      name: cursor
      schema: { type: string }
      required: false
    PageSize:
      in: query
      name: page_size
      schema: { type: integer, minimum: 1, maximum: 500, default: 100 }

  headers:
    X-RateLimit-Limit: { schema: { type: integer } }
    X-RateLimit-Remaining: { schema: { type: integer } }
    X-RateLimit-Reset: { schema: { type: integer } }
    Retry-After: { schema: { type: integer } }

  responses:
    ProblemJson:
      description: RFC 7807 Problem Details
      content:
        application/problem+json:
          schema: { $ref: '#/components/schemas/Problem' }

  schemas:
    Problem:
      type: object
      required: [type, title]
      properties:
        type: { type: string, format: uri }
        title: { type: string }
        status: { type: integer }
        detail: { type: string }
        instance: { type: string, format: uri }
        code: { type: string }
        meta: { type: object, additionalProperties: true }

    # ---------- Core Prime-Basis ----------
    PrimeSet:
      type: array
      minItems: 1
      items: { type: integer, minimum: 2, description: "Prime eigenstate index" }

    Amplitudes:
      type: array
      description: Complex amplitudes as [re, im] pairs aligned to 'primes'
      items:
        type: array
        minItems: 2
        maxItems: 2
        items: { type: number }

    PhaseSeeding:
      type: object
      description: Golden/silver/custom phase scaffolds for non-local stability [oai_citation:4‡nonlocal-prime-communication.md](file-service://file-UNzFcw5xbAYXJ7z8G9fhSE).
      properties:
        golden: { type: boolean, default: false }
        silver: { type: boolean, default: false }
        custom:
          type: array
          items: { type: number, description: radians }

    BasisExtension:
      type: object
      description: Optional enhancements in p-adic and quantum-group formalisms [oai_citation:5‡condensed-quantum-formalism.md](file-service://file-3RisF1NHjwcBGPJtgYy8Rg).
      properties:
        pAdic:
          type: object
          properties:
            p: { type: integer, minimum: 2, description: "p-adic prime for H_p" }
            enabled: { type: boolean, default: false }
        quantumGroup:
          type: object
          properties:
            q: { type: number, description: "deformation parameter" }
            enabled: { type: boolean, default: false }

    Protection:
      type: object
      description: Topological/TQFT-style protections and protected transforms [oai_citation:6‡condensed-quantum-formalism.md](file-service://file-3RisF1NHjwcBGPJtgYy8Rg).
      properties:
        topological:
          type: boolean
          default: false
        transform:
          type: string
          enum: [T, K, custom]
          description: T(p)=exp(2πi ω(p)), KAM/TQFT-style protection hooks.
        params:
          type: object
          additionalProperties: true

    ResonanceOperator:
      type: object
      description: R(n) / R_q(θ) / custom resonance operator on prime basis [oai_citation:7‡condensed-quantum-formalism.md](file-service://file-3RisF1NHjwcBGPJtgYy8Rg).
      properties:
        type:
          type: string
          enum: [R, Rn, Rq, custom]
          default: R
        n: { type: integer, description: for R(n) }
        theta: { type: number, description: for R_q(θ) }
        meta: { type: object, additionalProperties: true }

    StateConfig:
      type: object
      properties:
        primes: { $ref: '#/components/schemas/PrimeSet' }
        amplitudes: { $ref: '#/components/schemas/Amplitudes' }
        phaseSeeding: { $ref: '#/components/schemas/PhaseSeeding' }
        basisExtension: { $ref: '#/components/schemas/BasisExtension' }
        protection: { $ref: '#/components/schemas/Protection' }
        notes: { type: string }

    StateRef:
      type: object
      properties:
        id: { type: string }
        createdAt: { type: string, format: date-time }
        config: { $ref: '#/components/schemas/StateConfig' }

    # ---------- Evolution / Gates ----------
    EvolutionSchedule:
      type: object
      properties:
        steps: { type: integer, default: 128 }
        dt: { type: number, default: 0.1 }
        lambda: { type: number, default: 0.02, description: entropy damping }
        mixer:
          type: object
          properties:
            gamma0: { type: number, default: 0.2 }
            gammaGrowth: { type: number, default: 0.001 }
            temperature0: { type: number, default: 1.0 }
            beta: { type: number, default: 0.98 }

    Gate:
      type: object
      description: Prime-wave gates incl. phase, controlled, and protected T-gate [oai_citation:8‡condensed-quantum-formalism.md](file-service://file-3RisF1NHjwcBGPJtgYy8Rg).
      properties:
        name:
          type: string
          enum: [PHASE, RX, RY, RZ, CNOT, CP, T, TP, CUSTOM]
        target: { type: integer, description: index into primes[] }
        control: { type: integer, nullable: true }
        theta: { type: number, description: radians for rotations }
        params: { type: object, additionalProperties: true }

    GateSequence:
      type: array
      items: { $ref: '#/components/schemas/Gate' }

    # ---------- Observables ----------
    Metrics:
      type: object
      properties:
        entropy: { type: number }
        coherence: { type: number }
        resonanceStrength: { type: number }
        locality: { type: number, description: lower=more non-local }
        dominance: { type: number }
        protected: { type: boolean }

    Snapshot:
      type: object
      properties:
        step: { type: integer }
        amplitudes: { $ref: '#/components/schemas/Amplitudes' }
        phases:
          type: array
          items: { type: number }
        metrics: { $ref: '#/components/schemas/Metrics' }

    # ---------- Entanglement / Interference ----------
    EntangleSpec:
      type: object
      description: Build |ψ_pq⟩ = (|p⟩|q⟩ + e^{iθ}|q⟩|p⟩)/√2 with optional protection [oai_citation:9‡condensed-quantum-formalism.md](file-service://file-3RisF1NHjwcBGPJtgYy8Rg).
      properties:
        stateA: { type: string }
        stateB: { type: string }
        theta: { type: number, default: 0.0 }
        protection: { $ref: '#/components/schemas/Protection' }

    InterferenceSpec:
      type: object
      properties:
        stateA: { type: string }
        stateB: { type: string }
        U:
          type: array
          description: Optional unitary as sparse op (indices & values)
          items:
            type: object
            properties:
              i: { type: integer }
              j: { type: integer }
              re: { type: number }
              im: { type: number }

    # ---------- Measurement ----------
    MeasurementRequest:
      type: object
      properties:
        state: { type: string }
        basis:
          type: string
          enum: [prime, composite, custom]
          default: prime
        shots: { type: integer, default: 1024 }
        observables:
          type: array
          items:
            type: object
            properties:
              operator: { $ref: '#/components/schemas/ResonanceOperator' }

    MeasurementResult:
      type: object
      properties:
        histogram:
          type: array
          items:
            type: object
            properties:
              key: { type: string }
              prob: { type: number }
        expectations:
          type: array
          items:
            type: object
            properties:
              operator: { $ref: '#/components/schemas/ResonanceOperator' }
              value: { type: number }

    # ---------- Crypto ----------
    KeyGenRequest:
      type: object
      properties:
        primes: { $ref: '#/components/schemas/PrimeSet' }
        protection: { $ref: '#/components/schemas/Protection' }
      required: [primes]

    KeyBundle:
      type: object
      properties:
        keyId: { type: string }
        public: { type: string }
        secret: { type: string }
        meta: { type: object, additionalProperties: true }

    EncryptRequest:
      type: object
      properties:
        keyId: { type: string }
        message: { type: string }
        protection: { $ref: '#/components/schemas/Protection' }
      required: [keyId, message]

    Ciphertext:
      type: object
      properties:
        ct: { type: string }
        tag: { type: string }
        meta: { type: object, additionalProperties: true }

paths:
  # ---------- States ----------
  /v1/pwi/states:
    post:
      tags: [States, PWI]
      summary: Prepare a prime-wave state
      parameters:
        - $ref: '#/components/parameters/IdempotencyKey'
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/StateConfig' }
            examples:
              basic:
                value:
                  primes: [2,3,5,7]
                  phaseSeeding: { golden: true, silver: true }
                  basisExtension: { pAdic: { enabled: true, p: 5 }, quantumGroup: { enabled: true, q: 0.8 } }
                  protection: { topological: true, transform: T }
      responses:
        '201':
          description: State created
          content:
            application/json:
              schema: { $ref: '#/components/schemas/StateRef' }
        '400': { $ref: '#/components/responses/ProblemJson' }

  /v1/pwi/states/{id}:
    get:
      tags: [States]
      summary: Get state metadata
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      responses:
        '200':
          description: State reference
          content:
            application/json:
              schema: { $ref: '#/components/schemas/StateRef' }
        '404': { $ref: '#/components/responses/ProblemJson' }

    delete:
      tags: [States]
      summary: Delete a state
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      responses:
        '204': { description: Deleted }
        '404': { $ref: '#/components/responses/ProblemJson' }

  # ---------- Evolution & Gates ----------
  /v1/pwi/states/{id}/evolve:
    post:
      tags: [Evolution]
      summary: Evolve state under H0 + λ·R with mixer/entropy schedule [oai_citation:10‡condensed-quantum-formalism.md](file-service://file-3RisF1NHjwcBGPJtgYy8Rg)
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
        - $ref: '#/components/parameters/IdempotencyKey'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                operator: { $ref: '#/components/schemas/ResonanceOperator' }
                schedule: { $ref: '#/components/schemas/EvolutionSchedule' }
      responses:
        '200':
          description: Final snapshot and metrics
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Snapshot' }
        '404': { $ref: '#/components/responses/ProblemJson' }

  /v1/pwi/states/{id}/gates:
    post:
      tags: [Evolution]
      summary: Apply a sequence of prime-wave gates (incl. protected T-gate) [oai_citation:11‡condensed-quantum-formalism.md](file-service://file-3RisF1NHjwcBGPJtgYy8Rg)
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
        - $ref: '#/components/parameters/IdempotencyKey'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                gates: { $ref: '#/components/schemas/GateSequence' }
      responses:
        '200':
          description: Snapshot after gates
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Snapshot' }
        '404': { $ref: '#/components/responses/ProblemJson' }

  # ---------- Entanglement ----------
  /v1/pwi/entangle:
    post:
      tags: [Entanglement]
      summary: Create an entangled composite state |ψ_pq⟩ with optional protection [oai_citation:12‡condensed-quantum-formalism.md](file-service://file-3RisF1NHjwcBGPJtgYy8Rg)
      parameters:
        - $ref: '#/components/parameters/IdempotencyKey'
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/EntangleSpec' }
      responses:
        '201':
          description: Composite state handle
          content:
            application/json:
              schema: { $ref: '#/components/schemas/StateRef' }
        '400': { $ref: '#/components/responses/ProblemJson' }

  # ---------- Interference ----------
  /v1/pwi/interference:
    post:
      tags: [Interference]
      summary: Compute interference I(p,q) under optional U(t) [oai_citation:13‡condensed-quantum-formalism.md](file-service://file-3RisF1NHjwcBGPJtgYy8Rg)
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/InterferenceSpec' }
      responses:
        '200':
          description: Interference snapshot
          content:
            application/json:
              schema:
                type: object
                properties:
                  intensity: { type: number }
                  snapshot: { $ref: '#/components/schemas/Snapshot' }
        '400': { $ref: '#/components/responses/ProblemJson' }

  # ---------- Measurement ----------
  /v1/pwi/measure:
    post:
      tags: [Measurement]
      summary: Measure a state in prime/composite/custom basis; expectation of R(·) [oai_citation:14‡condensed-quantum-formalism.md](file-service://file-3RisF1NHjwcBGPJtgYy8Rg)
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/MeasurementRequest' }
      responses:
        '200':
          description: Histogram and expectations
          content:
            application/json:
              schema: { $ref: '#/components/schemas/MeasurementResult' }
        '400': { $ref: '#/components/responses/ProblemJson' }

  # ---------- Crypto ----------
  /v1/pwi/crypto/keys:
    post:
      tags: [Crypto]
      summary: Generate protected prime-wave keys (phase-encoded) [oai_citation:15‡condensed-quantum-formalism.md](file-service://file-3RisF1NHjwcBGPJtgYy8Rg)
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/KeyGenRequest' }
      responses:
        '201':
          description: Key bundle
          content:
            application/json:
              schema: { $ref: '#/components/schemas/KeyBundle' }
        '400': { $ref: '#/components/responses/ProblemJson' }

  /v1/pwi/crypto/encrypt:
    post:
      tags: [Crypto]
      summary: Encrypt with protected prime-wave keys (phase/topology hardened) [oai_citation:16‡condensed-quantum-formalism.md](file-service://file-3RisF1NHjwcBGPJtgYy8Rg)
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/EncryptRequest' }
      responses:
        '200':
          description: Ciphertext
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Ciphertext' }
        '400': { $ref: '#/components/responses/ProblemJson' }

  /v1/pwi/crypto/decrypt:
    post:
      tags: [Crypto]
      summary: Decrypt ciphertext with prime-wave keys
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [keyId, ct, tag]
              properties:
                keyId: { type: string }
                ct: { type: string }
                tag: { type: string }
      responses:
        '200':
          description: Cleartext
          content:
            application/json:
              schema:
                type: object
                properties:
                  message: { type: string }
        '400': { $ref: '#/components/responses/ProblemJson' }

  # ---------- Telemetry ----------
  /v1/pwi/states/{id}/snapshots:
    get:
      tags: [Telemetry]
      summary: Page through snapshots for a state
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
        - $ref: '#/components/parameters/Cursor'
        - $ref: '#/components/parameters/PageSize'
      responses:
        '200':
          description: Page of snapshots
          content:
            application/json:
              schema:
                type: object
                properties:
                  items:
                    type: array
                    items: { $ref: '#/components/schemas/Snapshot' }
                  next_cursor: { type: string, nullable: true }
        '404': { $ref: '#/components/responses/ProblemJson' }

  /v1/pwi/states/{id}/stream:
    get:
      tags: [Telemetry]
      summary: SSE stream of metrics/snapshots during evolution
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      responses:
        '200':
          description: text/event-stream
          content:
            text/event-stream:
              schema: { type: string }
        '404': { $ref: '#/components/responses/ProblemJson' }

  # ---------- Webhooks ----------
  /v1/pwi/webhooks:
    post:
      tags: [Webhooks]
      summary: Register webhooks for events (entangle, converge, protect, fail)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [url, events]
              properties:
                url: { type: string, format: uri }
                secret: { type: string }
                events:
                  type: array
                  items:
                    type: string
                    enum: [pwi.entangled, pwi.converged, pwi.protected, pwi.failed]
      responses:
        '201':
          description: Webhook registered
          content:
            application/json:
              schema:
                type: object
                properties:
                  id: { type: string }
                  url: { type: string }
                  events:
                    type: array
                    items: { type: string }
        '400': { $ref: '#/components/responses/ProblemJson' }

Notes tying spec → formalism
	•	Prime basis, resonance operators, enhanced gates, protected transforms, p-adic space map to your operators R(n), R_q(\theta), protected T-like gates, and H_p space definitions ￼.
	•	Golden/silver phase scaffolds reflect the non-local phase structures that stabilize channels and reduce locality measure in your NLC framework ￼.
