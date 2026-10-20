import type { OmniBotDesktopApi } from "@omnibot/contracts/ipc";

/**
 * What the storage panels reach in main: the stored files of a server, and the agent names that
 * label them.
 */
export interface FilesPort {
  agent: Pick<OmniBotDesktopApi["agent"], "listAgents">;
  /** The old provider CLI versions are optional: a client with no store of its own, such as the web client, has none. */
  storage: Pick<OmniBotDesktopApi["storage"], "clear" | "deleteFile" | "getUsage" | "openFile"> &
    Partial<Pick<OmniBotDesktopApi["storage"], "getOldRuntimeVersions" | "removeOldRuntimeVersions">>;
}

/** Read on each call: tests and stories replace `window.omnibot` per case. */
export function filesPort(): FilesPort {
  return window.omnibot;
}
