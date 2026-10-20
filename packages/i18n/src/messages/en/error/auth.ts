import { defineMessages } from "../../../message";

export const messages = defineMessages("error.auth", {
  // Errors from the OmniBot account service.
  "error.auth.serviceUnavailable":
    "OmniBot could not reach the account service. Check that the API is running, then try again.",
  "error.auth.networkBlocked":
    "A firewall or proxy on this network blocked OmniBot from reaching {host}. Ask your network administrator to allow {host}, then try again.",
  "error.auth.signInFirst": "Sign in to OmniBot first.",
  "error.auth.signInRequired": "Sign in is required.",
  "error.auth.accountChangedDuringRegister": "The signed-in account changed while this server was being registered.",
  "error.auth.hostCredentialUnavailable": "The remote host credential is unavailable. Register the host again.",
  "error.auth.codeNotVerified": "The sign-in code could not be verified.",
  "error.auth.serviceError": "The account service returned an error.",
  "error.auth.serviceUnreachable":
    "OmniBot could not reach the account service. Check your connection, then try again.",
  "error.auth.serviceTimeout": "The account service did not answer in time. Try again.",
  "error.auth.serviceStatus": "The account service returned an error ({status}). Try again later.",
  "error.auth.invalidHostedServer": "The account service returned an invalid hosted server.",
  "error.auth.codeNotSent": "OmniBot could not send the sign-in code.",
  "error.auth.deliveryTimeout":
    "OmniBot could not confirm delivery in time. The code may still arrive; check delivery before sending again.",
  "error.auth.deliveryInterrupted":
    "The connection ended before OmniBot confirmed delivery. Check delivery to avoid sending another code.",
  "error.auth.deliveryUnknown":
    "OmniBot could not confirm whether the sign-in code was sent. Check delivery before sending again.",
});
