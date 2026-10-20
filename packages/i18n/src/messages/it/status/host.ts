import type { PartialTranslation } from "../../../message";
import type { messages as source } from "../../en/status/host";

export const messages = {
  "status.host.registered": "Questo OmniBot è stato registrato per l'accesso WebRTC.",
  "status.host.identityUpdated": "Identità del server aggiornata.",
  "status.host.starting": "Avvio dell'host WebRTC…",
  "status.host.ready": "Questo OmniBot è pronto per le connessioni WebRTC.",
  "status.host.stopping": "Questo OmniBot sta diventando privato…",
  "status.host.private": "Questo OmniBot è privato.",
} as const satisfies PartialTranslation<typeof source>;
