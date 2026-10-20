import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/menu";

export const messages = {
  "menu.stopAllAgents": "Detener todos los agentes",
  "menu.checkForUpdates": "Buscar actualizaciones…",
  "menu.preferences": "Ajustes…",
  "menu.copyLink": "Copiar enlace",
  "menu.trayOpen": "Abrir OmniBot",
  "menu.trayQuit": "Salir de OmniBot",
  "menu.trayTooltip": "OmniBot",
} as const satisfies PartialTranslation<typeof source>;
