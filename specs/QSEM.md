openapi: 3.1.0
info:
  title: Quantum Semantics API (QSEM)
  version: 1.0.0
  description: |
    Prime-basis semantic encoding, resonance/coherence analysis, and knowledge graphs.
    Semantics derived from the prime Hilbert space, Resonance Operator R(n),
    Semantic Coherence Operator 𝒞, and Knowledge Resonance Γ_know [oai_citation:1‡condensed-quantum-formalism.md](file-service://file-3RisF1NHjwcBGPJtgYy8Rg).

servers:
  - url: https://api.psizero.com
    description: Production
  - url: https://sandbox.psizero.com
    description: Sandbox

tags:
  - name: QSEM
  - name: Encode
  - name: Resonance
  - name: Graph
  - name: Search
  - name: Analogies
  - name: Projection
  - name: Cluster
  - name: Ingest
  - name: Evaluate
  - name: Telemetry
  - name: Webhooks

security:
  - ApiKeyAuth: []
  - OAuth2CC: [qsem.read, qsem.write]

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
            qsem.read: Read vectors/graphs/metrics
            qsem.write: Encode, ingest, train, mutate graphs

  parameters:
    IdempotencyKey:
      in: header
      name: Idempotency-Key
      required: false
      schema: { type: string, maxLength: 128 }
    Cursor:
      in: query
      name: cursor
      schema: { type: string }
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

    # ---------- Core semantic objects ----------
    Concept:
      type: object
      required: [text]
      properties:
        id: { type: string, description: "Optional client id" }
        text: { type: string }
        lang: { type: string, default: "en" }
        meta: { type: object, additionalProperties: true }

    EncodeOptions:
      type: object
      properties:
        basis: { type: string, enum: [prime, hybrid], default: prime }
        dim: { type: integer, description: "Internal truncation/cutoff", default: 2048 }
        normalize: { type: string, enum: [none, l2, probability], default: l2 }
        augment:
          type: object
          properties:
            lowercase: { type: boolean, default: true }
            strip_punct: { type: boolean, default: true }
            decompound: { type: boolean, default: false }
        kernel:
          type: string
          description: "Resonance kernel for phases/couplings"
          default: "prime"
      description: >
        Encoding maps concepts to amplitudes on the prime basis; coherence measured via 𝒞 and R(n) [oai_citation:2‡condensed-quantum-formalism.md](file-service://file-3RisF1NHjwcBGPJtgYy8Rg).

    QSemVector:
      type: object
      required: [concept, alpha]
      properties:
        concept: { $ref: '#/components/schemas/Concept' }
        alpha:
          type: array
          description: "Real amplitudes on the prime basis; phases handled by kernel"
          items: { type: number }

    PairResonance:
      type: object
      properties:
        a: { type: integer, description: "index in vectors[]" }
        b: { type: integer, description: "index in vectors[]" }
        resonance: { type: number, description: "[0,1]" }

    ResonanceMetrics:
      type: object
      properties:
        coherence: { type: number, description: "Global coherence via 𝒞 [oai_citation:3‡condensed-quantum-formalism.md](file-service://file-3RisF1NHjwcBGPJtgYy8Rg)" }
        knowledgeResonance: { type: number, description: "Γ_know metric [oai_citation:4‡condensed-quantum-formalism.md](file-service://file-3RisF1NHjwcBGPJtgYy8Rg)" }
        locality: { type: number, description: "Lower=more non-local" }
        dominance: { type: number, description: "Max component mass" }

    GraphEdge:
      type: object
      properties:
        src: { type: string }
        dst: { type: string }
        w: { type: number, description: "edge weight ~ resonance strength" }
        meta: { type: object, additionalProperties: true }

    GraphRef:
      type: object
      properties:
        id: { type: string }
        nodeCount: { type: integer }
        edgeCount: { type: integer }
        createdAt: { type: string, format: date-time }

    SearchQuery:
      type: object
      properties:
        query: { type: string }
        k: { type: integer, default: 10 }
        filter:
          type: object
          additionalProperties: true

    SearchHit:
      type: object
      properties:
        conceptId: { type: string }
        score: { type: number }
        meta: { type: object, additionalProperties: true }

    AnalogyRequest:
      type: object
      properties:
        a: { type: string, description: "e.g., 'king'" }
        b: { type: string, description: "e.g., 'man'" }
        c: { type: string, description: "e.g., 'woman'" }
        k: { type: integer, default: 5 }

    ProjectionRequest:
      type: object
      properties:
        ids:
          type: array
          items: { type: string }
        basis:
          type: array
          description: "Optional projection primes or learned axes"
          items: { type: integer }
        method: { type: string, enum: [PCA, UMAP, tSNE, prime-subspace], default: prime-subspace }

    ClusterRequest:
      type: object
      properties:
        ids:
          type: array
          items: { type: string }
        algo: { type: string, enum: [kmeans, spectral, hdbscan], default: spectral }
        k: { type: integer, nullable: true }

    IngestDoc:
      type: object
      required: [id, text]
      properties:
        id: { type: string }
        text: { type: string }
        lang: { type: string, default: "en" }
        meta: { type: object, additionalProperties: true }

    IngestRequest:
      type: object
      properties:
        corpusId: { type: string }
        docs:
          type: array
          items: { $ref: '#/components/schemas/IngestDoc' }
        options: { $ref: '#/components/schemas/EncodeOptions' }

    BenchRequest:
      type: object
      properties:
        suite: { type: string, enum: [similarity, clustering, analogy, retrieval], default: similarity }
        graphId: { type: string, nullable: true }
        corpusId: { type: string, nullable: true }
        k: { type: integer, default: 10 }

    TelemetryPoint:
      type: object
      properties:
        t: { type: integer }
        coherence: { type: number }
        knowledgeResonance: { type: number }
        locality: { type: number }
        dominance: { type: number }

paths:
  # ---------- Encode ----------
  /v1/qsem/encode:
    post:
      tags: [Encode, QSEM]
      summary: Encode concepts to prime-basis vectors
      parameters:
        - $ref: '#/components/parameters/IdempotencyKey'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [concepts]
              properties:
                concepts:
                  type: array
                  minItems: 1
                  items: { $ref: '#/components/schemas/Concept' }
                options: { $ref: '#/components/schemas/EncodeOptions' }
            examples:
              trio:
                value:
                  concepts:
                    - { text: "love" }
                    - { text: "entropy" }
                    - { text: "pattern" }
                  options: { basis: "prime", normalize: "l2" }
      responses:
        '200':
          description: Vectors
          content:
            application/json:
              schema:
                type: object
                properties:
                  vectors:
                    type: array
                    items: { $ref: '#/components/schemas/QSemVector' }
        '400': { $ref: '#/components/responses/ProblemJson' }

  # ---------- Resonance / Coherence ----------
  /v1/qsem/resonance:
    post:
      tags: [Resonance]
      summary: Compute coherence and pairwise resonance
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [vectors]
              properties:
                vectors:
                  type: array
                  minItems: 2
                  items: { $ref: '#/components/schemas/QSemVector' }
                graph:
                  type: array
                  items: { $ref: '#/components/schemas/GraphEdge' }
      responses:
        '200':
          description: Coherence and pairwise resonance
          content:
            application/json:
              schema:
                type: object
                properties:
                  metrics: { $ref: '#/components/schemas/ResonanceMetrics' }
                  pairwise:
                    type: array
                    items: { $ref: '#/components/schemas/PairResonance' }
        '400': { $ref: '#/components/responses/ProblemJson' }

  # ---------- Graph build / mutate ----------
  /v1/qsem/graph:
    post:
      tags: [Graph]
      summary: Build a semantic resonance graph from vectors/edges
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                vectors:
                  type: array
                  items: { $ref: '#/components/schemas/QSemVector' }
                edges:
                  type: array
                  items: { $ref: '#/components/schemas/GraphEdge' }
      responses:
        '201':
          description: Graph reference
          content:
            application/json:
              schema: { $ref: '#/components/schemas/GraphRef' }
        '400': { $ref: '#/components/responses/ProblemJson' }

  /v1/qsem/graph/{id}:
    get:
      tags: [Graph]
      summary: Get graph metadata
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      responses:
        '200':
          description: Graph ref
          content:
            application/json:
              schema: { $ref: '#/components/schemas/GraphRef' }
        '404': { $ref: '#/components/responses/ProblemJson' }

    delete:
      tags: [Graph]
      summary: Delete a graph
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      responses:
        '204': { description: Deleted }
        '404': { $ref: '#/components/responses/ProblemJson' }

  # ---------- Search / Retrieval ----------
  /v1/qsem/search:
    post:
      tags: [Search]
      summary: Semantic search over a graph or corpus using resonance scoring [oai_citation:5‡condensed-quantum-formalism.md](file-service://file-3RisF1NHjwcBGPJtgYy8Rg)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              allOf:
                - $ref: '#/components/schemas/SearchQuery'
                - type: object
                  properties:
                    graphId: { type: string, nullable: true }
                    corpusId: { type: string, nullable: true }
      responses:
        '200':
          description: Ranked hits
          content:
            application/json:
              schema:
                type: object
                properties:
                  hits:
                    type: array
                    items: { $ref: '#/components/schemas/SearchHit' }
        '400': { $ref: '#/components/responses/ProblemJson' }

  # ---------- Analogies ----------
  /v1/qsem/analogies:
    post:
      tags: [Analogies]
      summary: Solve A : B :: C : ?
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/AnalogyRequest' }
      responses:
        '200':
          description: Analogy candidates
          content:
            application/json:
              schema:
                type: object
                properties:
                  candidates:
                    type: array
                    items: { $ref: '#/components/schemas/SearchHit' }
        '400': { $ref: '#/components/responses/ProblemJson' }

  # ---------- Projection ----------
  /v1/qsem/project:
    post:
      tags: [Projection]
      summary: Project concepts into low-D views (PCA/UMAP/tSNE/prime-subspace)
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/ProjectionRequest' }
      responses:
        '200':
          description: Coordinates and variance explained
          content:
            application/json:
              schema:
                type: object
                properties:
                  coords:
                    type: array
                    items:
                      type: array
                      items: { type: number }
                  meta: { type: object, additionalProperties: true }
        '400': { $ref: '#/components/responses/ProblemJson' }

  # ---------- Clustering ----------
  /v1/qsem/cluster:
    post:
      tags: [Cluster]
      summary: Cluster concepts with resonance-aware distances
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/ClusterRequest' }
      responses:
        '200':
          description: Cluster labels and centroids
          content:
            application/json:
              schema:
                type: object
                properties:
                  labels:
                    type: array
                    items: { type: integer }
                  centroids:
                    type: array
                    items:
                      type: array
                      items: { type: number }
        '400': { $ref: '#/components/responses/ProblemJson' }

  # ---------- Ingest / Train / Evaluate ----------
  /v1/qsem/ingest:
    post:
      tags: [Ingest]
      summary: Ingest a corpus and build/store semantic vectors
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/IngestRequest' }
      responses:
        '202':
          description: Accepted with a corpus id
          content:
            application/json:
              schema:
                type: object
                properties:
                  corpusId: { type: string }
        '400': { $ref: '#/components/responses/ProblemJson' }

  /v1/qsem/evaluate/bench:
    post:
      tags: [Evaluate]
      summary: Run benchmark suites (similarity, clustering, analogy, retrieval)
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/BenchRequest' }
      responses:
        '200':
          description: Benchmark results
          content:
            application/json:
              schema:
                type: object
                properties:
                  metrics: { type: object, additionalProperties: true }
        '400': { $ref: '#/components/responses/ProblemJson' }

  # ---------- Telemetry ----------
  /v1/qsem/graphs/{id}/telemetry:
    get:
      tags: [Telemetry]
      summary: Stream coherence/Γ_know metrics for a graph (SSE)
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      responses:
        '200':
          description: text/event-stream of TelemetryPoint JSON
          content:
            text/event-stream:
              schema: { type: string }
        '404': { $ref: '#/components/responses/ProblemJson' }

  # ---------- Webhooks ----------
  /v1/qsem/webhooks:
    post:
      tags: [Webhooks]
      summary: Register webhooks (graph.updated, resonance.spike, ingest.done)
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
                    enum: [graph.updated, resonance.spike, ingest.done, bench.ready]
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

Notes (formalism linkage)
	•	Encoding into prime basis and amplitudes align with your prime-number Hilbert space representation ￼.
	•	Resonance metrics use the Semantic Coherence Operator \mathcal{C} and Concept Expectation \langle R(n)\rangle for scoring relatedness ￼.
	•	Knowledge Resonance \Gamma_{\text{know}} provides a global field coupling score used in /resonance and telemetry ￼.
