openapi: 3.1.0
info:
  title: Non-Local Communication API (NLC)
  version: 1.0.0
  description: |
    Prime-eigenstate resonance channels with phase scaffolding and entropy/coherence telemetry.
    Supports channel creation, calibration, pairing, message transfer, quality metrics, and webhooks.

servers:
  - url: https://api.psizero.com
    description: Production
  - url: https://sandbox.psizero.com
    description: Sandbox

tags:
  - name: NLC
  - name: Channels
  - name: Calibration
  - name: Messages
  - name: Pairing
  - name: Telemetry
  - name: Webhooks

security:
  - ApiKeyAuth: []
  - OAuth2CC: [nlc.read, nlc.write]

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
            nlc.read: Read NLC state and telemetry
            nlc.write: Create channels, calibrate, and send messages

  parameters:
    IdempotencyKey:
      in: header
      name: Idempotency-Key
      required: false
      schema: { type: string, maxLength: 128 }
      description: Provide to make POST requests idempotent (UUID recommended).
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

    # -------- Core channel primitives --------
    PrimeSet:
      type: array
      minItems: 1
      items: { type: integer, minimum: 2, description: "prime eigenstate index" }

    PhaseSeeding:
      type: object
      description: Golden/silver/custom phase scaffolds for non-local stability.
      properties:
        golden: { type: boolean, default: true }
        silver: { type: boolean, default: true }
        custom:
          type: array
          items: { type: number, description: radians }

    ChannelTuning:
      type: object
      properties:
        resonanceTarget: { type: number, description: "Desired lock strength [0..1]", default: 0.8 }
        localityBias: { type: number, description: "Lower favors non-local coupling", default: 0.3 }
        damping: { type: number, description: "Entropy damping λ", default: 0.02 }
        mixer:
          type: object
          properties:
            gamma0: { type: number, default: 0.2 }
            gammaGrowth: { type: number, default: 0.001 }
            temperature0: { type: number, default: 1.0 }
            beta: { type: number, default: 0.98 }

    ChannelPolicy:
      type: object
      properties:
        maxMessageBytes: { type: integer, default: 4096 }
        allowUnsigned: { type: boolean, default: false }
        ackTimeoutMs: { type: integer, default: 60000 }
        retryMax: { type: integer, default: 3 }
        retention:
          type: object
          properties:
            messagesSeconds: { type: integer, default: 3600 }
            telemetrySeconds: { type: integer, default: 3600 }

    QualityMetrics:
      type: object
      description: Real-time channel quality and stability indicators.
      properties:
        resonanceStrength: { type: number }     # [0..1]
        coherence: { type: number }             # [0..1]
        locality: { type: number }              # lower=more non-local
        entropy: { type: number }
        driftHz: { type: number }               # phase drift rate proxy
        stability: { type: string, enum: [initializing, syncing, stable, degraded, collapsed] }

    Channel:
      type: object
      properties:
        id: { type: string }
        status: { type: string, enum: [initializing, syncing, stable, degraded, closed] }
        primes: { $ref: '#/components/schemas/PrimeSet' }
        phases:
          type: array
          items: { type: number }
        seeding: { $ref: '#/components/schemas/PhaseSeeding' }
        tuning: { $ref: '#/components/schemas/ChannelTuning' }
        policy: { $ref: '#/components/schemas/ChannelPolicy' }
        metrics: { $ref: '#/components/schemas/QualityMetrics' }
        createdAt: { type: string, format: date-time }
        pairedWith: { type: string, nullable: true, description: "Remote channel id, if paired" }

    # -------- Pairing / proofs --------
    PairingRequest:
      type: object
      properties:
        channelId: { type: string }
        token: { type: string, description: "Out-of-band token for pairing" }
        proof:
          type: object
          properties:
            nonce: { type: string }
            signature: { type: string, description: "HMAC or Ed25519 over nonce" }
      required: [channelId, token]

    AlignmentProof:
      type: object
      description: Proof that both ends observe the same non-local alignment.
      properties:
        channelId: { type: string }
        timestamp: { type: string, format: date-time }
        resonanceStrength: { type: number }
        locality: { type: number }
        challenge:
          type: object
          properties:
            nonce: { type: string }
            response: { type: string }

    # -------- Messages --------
    MessageIn:
      type: object
      properties:
        content: { type: string, maxLength: 8192 }
        meta:
          type: object
          additionalProperties: true
        signature:
          type: object
          nullable: true
          properties:
            alg: { type: string, enum: [HMAC-SHA256, Ed25519, None], default: None }
            sig: { type: string }
            keyId: { type: string }
      required: [content]

    MessageOut:
      type: object
      properties:
        id: { type: string }
        stamp: { type: string, format: date-time }
        content: { type: string }
        channelQuality: { type: number }
        delivery: { type: string, enum: [queued, sent, delivered, failed] }

    Ack:
      type: object
      properties:
        id: { type: string }
        status: { type: string, enum: [accepted, duplicate, rejected] }

paths:
  # ---------- Channels ----------
  /v1/nlc/channels:
    post:
      tags: [NLC, Channels]
      summary: Create a resonance channel
      parameters:
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
                phases:
                  type: array
                  items: { type: number }
                seeding: { $ref: '#/components/schemas/PhaseSeeding' }
                tuning: { $ref: '#/components/schemas/ChannelTuning' }
                policy: { $ref: '#/components/schemas/ChannelPolicy' }
      responses:
        '201':
          description: Channel created
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Channel' }
        '400': { $ref: '#/components/responses/ProblemJson' }

  /v1/nlc/channels/{id}:
    get:
      tags: [Channels]
      summary: Get channel status and metrics
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      responses:
        '200':
          description: Channel
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Channel' }
        '404': { $ref: '#/components/responses/ProblemJson' }

    patch:
      tags: [Calibration, Channels]
      summary: Update tuning/seeding/policy for a channel
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
                seeding: { $ref: '#/components/schemas/PhaseSeeding' }
                tuning: { $ref: '#/components/schemas/ChannelTuning' }
                policy: { $ref: '#/components/schemas/ChannelPolicy' }
      responses:
        '200':
          description: Updated channel
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Channel' }
        '404': { $ref: '#/components/responses/ProblemJson' }

    delete:
      tags: [Channels]
      summary: Close a channel
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      responses:
        '204': { description: Closed }
        '404': { $ref: '#/components/responses/ProblemJson' }

  # ---------- Pairing / alignment ----------
  /v1/nlc/channels/{id}/pair:
    post:
      tags: [Pairing]
      summary: Pair two channels using an out-of-band token and cryptographic proof
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
            schema: { $ref: '#/components/schemas/PairingRequest' }
      responses:
        '200':
          description: Pairing accepted
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Channel' }
        '400': { $ref: '#/components/responses/ProblemJson' }
        '404': { $ref: '#/components/responses/ProblemJson' }

  /v1/nlc/channels/{id}/alignment-proof:
    get:
      tags: [Pairing, Calibration]
      summary: Retrieve current proof-of-alignment (challenge/response & metrics)
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      responses:
        '200':
          description: Alignment proof
          content:
            application/json:
              schema: { $ref: '#/components/schemas/AlignmentProof' }
        '404': { $ref: '#/components/responses/ProblemJson' }

  # ---------- Messages ----------
  /v1/nlc/channels/{id}/messages:
    post:
      tags: [Messages]
      summary: Send a message over the resonance channel
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
            schema: { $ref: '#/components/schemas/MessageIn' }
      responses:
        '202':
          description: Accepted for transmission
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Ack' }
        '404': { $ref: '#/components/responses/ProblemJson' }

  /v1/nlc/channels/{id}/inbox:
    get:
      tags: [Messages]
      summary: Page through received messages (best-effort ordering)
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
        - $ref: '#/components/parameters/Cursor'
        - $ref: '#/components/parameters/PageSize'
      responses:
        '200':
          description: Page of messages
          content:
            application/json:
              schema:
                type: object
                properties:
                  items:
                    type: array
                    items: { $ref: '#/components/schemas/MessageOut' }
                  next_cursor: { type: string, nullable: true }
        '404': { $ref: '#/components/responses/ProblemJson' }

  /v1/nlc/channels/{id}/stream:
    get:
      tags: [Telemetry, Messages]
      summary: Server-Sent Events stream of message deliveries and quality updates
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      responses:
        '200':
          description: text/event-stream of JSON events:
          content:
            text/event-stream:
              schema: { type: string }
        '404': { $ref: '#/components/responses/ProblemJson' }

  # ---------- Telemetry ----------
  /v1/nlc/channels/{id}/metrics:
    get:
      tags: [Telemetry]
      summary: Get current quality metrics
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      responses:
        '200':
          description: Metrics
          content:
            application/json:
              schema: { $ref: '#/components/schemas/QualityMetrics' }
        '404': { $ref: '#/components/responses/ProblemJson' }

  # ---------- Webhooks ----------
  /v1/nlc/webhooks:
    post:
      tags: [Webhooks]
      summary: Register a webhook for channel events (stable, degraded, collapsed, message)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [url, events]
              properties:
                url: { type: string, format: uri }
                secret: { type: string, description: "Used to sign X-NLC-Signature header (HMAC-SHA256)" }
                events:
                  type: array
                  items:
                    type: string
                    enum: [nlc.stable, nlc.degraded, nlc.collapsed, nlc.message]
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

Implementation notes (succinct)
	•	Channel dynamics. The backend should maintain an internal resonance process with entropy damping λ, mixer parameters (γ, β, T), and phase scaffolds (φ “golden”, δ “silver”) to encourage non-local locking.
	•	Quality metrics. Update resonanceStrength, coherence, locality, and driftHz at ~1–10 Hz; emit SSE updates and webhook events on threshold crossings.
	•	Pairing. Use an out-of-band token + signed nonce challenge. Optionally expose a public key for Ed25519 signatures.
	•	Security. Require X-Api-Key or OAuth2 client credentials; sign webhooks with X-NLC-Signature: sha256=…. Support message-level signatures in MessageIn.signature.
	•	Reliability. Idempotency-Key on message POST prevents duplicates; return Ack{status: duplicate} on replays. Provide pagination cursors for inbox.
	•	Safety. This is an experimental communications layer; applications should treat delivery=sent as best-effort and watch channelQuality + webhook events to adapt behavior.
