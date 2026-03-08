// Green (#22c55e) → White (#ffffff) → Red (#ef4444)
// Diverging color scale for EV vs Gas cost difference
// min (most EV savings) → deepest green, max (least EV savings) → deepest red

const GREEN = { r: 0x22, g: 0xc5, b: 0x5e }; // #22c55e
const WHITE = { r: 0xff, g: 0xff, b: 0xff }; // #ffffff
const RED = { r: 0xef, g: 0x44, b: 0x44 }; // #ef4444

function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t);
}

function toHex(n: number): string {
  return n.toString(16).padStart(2, '0');
}

/**
 * Map a monthly cost difference to a color on the green-white-red scale,
 * normalized to the actual data range across all states.
 * @param monthlyDifference - evCost - gasCost for this state
 * @param min - lowest monthlyDifference in the dataset (most EV savings → deepest green)
 * @param max - highest monthlyDifference in the dataset (least EV savings → deepest red)
 * @returns CSS hex color string (e.g., '#22c55e')
 */
export function getStateColor(
  monthlyDifference: number,
  min: number,
  max: number,
): string {
  // Guard: if all states are identical, return neutral white
  if (min === max) {
    return `#${toHex(WHITE.r)}${toHex(WHITE.g)}${toHex(WHITE.b)}`;
  }

  // Normalize to [0, 1]: 0 = min (deepest green), 1 = max (deepest red)
  const t = (monthlyDifference - min) / (max - min);

  let r: number, g: number, b: number;

  if (t <= 0.5) {
    // Green → White (lower half of range)
    const s = t / 0.5; // 0 at min, 1 at midpoint
    r = lerp(GREEN.r, WHITE.r, s);
    g = lerp(GREEN.g, WHITE.g, s);
    b = lerp(GREEN.b, WHITE.b, s);
  } else {
    // White → Red (upper half of range)
    const s = (t - 0.5) / 0.5; // 0 at midpoint, 1 at max
    r = lerp(WHITE.r, RED.r, s);
    g = lerp(WHITE.g, RED.g, s);
    b = lerp(WHITE.b, RED.b, s);
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
