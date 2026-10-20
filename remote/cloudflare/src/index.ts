// Runs Signal (remote/api) in a Cloudflare Container, so the relay needs no server of its own.
//
// Every request to signal.<domain> reaches this Worker, which passes it, WebSockets included, to
// one container. Signal keeps its sockets in memory, so there is exactly one instance, by name.
// The open sockets of the hosts keep it running; Cloudflare can still restart it, and then every
// host and client reconnects by itself.
import { DurableObject } from "cloudflare:workers";

/** Signal's settings that this Worker passes to the container, from its vars and secrets. */
const SIGNAL_SETTINGS = [
  "REMOTE_TICKET_JWKS_URL",
  "REMOTE_TICKET_PUBLIC_JWKS",
  "REMOTE_CONTROL_PLANE_URL",
  "REMOTE_SESSION_SECRET",
  "REMOTE_AUTH_WEBHOOK_SECRET",
  "REMOTE_METRICS_TOKEN",
  "REMOTE_MAX_CONNECTIONS_PER_USER",
  "REMOTE_MAX_CONNECTIONS_PER_IP",
  "REMOTE_MAX_MESSAGES_PER_MINUTE",
  "CLOUDFLARE_TURN_KEY_ID",
  "CLOUDFLARE_TURN_API_TOKEN",
  "TELEGRAM_BOT_TOKENS",
  "TELEGRAM_WEBHOOK_SECRET",
  "TELEGRAM_WEBHOOK_ORIGIN",
  "SLACK_SIGNING_SECRET",
  "DISCORD_BOT_TOKEN",
  "DISCORD_APPLICATION_ID",
  "DISCORD_MESSAGE_CONTENT",
] as const;

/** Fixed for the container: Cloudflare ends TLS, and the Worker names the client address. */
const CONTAINER_SETTINGS = {
  REMOTE_SIGNAL_HOST: "0.0.0.0",
  REMOTE_SIGNAL_PORT: "8081",
  REMOTE_HEALTH_PORT: "8080",
  REMOTE_TLS_DISABLED: "true",
  REMOTE_TRUST_PROXY: "true",
};

const SIGNAL_PORT = 8081;
const HEALTH_PORT = 8080;
/** Signal stays up while nothing is connected, so a Telegram update does not wait for a cold start. */
const INACTIVITY_TIMEOUT_MS = 24 * 60 * 60 * 1_000;
const READY_ATTEMPTS = 150;
const READY_WAIT_MS = 200;

type Env = { SIGNAL: DurableObjectNamespace<SignalContainer> } & Partial<
  Record<(typeof SIGNAL_SETTINGS)[number], string>
>;

export class SignalContainer extends DurableObject<Env> {
  #starting: Promise<void> | undefined;

  override async fetch(request: Request): Promise<Response> {
    this.#starting ??= this.#startAndWait().finally(() => {
      this.#starting = undefined;
    });
    await this.#starting;

    const url = new URL(request.url);
    url.protocol = "http:";
    url.host = "container";
    const forwarded = new Request(url, request);
    forwarded.headers.delete("host");
    // The Response is returned as it is, so a WebSocket upgrade passes through.
    return this.#container().getTcpPort(SIGNAL_PORT).fetch(forwarded);
  }

  #container(): Container {
    const container = this.ctx.container;
    if (!container) throw new Error("This Durable Object has no container. Check wrangler.jsonc.");
    return container;
  }

  async #startAndWait(): Promise<void> {
    const container = this.#container();
    if (!container.running) {
      container.start({ enableInternet: true, env: signalEnvironment(this.env) });
    }
    await container.setInactivityTimeout(INACTIVITY_TIMEOUT_MS);

    const health = container.getTcpPort(HEALTH_PORT);
    let lastError: unknown;
    for (let attempt = 0; attempt < READY_ATTEMPTS; attempt++) {
      try {
        const response = await health.fetch("http://container/health/ready", { signal: AbortSignal.timeout(1_000) });
        await response.body?.cancel();
        if (response.ok) return;
        lastError = new Error(`Signal answered ${response.status}.`);
      } catch (error) {
        lastError = error;
      }
      await scheduler.wait(READY_WAIT_MS);
    }
    throw new Error("Signal did not become ready.", { cause: lastError });
  }
}

function signalEnvironment(env: Env): Record<string, string> {
  const settings: Record<string, string> = { ...CONTAINER_SETTINGS };
  for (const name of SIGNAL_SETTINGS) {
    const value = env[name];
    if (typeof value === "string" && value !== "") settings[name] = value;
  }
  return settings;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const forwarded = new Request(request);
    // Signal limits connections per address. Cloudflare names the real one.
    const address = request.headers.get("cf-connecting-ip");
    if (address) forwarded.headers.set("x-forwarded-for", address);
    else forwarded.headers.delete("x-forwarded-for");
    return env.SIGNAL.getByName("signal").fetch(forwarded);
  },
} satisfies ExportedHandler<Env>;
