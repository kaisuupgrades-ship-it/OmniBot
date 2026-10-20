import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/menu";

export const messages = {
  "menu.stopAllAgents": "Остановить всех агентов",
  "menu.checkForUpdates": "Проверить обновления…",
  "menu.preferences": "Настройки…",
  "menu.copyLink": "Скопировать ссылку",
  "menu.trayOpen": "Открыть OmniBot",
  "menu.trayQuit": "Выйти из OmniBot",
  "menu.trayTooltip": "OmniBot",
} as const satisfies PartialTranslation<typeof source>;
