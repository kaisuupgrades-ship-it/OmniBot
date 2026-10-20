import { afterEach, describe, expect, it, vi } from "vitest";
import { CLOUDFLARE_TURN_TTL_SECONDS, CloudflareTurnCredentials, parseIceServers } from "./cloudflare-turn";
import { readRemoteApiConfig } from "./config";

const API_TOKEN = "test-api-token-that-must-never-be-logged";
const CLOUDFLARE_ANSWER = {
  iceServers: [
    { urls: ["stun:stun.cloudflare.com:3478", "stun:stun.cloudflare.com:53"] },
    {
      urls: [
        "turn:turn.cloudflare.com:3478?transport=udp",
        "turn:turn.cloudflare.com:53?transport=udp",
        "turns:turn.cloudflare.com:443?transport=tcp",
      ],
      username: "user-1",
      credential: "secret-1",
    },
  ],
};

const answer = (body: unknown, status = 201) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

afterEach(() => {
  vi.restoreAllMocks();
});

describe("CloudflareTurnCredentials", () => {
  it("asks Cloudflare with the key and token, and hands out the servers without port 53", async () => {
    const calls: { url: string; init: RequestInit }[] = [];
    const fetch = async (url: string, init: RequestInit) => {
      calls.push({ url, init });
      return answer(CLOUDFLARE_ANSWER);
    };
    const turn = new CloudflareTurnCredentials({ keyId: "key/1", apiToken: API_TOKEN }, { fetch });

    expect(await turn.refresh()).toBe(true);

    const [call] = calls;
    expect(call?.url).toBe("https://rtc.live.cloudflare.com/v1/turn/keys/key%2F1/credentials/generate-ice-servers");
    expect(call?.init.method).toBe("POST");
    expect(new Headers(call?.init.headers).get("authorization")).toBe(`Bearer ${API_TOKEN}`);
    expect(JSON.parse(String(call?.init.body))).toEqual({ ttl: CLOUDFLARE_TURN_TTL_SECONDS });
    expect(turn.iceServers()).toEqual([
      { urls: ["stun:stun.cloudflare.com:3478"] },
      {
        urls: ["turn:turn.cloudflare.com:3478?transport=udp", "turns:turn.cloudflare.com:443?transport=tcp"],
        username: "user-1",
        credential: "secret-1",
      },
    ]);
  });

  it("hands out STUN only before the first set, and keeps the last set when a refresh fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const fetch = vi
      .fn<(input: string, init: RequestInit) => Promise<Response>>()
      .mockResolvedValueOnce(answer(CLOUDFLARE_ANSWER))
      .mockResolvedValueOnce(answer({ error: "nope" }, 500));
    const turn = new CloudflareTurnCredentials({ keyId: "k", apiToken: API_TOKEN }, { fetch });

    expect(turn.iceServers()).toEqual([{ urls: "stun:stun.cloudflare.com:3478" }]);
    expect(await turn.refresh()).toBe(true);
    expect(await turn.refresh()).toBe(false);
    expect(turn.iceServers()[1]).toMatchObject({ username: "user-1" });
  });

  it("never hands out an expired set", async () => {
    let now = 1_000_000;
    const turn = new CloudflareTurnCredentials(
      { keyId: "k", apiToken: API_TOKEN },
      { fetch: async () => answer(CLOUDFLARE_ANSWER), now: () => now },
    );
    await turn.refresh();
    now += CLOUDFLARE_TURN_TTL_SECONDS * 1_000;
    expect(turn.iceServers()).toEqual([{ urls: "stun:stun.cloudflare.com:3478" }]);
  });

  it("does not log the API token when Cloudflare cannot be reached", async () => {
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    const turn = new CloudflareTurnCredentials(
      { keyId: "k", apiToken: API_TOKEN },
      {
        fetch: async () => {
          throw new Error(`request failed with Authorization: Bearer ${API_TOKEN}`);
        },
      },
    );
    expect(await turn.refresh()).toBe(false);
    expect(JSON.stringify(errors.mock.calls)).not.toContain(API_TOKEN);
  });
});

describe("parseIceServers", () => {
  it("refuses an answer in another shape", () => {
    expect(parseIceServers(null)).toBeNull();
    expect(parseIceServers({ iceServers: "x" })).toBeNull();
    expect(parseIceServers({ iceServers: [{ urls: ["http://example.com"] }] })).toBeNull();
    expect(parseIceServers({ iceServers: [{ urls: ["turn:a:1"], username: 1 }] })).toBeNull();
    expect(parseIceServers({ iceServers: [] })).toBeNull();
  });
});

describe("readRemoteApiConfig with Cloudflare TURN", () => {
  const base = {
    REMOTE_TLS_DISABLED: "true",
    REMOTE_TICKET_JWKS_URL: "https://api.example.com/.well-known/jwks.json",
    REMOTE_CONTROL_PLANE_URL: "https://api.example.com",
    REMOTE_SESSION_SECRET: "s".repeat(40),
    REMOTE_AUTH_WEBHOOK_SECRET: "w".repeat(40),
  };

  it("needs no coturn settings when both Cloudflare values are set", () => {
    const config = readRemoteApiConfig({
      ...base,
      CLOUDFLARE_TURN_KEY_ID: "key",
      CLOUDFLARE_TURN_API_TOKEN: API_TOKEN,
    });
    expect(config.cloudflareTurn).toEqual({ keyId: "key", apiToken: API_TOKEN });
    expect(config.turnSecret).toBe("");
  });

  it("refuses only one of the two Cloudflare values", () => {
    expect(() => readRemoteApiConfig({ ...base, CLOUDFLARE_TURN_KEY_ID: "key" })).toThrow(/both/u);
  });

  it("still needs coturn settings without Cloudflare", () => {
    expect(() => readRemoteApiConfig(base)).toThrow(/TURN_SHARED_SECRET/u);
  });
});
