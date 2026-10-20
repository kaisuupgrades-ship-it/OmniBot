import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/menu";

export const messages = {
  "menu.stopAllAgents": "Alle Agenten stoppen",
  "menu.checkForUpdates": "Nach Updates suchen…",
  "menu.preferences": "Einstellungen…",
  "menu.copyLink": "Link kopieren",
  "menu.trayOpen": "OmniBot öffnen",
  "menu.trayQuit": "OmniBot beenden",
  "menu.trayTooltip": "OmniBot",
} as const satisfies PartialTranslation<typeof source>;
