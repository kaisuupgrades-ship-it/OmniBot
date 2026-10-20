import type { OmniBotDesktopApi } from "@omnibot/contracts/ipc";

/**
 * What the browser domain reaches in main: the tabs, the display and control state, and the
 * picture-in-picture window. The picture-in-picture window has no provider tree, so this is a module.
 */
export interface BrowserPort {
  browser: Pick<
    OmniBotDesktopApi["browser"],
    | "activate"
    | "close"
    | "dockPictureInPicture"
    | "getControlState"
    | "getDisplayState"
    | "hidePictureInPicture"
    | "onDisplayState"
    | "setVisible"
  >;
}

/** Read on each call: tests and stories replace `window.omnibot` per case. */
export function browserPort(): BrowserPort {
  return window.omnibot;
}
