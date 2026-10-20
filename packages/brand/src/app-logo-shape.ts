// The OmniBot mark as plain data, so that a canvas can draw the same mark that
// `AppLogo` draws as SVG: the social cards in apps/auth-api do. `scripts/omnibot/make-icons.ts`
// draws the app icons from it too.

/** The mark is a square of this side, in its own units. */
export const APP_LOGO_SIZE = 240;
/** The corner radius of the square, in the same units. */
export const APP_LOGO_CORNER = 50;

/** The centers of the two ring eyes. They match the eye transform origins in `logo.css`. */
export const APP_LOGO_EYE_CENTERS = [
  [69, 117],
  [171, 117],
] as const;
/** The radius of each ring eye, to the middle of its stroke. */
export const APP_LOGO_EYE_RADIUS = 22;
/** The stroke width of the eyes. `logo.css` uses the same value for `.app-logo-eye`. */
export const APP_LOGO_EYE_STROKE = 13;

/** A closed ring as SVG `points`, so the eyes stay polylines that the animations can scale. */
function ringPoints(centerX: number, centerY: number): string {
  const segments = 48;
  const points: string[] = [];
  for (let index = 0; index <= segments; index += 1) {
    const angle = (index / segments) * Math.PI * 2 - Math.PI / 2;
    const x = centerX + APP_LOGO_EYE_RADIUS * Math.cos(angle);
    const y = centerY + APP_LOGO_EYE_RADIUS * Math.sin(angle);
    points.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return points.join(" ");
}

/** Each eye is one closed ring stroke, as SVG `points`. */
export const APP_LOGO_EYE_POINTS = {
  left: ringPoints(APP_LOGO_EYE_CENTERS[0][0], APP_LOGO_EYE_CENTERS[0][1]),
  right: ringPoints(APP_LOGO_EYE_CENTERS[1][0], APP_LOGO_EYE_CENTERS[1][1]),
} as const;
