import type { PartialTranslation } from "../../../message";
import type { messages as source } from "../../en/status/host";

export const messages = {
  "status.host.registered": "Этот OmniBot зарегистрирован для доступа через WebRTC.",
  "status.host.identityUpdated": "Идентификатор сервера обновлён.",
  "status.host.starting": "Запуск хоста WebRTC…",
  "status.host.ready": "Этот OmniBot готов к подключениям WebRTC.",
  "status.host.stopping": "Перевод этого OmniBot в приватный режим…",
  "status.host.private": "Этот OmniBot приватный.",
} as const satisfies PartialTranslation<typeof source>;
