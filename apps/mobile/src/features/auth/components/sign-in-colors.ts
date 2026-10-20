import { useCSSVariable } from "uniwind";

/**
 * The colors of the sign-in controls. The brand lavender of the logo marks focus, so the controls
 * match the Scan QR code button. `--omnibot-border-strong` is almost invisible on the dark canvas,
 * so a control shows as a filled surface with a clear ring only when it has focus or a state.
 */
export function useSignInColors() {
  const surface = useCSSVariable("--omnibot-bg-control-active");
  const brand = useCSSVariable("--omnibot-logo-production");
  const onBrand = useCSSVariable("--omnibot-logo-eye");
  const text = useCSSVariable("--omnibot-text-primary");
  const muted = useCSSVariable("--omnibot-text-muted");
  const danger = useCSSVariable("--omnibot-danger");
  const success = useCSSVariable("--omnibot-success");
  const radius = useCSSVariable("--omnibot-radius-lg");
  return {
    surface: String(surface ?? "#2a2a2a"),
    brand: String(brand ?? "#84adde"),
    onBrand: String(onBrand ?? "#040007"),
    text: String(text ?? "#ffffff"),
    muted: String(muted ?? "#979797"),
    danger: String(danger ?? "#fd2f3b"),
    success: String(success ?? "#31cf76"),
    radius: Number.parseFloat(String(radius ?? "12")),
  };
}

export type SignInColors = ReturnType<typeof useSignInColors>;

/** The height of every sign-in control, so a button and the field that replaces it match. */
export const SIGN_IN_CONTROL_HEIGHT = 52;
