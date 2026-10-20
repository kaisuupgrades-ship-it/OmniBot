import type { OmniBotDesktopApi } from "@omnibot/contracts/ipc";

/**
 * What the sidebar reaches in main: the saved sidebar layout and its changes.
 */
export interface SidebarPort {
  agent: Pick<OmniBotDesktopApi["agent"], "getSidebarLayout" | "mutateSidebarLayout">;
}

/** Read on each call: tests and stories replace `window.omnibot` per case. */
export function sidebarPort(): SidebarPort {
  return window.omnibot;
}
