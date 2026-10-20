import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/menu";

export const messages = {
  "menu.stopAllAgents": "Tüm ajanları durdur",
  "menu.checkForUpdates": "Güncellemeleri Denetle…",
  "menu.preferences": "Ayarlar…",
  "menu.copyLink": "Bağlantıyı Kopyala",
  "menu.trayOpen": "OmniBot'u aç",
  "menu.trayQuit": "OmniBot'tan çık",
  "menu.trayTooltip": "OmniBot",
} as const satisfies PartialTranslation<typeof source>;
