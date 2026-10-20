import { prefersReducedMotion } from "../../utils";

export function rendererDuration(property: string, fallback: number): number {
  if (prefersReducedMotion()) return 0;
  const value = getComputedStyle(document.documentElement).getPropertyValue(property).trim();
  if (value.endsWith("ms")) return Number.parseFloat(value) || fallback;
  if (value.endsWith("s")) return (Number.parseFloat(value) || fallback / 1_000) * 1_000;
  return fallback;
}

export function agentActivityExitDuration(): number {
  return rendererDuration("--omnibot-duration-overlay", 240);
}

export function agentActivityShowDelay(): number {
  return rendererDuration("--omnibot-duration-fast", 120);
}

export function agentActivityExitDelay(): number {
  return rendererDuration("--omnibot-agent-activity-exit-delay", 500);
}
