declare module "@openbot/renderer-preview" {
  import type { JSX } from "@solidjs/web";

  export interface OmniBotPlaygroundProps {
    variant?: "default" | "landing";
  }

  export function OmniBotPlayground(props: OmniBotPlaygroundProps): JSX.Element;
}
