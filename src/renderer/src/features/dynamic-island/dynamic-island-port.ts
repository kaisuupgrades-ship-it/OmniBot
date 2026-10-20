import type { OmniBotDesktopApi } from "@omnibot/contracts/ipc";

/**
 * What the dynamic island reaches in main: its presentation, preference, geometry and actions, and
 * the agent events it shows. The island window has no provider tree, so this is a module.
 */
export interface DynamicIslandPort {
  agent: Pick<OmniBotDesktopApi["agent"], "acknowledgeFailedTurn" | "onScopedEvent">;
  dynamicIsland: Pick<
    OmniBotDesktopApi["dynamicIsland"],
    | "getPreference"
    | "getPresentation"
    | "onAction"
    | "onGeometry"
    | "onPreference"
    | "onPresentation"
    | "performAction"
    | "performHaptic"
    | "publishPresentation"
    | "setInteractive"
  >;
}

/** Read on each call: tests and stories replace `window.omnibot` per case. */
export function dynamicIslandPort(): DynamicIslandPort {
  return window.omnibot;
}
