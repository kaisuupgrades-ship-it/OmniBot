import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/window";

export const messages = {
  // Native window titles.
  "window.localHostTitle": "OmniBot – Hôte local",
  "window.localClientTitle": "OmniBot – Client local",
  "window.computerUsePermissionTitle": "Activer Computer Use",
} as const satisfies PartialTranslation<typeof source>;
