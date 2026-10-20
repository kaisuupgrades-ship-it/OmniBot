import type { PartialTranslation } from "../../../message";
import type { messages as source } from "../../en/error/auth";

export const messages = {
  "error.auth.serviceUnavailable":
    "O OmniBot não conseguiu acessar o serviço de contas. Verifique se a API está em execução e tente novamente.",
  "error.auth.networkBlocked":
    "Um firewall ou proxy desta rede impediu o OmniBot de acessar {host}. Peça ao administrador da rede para permitir {host} e tente novamente.",
  "error.auth.signInFirst": "Entre no OmniBot primeiro.",
  "error.auth.signInRequired": "É necessário entrar.",
  "error.auth.accountChangedDuringRegister": "A conta conectada mudou durante o registro deste servidor.",
  "error.auth.hostCredentialUnavailable":
    "A credencial do computador anfitrião remoto está indisponível. Registre o computador anfitrião novamente.",
  "error.auth.codeNotVerified": "Não foi possível verificar o código de login.",
  "error.auth.serviceError": "O serviço de contas retornou um erro.",
  "error.auth.serviceUnreachable":
    "O OmniBot não conseguiu acessar o serviço de contas. Verifique sua conexão e tente novamente.",
  "error.auth.serviceTimeout": "O serviço de contas não respondeu a tempo. Tente novamente.",
  "error.auth.serviceStatus": "O serviço de contas retornou um erro ({status}). Tente novamente mais tarde.",
  "error.auth.invalidHostedServer": "O serviço de contas retornou um servidor hospedado inválido.",
  "error.auth.codeNotSent": "O OmniBot não conseguiu enviar o código de login.",
  "error.auth.deliveryTimeout":
    "O OmniBot não conseguiu confirmar a entrega a tempo. O código ainda pode chegar; verifique a entrega antes de enviar novamente.",
  "error.auth.deliveryInterrupted":
    "A conexão terminou antes de o OmniBot confirmar a entrega. Verifique a entrega para evitar o envio de outro código.",
  "error.auth.deliveryUnknown":
    "O OmniBot não conseguiu confirmar se o código de login foi enviado. Verifique a entrega antes de enviar novamente.",
} as const satisfies PartialTranslation<typeof source>;
