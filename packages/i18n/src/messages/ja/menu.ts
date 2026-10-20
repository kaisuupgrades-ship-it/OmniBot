import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/menu";

export const messages = {
  "menu.stopAllAgents": "すべてのエージェントを停止",
  "menu.checkForUpdates": "アップデートを確認…",
  "menu.preferences": "設定…",
  "menu.copyLink": "リンクをコピー",
  "menu.trayOpen": "OmniBot を開く",
  "menu.trayQuit": "OmniBot を終了",
  "menu.trayTooltip": "OmniBot",
} as const satisfies PartialTranslation<typeof source>;
