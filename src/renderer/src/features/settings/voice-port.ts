import type { OmniBotDesktopApi } from "@omnibot/contracts/ipc";

/** What the Voice tab reaches in main: the dictation models and the dictation settings. */
export interface VoicePort {
  voice: OmniBotDesktopApi["voice"];
}

/** Read on each call: tests and stories replace `window.omnibot` per case. */
export function voicePort(): VoicePort {
  return window.omnibot;
}
