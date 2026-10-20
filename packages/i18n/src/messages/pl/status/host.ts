import type { PartialTranslation } from "../../../message";
import type { messages as source } from "../../en/status/host";

export const messages = {
  "status.host.registered": "Zarejestrowano ten OmniBot do dostępu przez WebRTC.",
  "status.host.identityUpdated": "Zaktualizowano tożsamość serwera.",
  "status.host.starting": "Uruchamianie hosta WebRTC…",
  "status.host.ready": "Ten OmniBot jest gotowy na połączenia WebRTC.",
  "status.host.stopping": "Ustawianie tego serwera OmniBot jako prywatnego…",
  "status.host.private": "Ten OmniBot jest prywatny.",
} as const satisfies PartialTranslation<typeof source>;
