import type { OmniBotDesktopApi } from "@omnibot/contracts/ipc";

/**
 * What provider state reaches in main: connecting, signing in and refreshing providers, and the
 * runtimes OmniBot installs for them, on this computer or on a host the account administers.
 */
export interface ProvidersPort {
  cancelProviderCodeLogin: OmniBotDesktopApi["cancelProviderCodeLogin"];
  connectProvider: OmniBotDesktopApi["connectProvider"];
  cancelProviderSignIn: OmniBotDesktopApi["cancelProviderSignIn"];
  refreshAgentProviders: OmniBotDesktopApi["refreshAgentProviders"];
  setProviderOn: OmniBotDesktopApi["setProviderOn"];
  restartProvider: OmniBotDesktopApi["restartProvider"];
  cancelProviderRestart: OmniBotDesktopApi["cancelProviderRestart"];
  startProviderCodeLogin: OmniBotDesktopApi["startProviderCodeLogin"];
  providerRuntimes: OmniBotDesktopApi["providerRuntimes"];
  connectProviderAccount: OmniBotDesktopApi["connectProviderAccount"];
  cancelProviderAccountSignIn: OmniBotDesktopApi["cancelProviderAccountSignIn"];
  renameProviderAccount: OmniBotDesktopApi["renameProviderAccount"];
  removeProviderAccount: OmniBotDesktopApi["removeProviderAccount"];
  /** The same, for the host of a joined server the account administers. */
  providerAdmin: OmniBotDesktopApi["providerAdmin"];
}

/** Read on each call: tests and stories replace `window.omnibot` per case. */
export function providersPort(): ProvidersPort {
  return window.omnibot;
}
