import { toast } from "@omnibot/ui";
import { WhatsNewDialog } from "@omnibot/ui/features/updates/WhatsNewDialog";
import { useText } from "@omnibot/ui/text";
import { createEffect, untrack } from "solid-js";
import { appPort } from "../../app-port";
import { useWhatsNew } from "./whats-new-context";

/** Mounted only when the workspace is ready, outside the lifetime of a selected server. */
export function WhatsNewOverlay(props: { ready: boolean }) {
  const { t, errorMessage } = useText();
  const whatsNew = useWhatsNew();
  createEffect(
    () => props.ready && whatsNew.state.version !== "",
    (ready) => {
      if (ready) untrack(whatsNew.start);
    },
  );
  return (
    <WhatsNewDialog
      open={props.ready && whatsNew.state.open}
      version={whatsNew.state.version}
      previousVersion={whatsNew.state.previousVersion}
      notes={whatsNew.state.notes}
      onOpenChange={(open) => {
        if (!open) whatsNew.close();
      }}
      onRetry={whatsNew.retry}
      onOpenChangelog={() => {
        void appPort()
          .openUrl("https://omnibot.example.com/changelog")
          .catch((error: unknown) => toast.error(errorMessage(error, t("update.whatsNew.changelogFailed")), { error }));
      }}
    />
  );
}
