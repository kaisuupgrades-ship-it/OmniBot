import type { OmniBotDesktopApi } from "@omnibot/contracts/ipc";

/**
 * What the settings context reaches in main: the app-wide preferences and the switches for
 * updates, notifications and the Dynamic Island.
 */
export interface SettingsPort {
  getAgentMemoryLimitPreference: OmniBotDesktopApi["getAgentMemoryLimitPreference"];
  getAnalyticsPreference: OmniBotDesktopApi["getAnalyticsPreference"];
  getAppBehaviorPreference: OmniBotDesktopApi["getAppBehaviorPreference"];
  getApprovalAutomation: OmniBotDesktopApi["getApprovalAutomation"];
  getBusyMessageModePreference: OmniBotDesktopApi["getBusyMessageModePreference"];
  getRemoteSessionReusePreference: OmniBotDesktopApi["getRemoteSessionReusePreference"];
  onAgentMemoryLimitPreference: OmniBotDesktopApi["onAgentMemoryLimitPreference"];
  onApprovalAutomation: OmniBotDesktopApi["onApprovalAutomation"];
  onOpenSettings: OmniBotDesktopApi["onOpenSettings"];
  setAnalyticsPreference: OmniBotDesktopApi["setAnalyticsPreference"];
  setAppBehaviorPreference: OmniBotDesktopApi["setAppBehaviorPreference"];
  setBusyMessageModePreference: OmniBotDesktopApi["setBusyMessageModePreference"];
  setRemoteSessionReusePreference: OmniBotDesktopApi["setRemoteSessionReusePreference"];
  dynamicIsland: Pick<
    OmniBotDesktopApi["dynamicIsland"],
    "getBuiltInDisplayGeometry" | "getPreference" | "setPreference"
  >;
  notifications: Pick<OmniBotDesktopApi["notifications"], "getPreference" | "openSettings" | "setPreference" | "test">;
  update: Pick<OmniBotDesktopApi["update"], "getPreference" | "onPreference" | "setPreference">;
}

/** Read on each call: tests and stories replace `window.omnibot` per case. */
export function settingsPort(): SettingsPort {
  return window.omnibot;
}
