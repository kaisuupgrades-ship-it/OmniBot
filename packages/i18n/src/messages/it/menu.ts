import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/menu";

export const messages = {
  "menu.stopAllAgents": "Ferma tutti gli agenti",
  "menu.checkForUpdates": "Verifica aggiornamenti…",
  "menu.preferences": "Impostazioni…",
  "menu.copyLink": "Copia link",
  "menu.trayOpen": "Apri OmniBot",
  "menu.trayQuit": "Esci da OmniBot",
  "menu.trayTooltip": "OmniBot",
} as const satisfies PartialTranslation<typeof source>;
