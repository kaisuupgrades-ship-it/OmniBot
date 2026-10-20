import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/menu";

export const messages = {
  "menu.stopAllAgents": "Zatrzymaj wszystkich agentów",
  "menu.checkForUpdates": "Sprawdź aktualizacje…",
  "menu.preferences": "Ustawienia…",
  "menu.copyLink": "Kopiuj link",
  "menu.trayOpen": "Otwórz OmniBot",
  "menu.trayQuit": "Zamknij OmniBot",
  "menu.trayTooltip": "OmniBot",
} as const satisfies PartialTranslation<typeof source>;
