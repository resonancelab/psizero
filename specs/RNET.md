High-level architecture

Goal: let many clients co-create and sync to a shared prime-basis resonance context (“space”), with ultra-low-latency phase updates and entropy/coherence telemetry.

Key entities
	•	Space: the shared resonance context (ID, basis, phases, operators, entropy model, policy).
	•	Basis: the agreed prime set [p_1,\dots,p_k], truncation, ordering.
	•	PhaseProfile: phases/offsets (golden/silver/custom arrays) + seeding rules.
	•	OperatorSet: resonance/mixer params; optional semantic operator config.
	•	EntropyField: damping λ, plateau rules, collapse thresholds.
	•	Member: a participant (app/user/device) with role/permissions.
	•	Session: a member’s live connection (REST + SSE/WebSocket).
	•	Snapshot: compact state at version v.
	•	Delta: minimal update between v → v+1.

Consistency & performance
	•	Authoritative state on server; clients propose deltas (commutative ops).
	•	CRDT-style, monotone updates: basis changes require space “epoch bump”; phase/param updates use Lamport clock + causal vector cv.
	•	Real-time fanout via WebSocket; SSE as fallback.
	•	Binary delta frames using MessagePack/CBOR; JSON over REST.
	•	Targets: p95 create/join < 120 ms; p95 delta fanout < 60 ms (regional), 5–20 Hz telemetry.
	•	Horizontal scale: stateless API → Redis/NATS (pub/sub), Aurora/PG (state), Elasticache (hot snapshots), ClickHouse (metrics).

Security
	•	API key (header X-Api-Key) for REST.
	•	Short-lived JWT (minted via REST) for WebSocket.
	•	RBAC per space: owner, admin, writer, reader.
	•	Webhooks signed with X-RS-Signature: sha256=….

⸻

OpenAPI 3.1 (core)

openapi: 3.1.0
info:
  title: Resonance Spaces API
  version: 1.0.0
  description: Create/join/synchronize prime-basis resonance spaces with real-time deltas and telemetry.

servers:
  - url: https://api.psizero.com
  - url: https://sandbox.psizero.com

tags:
  - name: Spaces
  - name: Sessions
  - name: State
  - name: Telemetry
  - name: Webhooks
  - name: Auth

security:
  - ApiKeyAuth: []

components:
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: X-Api-Key

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
      content: { application/problem+json: { schema: { $ref: '#/components/schemas/Problem' } } }

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

    Role:
      type: string
      enum: [owner, admin, writer, reader]

    PrimeSet:
      type: array
      minItems: 1
      items: { type: integer, minimum: 2, description: "prime eigenstate index" }

    PhaseProfile:
      type: object
      properties:
        golden: { type: boolean, default: true }
        silver: { type: boolean, default: true }
        custom:
          type: array
          items: { type: number, description: "radians" }

    OperatorSet:
      type: object
      properties:
        mixer:
          type: object
          properties:
            gamma0: { type: number, default: 0.2 }
            gammaGrowth: { type: number, default: 0.001 }
            temperature0: { type: number, default: 1.0 }
            beta: { type: number, default: 0.98 }
        resonanceTarget: { type: number, default: 0.8 }
        localityBias: { type: number, default: 0.3 }
        semantic:
          type: object
          properties:
            enabled: { type: boolean, default: false }
            kernel: { type: string, default: "prime" }

    EntropyField:
      type: object
      properties:
        lambda: { type: number, default: 0.02 }
        plateauEps: { type: number, default: 1e-6 }
        plateauT: { type: integer, default: 150 }
        collapseThreshold: { type: number, default: 0.97 }

    SpacePolicy:
      type: object
      properties:
        maxMembers: { type: integer, default: 128 }
        publishHz: { type: integer, default: 30 }
        historySeconds: { type: integer, default: 600 }
        allowGuest: { type: boolean, default: false }

    SpaceConfig:
      type: object
      properties:
        name: { type: string }
        basis:
          type: object
          properties:
            primes: { $ref: '#/components/schemas/PrimeSet' }
            order: { type: string, enum: [ascending, learned], default: ascending }
            cutoff: { type: integer, description: "truncate basis length", default: 2048 }
        phases: { $ref: '#/components/schemas/PhaseProfile' }
        operators: { $ref: '#/components/schemas/OperatorSet' }
        entropy: { $ref: '#/components/schemas/EntropyField' }
        policy: { $ref: '#/components/schemas/SpacePolicy' }

    Space:
      type: object
      properties:
        id: { type: string }
        createdAt: { type: string, format: date-time }
        ownerOrg: { type: string }
        epoch: { type: integer, description: "increments when basis changes" }
        version: { type: integer, description: "monotone state version" }
        config: { $ref: '#/components/schemas/SpaceConfig' }
        members: { type: integer }
        status: { type: string, enum: [active, locked, archived] }

    Member:
      type: object
      properties:
        id: { type: string }
        userId: { type: string }
        role: { $ref: '#/components/schemas/Role' }
        joinedAt: { type: string, format: date-time }

    SessionToken:
      type: object
      properties:
        spaceId: { type: string }
        sessionId: { type: string }
        websocketUrl: { type: string }
        sseUrl: { type: string }
        token: { type: string, description: "JWT for RT auth" }
        expiresIn: { type: integer }

    Telemetry:
      type: object
      properties:
        t: { type: integer }
        resonanceStrength: { type: number }
        coherence: { type: number }
        locality: { type: number }
        entropy: { type: number }
        dominance: { type: number }

    Snapshot:
      type: object
      properties:
        spaceId: { type: string }
        epoch: { type: integer }
        version: { type: integer }
        state:
          type: object
          properties:
            phases:
              type: array
              items: { type: number }
            operators: { $ref: '#/components/schemas/OperatorSet' }
            entropy: { $ref: '#/components/schemas/EntropyField' }

    Delta:
      type: object
      description: Minimal, commutative state update with causal vector
      properties:
        fromVersion: { type: integer }
        toVersion: { type: integer }
        cv:
          type: array
          items: { type: integer }
        ops:
          type: array
          items:
            type: object
            properties:
              op: { type: string, enum: [set_phase, shift_phase, set_operator, set_entropy, set_policy] }
              path: { type: string, description: "JSON pointer into state" }
              value: {}
              meta: { type: object, additionalProperties: true }

paths:

  # ---- AUTH (mint RT token) ----
  /v1/spaces/{id}/sessions:
    post:
      tags: [Sessions]
      summary: Create a live session token (WebSocket/SSE)
      security: [{ ApiKeyAuth: [] }]
      parameters:
        - name: id
          in: path
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
                role: { $ref: '#/components/schemas/Role' }
                displayName: { type: string }
      responses:
        '201': { description: Session token, content: { application/json: { schema: { $ref: '#/components/schemas/SessionToken' } } } }
        '404': { $ref: '#/components/responses/ProblemJson' }

  # ---- SPACES CRUD ----
  /v1/spaces:
    post:
      tags: [Spaces]
      summary: Create a resonance space
      security: [{ ApiKeyAuth: [] }]
      parameters: [ { $ref: '#/components/parameters/IdempotencyKey' } ]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/SpaceConfig' }
            examples:
              basic:
                value:
                  name: "demo-room"
                  basis: { primes: [2,3,5,7,11,13], cutoff: 1024 }
                  phases: { golden: true, silver: true }
                  operators: { resonanceTarget: 0.85 }
                  entropy: { lambda: 0.03, collapseThreshold: 0.96 }
      responses:
        '201': { description: Space, content: { application/json: { schema: { $ref: '#/components/schemas/Space' } } } }
        '400': { $ref: '#/components/responses/ProblemJson' }

    get:
      tags: [Spaces]
      summary: List spaces
      security: [{ ApiKeyAuth: [] }]
      parameters:
        - $ref: '#/components/parameters/Cursor'
        - $ref: '#/components/parameters/PageSize'
      responses:
        '200':
          description: Page of spaces
          content:
            application/json:
              schema:
                type: object
                properties:
                  items: { type: array, items: { $ref: '#/components/schemas/Space' } }
                  next_cursor: { type: string, nullable: true }

  /v1/spaces/{id}:
    get:
      tags: [Spaces]
      summary: Get a space
      security: [{ ApiKeyAuth: [] }]
      parameters: [ { name: id, in: path, required: true, schema: { type: string } } ]
      responses:
        '200': { description: Space, content: { application/json: { schema: { $ref: '#/components/schemas/Space' } } } }
        '404': { $ref: '#/components/responses/ProblemJson' }

    patch:
      tags: [Spaces]
      summary: Update non-basis config (phases/operators/entropy/policy)
      security: [{ ApiKeyAuth: [] }]
      parameters:
        - { name: id, in: path, required: true, schema: { type: string } }
        - $ref: '#/components/parameters/IdempotencyKey'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                phases: { $ref: '#/components/schemas/PhaseProfile' }
                operators: { $ref: '#/components/schemas/OperatorSet' }
                entropy: { $ref: '#/components/schemas/EntropyField' }
                policy: { $ref: '#/components/schemas/SpacePolicy' }
      responses:
        '200': { description: Space, content: { application/json: { schema: { $ref: '#/components/schemas/Space' } } } }
        '404': { $ref: '#/components/responses/ProblemJson' }

  /v1/spaces/{id}/basis:
    post:
      tags: [Spaces]
      summary: Replace basis (epoch bump; disruptive)
      security: [{ ApiKeyAuth: [] }]
      parameters:
        - { name: id, in: path, required: true, schema: { type: string } }
        - $ref: '#/components/parameters/IdempotencyKey'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [primes]
              properties:
                primes: { $ref: '#/components/schemas/PrimeSet' }
                order: { type: string, enum: [ascending, learned], default: ascending }
                cutoff: { type: integer, default: 2048 }
      responses:
        '200': { description: New space epoch, content: { application/json: { schema: { $ref: '#/components/schemas/Space' } } } }
        '404': { $ref: '#/components/responses/ProblemJson' }

  # ---- STATE SYNC ----
  /v1/spaces/{id}/snapshot:
    get:
      tags: [State]
      summary: Get current compact snapshot (for catch-up)
      security: [{ ApiKeyAuth: [] }]
      parameters: [ { name: id, in: path, required: true, schema: { type: string } } ]
      responses:
        '200': { description: Snapshot, content: { application/json: { schema: { $ref: '#/components/schemas/Snapshot' } } } }
        '404': { $ref: '#/components/responses/ProblemJson' }

  /v1/spaces/{id}/deltas:
    post:
      tags: [State]
      summary: Propose a delta (server validates/merges; returns new version)
      security: [{ ApiKeyAuth: [] }]
      parameters:
        - { name: id, in: path, required: true, schema: { type: string } }
        - $ref: '#/components/parameters/IdempotencyKey'
      requestBody:
        required: true
        content: { application/json: { schema: { $ref: '#/components/schemas/Delta' } } }
      responses:
        '200': { description: Accepted & merged snapshot, content: { application/json: { schema: { $ref: '#/components/schemas/Snapshot' } } } }
        '409': { description: Version conflict; fetch snapshot and retry, content: { application/problem+json: { schema: { $ref: '#/components/schemas/Problem' } } } }
        '404': { $ref: '#/components/responses/ProblemJson' }

  # ---- TELEMETRY ----
  /v1/spaces/{id}/telemetry:
    get:
      tags: [Telemetry]
      summary: SSE stream of Telemetry (5–20 Hz)
      security: [{ ApiKeyAuth: [] }]
      parameters: [ { name: id, in: path, required: true, schema: { type: string } } ]
      responses:
        '200':
          description: text/event-stream of Telemetry JSON
          content:
            text/event-stream:
              schema: { type: string }
        '404': { $ref: '#/components/responses/ProblemJson' }

  # ---- WEBHOOKS ----
  /v1/webhooks:
    post:
      tags: [Webhooks]
      summary: Register webhooks for space events
      security: [{ ApiKeyAuth: [] }]
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
                    enum: [space.updated, basis.changed, plateau, collapse, member.joined, member.left]
      responses:
        '201':
          description: Webhook
          content:
            application/json:
              schema:
                type: object
                properties:
                  id: { type: string }
                  url: { type: string }
                  events: { type: array, items: { type: string } }
        '400': { $ref: '#/components/responses/ProblemJson' }


⸻

Real-time protocol

WebSocket URL: wss://rt.psizero.com/spaces/{id}
Auth: Bearer JWT from /v1/spaces/{id}/sessions (in Authorization header or ?token=)

Client → Server frames (MessagePack or JSON):

{ "type": "hello", "version": 1, "sessionId": "..." }
{ "type": "subscribe", "kinds": ["telemetry","deltas"] }
{ "type": "propose_delta", "delta": { "...": "as per schema" } }
{ "type": "ping", "ts": 1737000123 }

Server → Client frames:

{ "type": "welcome", "spaceId": "...", "epoch": 3, "version": 128 }
{ "type": "snapshot", "snapshot": { "...": "schema Snapshot" } }
{ "type": "delta", "fromVersion": 128, "toVersion": 129, "ops": [ ... ] }
{ "type": "telemetry", "t": 1012, "resonanceStrength": 0.83, "coherence": 0.77, ... }
{ "type": "conflict", "expectedFrom": 129, "actual": 131 }   // client should refetch snapshot
{ "type": "pong", "ts": 1737000123 }
{ "type": "event", "name": "collapse", "at": "2025-09-15T22:14:08Z" }

Ordering/consistency
	•	Server applies deltas in version order; fanouts include fromVersion/toVersion.
	•	Clients buffer out-of-order deltas or request snapshot upon conflict.

⸻

npm SDK (shape) + example

// npm i @psizero/resonance-spaces
import { ResonanceClient } from "@psizero/resonance-spaces";

const rs = new ResonanceClient({ apiKey: process.env.BITGEM_API_KEY! });

// 1) Create a space
const space = await rs.spaces.create({
  name: "team-room",
  basis: { primes: [2,3,5,7,11,13], cutoff: 1024 },
  phases: { golden: true, silver: true },
  operators: { resonanceTarget: 0.85 },
  entropy: { lambda: 0.03, collapseThreshold: 0.96 }
});

// 2) Open a realtime session (WebSocket under the hood)
const session = await rs.sessions.open(space.id, { role: "writer", displayName: "seb" });

// Subscribe to telemetry & deltas
session.on("telemetry", (m) => console.log("telemetry", m));
session.on("delta", (d) => console.log("delta v", d.toVersion));

// 3) Propose a delta (shift a phase bucket)
await session.proposeDelta({
  fromVersion: session.version,
  toVersion: session.version + 1,
  cv: [session.version],
  ops: [
    { op: "shift_phase", path: "/state/phases/3", value: 0.0123 }
  ]
});

SDK internals (brief)
	•	REST via fetch with X-Api-Key.
	•	RT via WebSocket; automatic reconnect + backoff; snapshot-on-conflict.
	•	Optional binary transport (MessagePack) with seamless fallback to JSON.

⸻

Options & settings recap (what a space can configure)
	•	Basis
	•	primes[], order (ascending/learned), cutoff
	•	Impact: dimensionality, bandwidth, compute budget
	•	Phases
	•	Golden/silver toggles; custom phase arrays
	•	Impact: stability of non-local locking
	•	Operators
	•	Mixer (γ, β, T), resonanceTarget, localityBias, optional semantic kernel
	•	Impact: convergence speed vs. exploration
	•	Entropy Field
	•	λ (damping), plateau/collapse thresholds
	•	Impact: timing of “collapse” (agreement) events
	•	Policy
	•	max members, publishHz, history depth, guest access
	•	Impact: cost control and multi-tenant fairness
	•	Roles/ACL
	•	owner/admin/writer/reader gating for mutating deltas vs. read-only sync

⸻

Operational notes
	•	Sharding by spaceId to keep hot spaces “local” to a node.
	•	Edge regions for WS termination; state replicated via Redis streams/NATS.
	•	Cold storage of snapshots every N versions; replay deltas for warm catch-up.
	•	Billing/quotas by: space-minutes, deltas/min, bandwidth, telemetry rate.
