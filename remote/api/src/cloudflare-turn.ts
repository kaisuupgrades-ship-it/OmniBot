import { isDynamicRecord, isString } from "@omnibot/contracts/runtime-values";
import type { IceServer } from "@omnibot/contracts/signal-protocol/messages";

// Cloudflare Realtime TURN, used in place of a coturn server when `CLOUDFLARE_TURN_KEY_ID` and
// `CLOUDFLARE_TURN_API_TOKEN` are set. Signal asks Cloudflare for one set of credentials, hands that
// set to every session, and asks for a new set before the old one expires. Only signed-in accounts
// get a ticket, and so a session, from this Signal.
//
// The API token is a long-term secret: never log it, and never put it in a frame or an error.

const GENERATE_URL = (keyId: string) =>
  `https://rtc.live.cloudflare.com/v1/turn/keys/${encodeURIComponent(keyId)}/credentials/generate-ice-servers`;

/** How long one set of credentials lasts. Clients refresh theirs well inside this. */
export const CLOUDFLARE_TURN_TTL_SECONDS = 4 * 60 * 60;
/** How often Signal asks for a new set. A failed request keeps the current set and retries sooner. */
export const CLOUDFLARE_TURN_REFRESH_MS = 30 * 60_000;
const RETRY_MS = 60_000;
const REQUEST_TIMEOUT_MS = 10_000;
/** Used while no credentials could be fetched yet: direct connections still work. */
const STUN_ONLY: IceServer[] = [{ urls: "stun:stun.cloudflare.com:3478" }];

export interface CloudflareTurnConfig {
  keyId: string;
  apiToken: string;
}

type Fetch = (input: string, init: RequestInit) => Promise<Response>;

export class CloudflareTurnCredentials {
  readonly #config: CloudflareTurnConfig;
  readonly #fetch: Fetch;
  readonly #now: () => number;
  #current: { iceServers: IceServer[]; expiresAt: number } | null = null;
  #timer: ReturnType<typeof setTimeout> | null = null;

  constructor(config: CloudflareTurnConfig, options: { fetch?: Fetch; now?: () => number } = {}) {
    this.#config = config;
    this.#fetch = options.fetch ?? ((input, init) => fetch(input, init));
    this.#now = options.now ?? Date.now;
  }

  /** Fetches the first set, then keeps it fresh. Resolves even when the first request fails. */
  async start(): Promise<void> {
    const ok = await this.refresh();
    this.#schedule(ok ? CLOUDFLARE_TURN_REFRESH_MS : RETRY_MS);
  }

  stop(): void {
    if (this.#timer) clearTimeout(this.#timer);
    this.#timer = null;
  }

  /** The servers to hand out now. Expired credentials are never handed out. */
  iceServers(): IceServer[] {
    const current = this.#current;
    if (!current || current.expiresAt <= this.#now()) return STUN_ONLY;
    return current.iceServers;
  }

  /** Asks Cloudflare for a new set. Returns false, and keeps the current set, when that fails. */
  async refresh(): Promise<boolean> {
    try {
      const response = await this.#fetch(GENERATE_URL(this.#config.keyId), {
        method: "POST",
        headers: { Authorization: `Bearer ${this.#config.apiToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ttl: CLOUDFLARE_TURN_TTL_SECONDS }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (!response.ok) {
        console.error(`OmniBot Remote API could not get Cloudflare TURN credentials: HTTP ${response.status}.`);
        return false;
      }
      const iceServers = parseIceServers(await response.json());
      if (!iceServers) {
        console.error("OmniBot Remote API got Cloudflare TURN credentials in an unexpected shape.");
        return false;
      }
      this.#current = { iceServers, expiresAt: this.#now() + CLOUDFLARE_TURN_TTL_SECONDS * 1_000 };
      return true;
    } catch {
      // The error can carry the request, so only its kind is logged.
      console.error("OmniBot Remote API could not reach Cloudflare TURN.");
      return false;
    }
  }

  #schedule(delay: number): void {
    this.#timer = setTimeout(async () => {
      const ok = await this.refresh();
      this.#schedule(ok ? CLOUDFLARE_TURN_REFRESH_MS : RETRY_MS);
    }, delay);
    this.#timer.unref?.();
  }
}

/** Keeps the servers with valid URLs. Drops port 53, which browsers block, so ICE does not wait on it. */
export function parseIceServers(value: unknown): IceServer[] | null {
  if (!isDynamicRecord(value) || !Array.isArray(value.iceServers)) return null;
  const servers: IceServer[] = [];
  for (const entry of value.iceServers) {
    const server = parseIceServer(entry);
    if (server === null) return null;
    if (server !== "empty") servers.push(server);
  }
  return servers.length > 0 ? servers : null;
}

/** One server, `"empty"` when only port 53 URLs were left out, or null when it is malformed. */
function parseIceServer(entry: unknown): IceServer | "empty" | null {
  if (!isDynamicRecord(entry)) return null;
  const { urls, username, credential } = entry;
  const all: unknown[] | null = isString(urls) ? [urls] : Array.isArray(urls) ? urls : null;
  if (all === null) return null;
  const kept: string[] = [];
  for (const url of all) {
    if (!isString(url) || !/^(stun|turns?):/u.test(url)) return null;
    if (!/:53(\?|$)/u.test(url)) kept.push(url);
  }
  if (username !== undefined && !isString(username)) return null;
  if (credential !== undefined && !isString(credential)) return null;
  if (kept.length === 0) return "empty";
  return {
    urls: kept,
    ...(isString(username) ? { username } : {}),
    ...(isString(credential) ? { credential } : {}),
  };
}
