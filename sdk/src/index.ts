/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ClientOptions {
  baseUrl?: string;
  apiKey: string;
  fetchImpl?: typeof fetch;
}

export interface RequestOptions {
  idempotencyKey?: string;
  signal?: AbortSignal;
}

export class NomyxClient {
  private baseUrl: string;
  private apiKey: string;
  private fetchImpl: typeof fetch;

  constructor(opts: ClientOptions) {
    this.baseUrl = opts.baseUrl ?? "https://sandbox.nomyx.dev";
    this.apiKey  = opts.apiKey;
    this.fetchImpl = opts.fetchImpl ?? fetch;
  }

  private async req<T>(path: string, init: RequestInit, opts?: RequestOptions): Promise<T> {
    const headers = new Headers(init.headers ?? {});
    headers.set("X-Api-Key", this.apiKey);
    if (opts?.idempotencyKey) headers.set("Idempotency-Key", opts.idempotencyKey);
    headers.set("Content-Type", "application/json");
    const res = await this.fetchImpl(`${this.baseUrl}${path}`, { ...init, headers, signal: opts?.signal });
    if (!res.ok) {
      let detail: any = await res.text();
      try { detail = JSON.parse(detail); } catch {}
      throw new Error(`HTTP ${res.status}: ${typeof detail === "string" ? detail : JSON.stringify(detail)}`);
    }
    return res.json() as Promise<T>;
  }

  // ---------- SRS ----------
  async srsSolve(body: any, opts?: RequestOptions) {
    return this.req("/v1/srs/solve", { method: "POST", body: JSON.stringify(body) }, opts);
  }

  // ---------- HQE ----------
  async hqeSimulate(body: any, opts?: RequestOptions) {
    return this.req("/v1/hqe/simulate", { method: "POST", body: JSON.stringify(body) }, opts);
  }

  // ---------- QSEM ----------
  async qsemEncode(body: any, opts?: RequestOptions) {
    return this.req("/v1/qsem/encode", { method: "POST", body: JSON.stringify(body) }, opts);
  }
  async qsemResonance(body: any, opts?: RequestOptions) {
    return this.req("/v1/qsem/resonance", { method: "POST", body: JSON.stringify(body) }, opts);
  }

  // ---------- NLC ----------
  async nlcCreateSession(body: any, opts?: RequestOptions) {
    return this.req("/v1/nlc/sessions", { method: "POST", body: JSON.stringify(body) }, opts);
  }
  async nlcGetSession(id: string, opts?: RequestOptions) {
    return this.req(`/v1/nlc/sessions/${id}`, { method: "GET" }, opts);
  }
  async nlcSendMessage(id: string, content: string, opts?: RequestOptions) {
    return this.req(`/v1/nlc/sessions/${id}/messages`, { method: "POST", body: JSON.stringify({ content }) }, opts);
  }

  // ---------- QCR ----------
  async qcrStart(body: any, opts?: RequestOptions) {
    return this.req("/v1/qcr/sessions", { method: "POST", body: JSON.stringify(body) }, opts);
  }
  async qcrObserve(id: string, prompt: string, opts?: RequestOptions) {
    return this.req(`/v1/qcr/sessions/${id}/observe`, { method: "POST", body: JSON.stringify({ prompt }) }, opts);
  }
  async qcrGet(id: string, opts?: RequestOptions) {
    return this.req(`/v1/qcr/sessions/${id}`, { method: "GET" }, opts);
  }

  // ---------- I-CHING ----------
  async ichingEvolve(question: string, steps = 7, opts?: RequestOptions) {
    return this.req("/v1/iching/evolve", { method: "POST", body: JSON.stringify({ question, steps }) }, opts);
  }

  // ---------- Unified ----------
  async gravityCompute(body: any, opts?: RequestOptions) {
    return this.req("/v1/unified/gravity/compute", { method: "POST", body: JSON.stringify(body) }, opts);
  }
}
