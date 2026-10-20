import type { OmniBotDesktopApi } from "@omnibot/contracts/ipc";

/**
 * What team presence reaches in main: who is online, and whether this member is typing.
 */
export interface TeamPort {
  servers: Pick<OmniBotDesktopApi["servers"], "onPresence" | "setTyping">;
}

/** Read on each call: tests and stories replace `window.omnibot` per case. */
export function teamPort(): TeamPort {
  return window.omnibot;
}
