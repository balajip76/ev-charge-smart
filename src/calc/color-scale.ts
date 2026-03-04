// Green (#22c55e) → White (#ffffff) → Red (#ef4444)
// Diverging color scale for EV vs Gas cost difference
// Negative = EV cheaper (green), Positive = EV more expensive (red)

const GREEN = { r: 0x22, g: 0xc5, b: 0x5e }; // #22c55e
const WHITE = { r: 0xff, g: 0xff, b: 0xff }; // #ffffff
const RED = { r: 0xef, g: 0x44, b: 0x44 }; // #ef4444

const RANGE = 100; // dollars

function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t);
}

function toHex(n: number): string {
  return n.toString(16).padStart(2, '0');
}

/**
 * Map a monthly cost difference to a color on the green-white-red scale.
 * @param monthlyDifference - evCost - gasCost (negative = EV cheaper)
 * @returns CSS hex color string (e.g., '#22c55e')
 */
export function getStateColor(monthlyDifference: number): string {
  const clamped = Math.max(-RANGE, Math.min(RANGE, monthlyDifference));

  let r: number, g: number, b: number;

  if (clamped <= 0) {
    // Green → White (EV cheaper)
    const t = (clamped + RANGE) / RANGE; // 0 at -100, 1 at 0
    r = lerp(GREEN.r, WHITE.r, t);
    g = lerp(GREEN.g, WHITE.g, t);
    b = lerp(GREEN.b, WHITE.b, t);
  } else {
    // White → Red (EV more expensive)
    const t = clamped / RANGE; // 0 at 0, 1 at +100
    r = lerp(WHITE.r, RED.r, t);
    g = lerp(WHITE.g, RED.g, t);
    b = lerp(WHITE.b, RED.b, t);
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
