import type { OmniBotDesktopApi } from "@openbot/contracts/ipc";

/**
 * What the account context reaches in main: the OmniBot account session, its devices, and the
 * usage the page rail and the Usage page show.
 */
export interface AccountPort {
  agent: Pick<OmniBotDesktopApi["agent"], "getUsage">;
  auth: Pick<
    OmniBotDesktopApi["auth"],
    | "cancelMobileConnect"
    | "createMobileConnect"
    | "createMobileConnectLink"
    | "getMobileConnectLink"
    | "getState"
    | "listAccountSessions"
    | "listMobileConnectedDevices"
    | "logout"
    | "onEvent"
    | "requestEmailCode"
    | "retry"
    | "revokeAccountSession"
    | "revokeMobileConnectedDevice"
    | "revokeMobileConnectLink"
    | "updateAvatar"
    | "updateName"
    | "verifyEmailCode"
  >;
}

/** Read on each call: tests and stories replace `window.openbot` per case. */
export function accountPort(): AccountPort {
  return window.openbot;
}
