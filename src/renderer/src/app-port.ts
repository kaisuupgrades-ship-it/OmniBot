import type { OmniBotDesktopApi } from "@omnibot/contracts/ipc";

/**
 * What the app shell and the cross-domain root modules reach in main, plus the shell actions
 * (`openUrl`, `openExternal`) that several domains share.
 */
export interface AppPort {
  getAppInfo: OmniBotDesktopApi["getAppInfo"];
  getAppLanguagePreference: OmniBotDesktopApi["getAppLanguagePreference"];
  getAppLogoColorPreference: OmniBotDesktopApi["getAppLogoColorPreference"];
  onAppLanguagePreference: OmniBotDesktopApi["onAppLanguagePreference"];
  onAppLogoColorPreference: OmniBotDesktopApi["onAppLogoColorPreference"];
  openExternal: OmniBotDesktopApi["openExternal"];
  openUrl: OmniBotDesktopApi["openUrl"];
  setAppLanguagePreference: OmniBotDesktopApi["setAppLanguagePreference"];
  setAppLogoColorPreference: OmniBotDesktopApi["setAppLogoColorPreference"];
  agent: Pick<
    OmniBotDesktopApi["agent"],
    "readConversationPage" | "searchConversationMessages" | "searchConversationFiles" | "listRoutines" | "listAgents"
  >;
  agentTemplates: Pick<OmniBotDesktopApi["agentTemplates"], "onOpenLink" | "takePendingLink">;
  acpRegistry: OmniBotDesktopApi["acpRegistry"];
  hostedSites: OmniBotDesktopApi["hostedSites"];
  billing: OmniBotDesktopApi["billing"];
  hostedServers: OmniBotDesktopApi["hostedServers"];
  routineFeed: OmniBotDesktopApi["routineFeed"];
  events: OmniBotDesktopApi["events"];
  plugins: Pick<OmniBotDesktopApi["plugins"], "onOpenListing" | "takePendingListing">;
  servers: Pick<OmniBotDesktopApi["servers"], "onInvite" | "takePendingInvite">;
}

/** Read on each call: tests and stories replace `window.omnibot` per case. */
export function appPort(): AppPort {
  return window.omnibot;
}
