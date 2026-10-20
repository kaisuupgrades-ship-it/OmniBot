import type { OmniBotDesktopApi } from "@openbot/contracts/ipc";

/**
 * What the usage panel reaches in main: the analytics of a server, its agents, and the events that
 * make the report stale.
 */
export interface UsagePort {
  agent: Pick<OmniBotDesktopApi["agent"], "getHostAnalytics" | "listAgents" | "onScopedEvent">;
  servers: Pick<OmniBotDesktopApi["servers"], "onEvent">;
}

/** Read on each call: tests and stories replace `window.openbot` per case. */
export function usagePort(): UsagePort {
  return window.openbot;
}
