import type { OmniBotDesktopApi } from "@omnibot/contracts/ipc";

/** What the Bitwarden page reaches in main: the connection of this computer. */
export type BitwardenConnectorPort = OmniBotDesktopApi["bitwardenConnector"];

/** Read on each call: tests and stories replace `window.omnibot` per case. */
export function bitwardenConnectorPort(): BitwardenConnectorPort {
  return window.omnibot.bitwardenConnector;
}
