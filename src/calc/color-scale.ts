// Dark Green (#15803d) → Light Green (#86efac) → Light Yellow (#fef08a)
// Sequential color scale for EV vs Gas cost difference
// min (most EV savings) → dark green, max (least EV savings) → light yellow

const DARK_GREEN = { r: 0x15, g: 0x80, b: 0x3d }; // #15803d
const LIGHT_GREEN = { r: 0x86, g: 0xef, b: 0xac }; // #86efac
const LIGHT_YELLOW = { r: 0xfe, g: 0xf0, b: 0x8a }; // #fef08a

function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t);
}

function toHex(n: number): string {
  return n.toString(16).padStart(2, '0');
}

/**
 * Map a monthly cost difference to a color on the dark-green → light-green → light-yellow scale,
 * normalized to the actual data range across all states.
 * @param monthlyDifference - evCost - gasCost for this state
 * @param min - lowest monthlyDifference in the dataset (most EV savings → dark green)
 * @param max - highest monthlyDifference in the dataset (least EV savings → light yellow)
 * @returns CSS hex color string (e.g., '#15803d')
 */
export function getStateColor(
  monthlyDifference: number,
  min: number,
  max: number,
): string {
  // Guard: if all states are identical, return neutral mid-spectrum light green
  if (min === max) {
    return `#${toHex(LIGHT_GREEN.r)}${toHex(LIGHT_GREEN.g)}${toHex(LIGHT_GREEN.b)}`;
  }

  // Normalize to [0, 1]: 0 = min (dark green), 1 = max (light yellow)
  const t = (monthlyDifference - min) / (max - min);

  let r: number, g: number, b: number;

  if (t <= 0.5) {
    // Dark Green → Light Green (lower half of range)
    const s = t / 0.5; // 0 at min, 1 at midpoint
    r = lerp(DARK_GREEN.r, LIGHT_GREEN.r, s);
    g = lerp(DARK_GREEN.g, LIGHT_GREEN.g, s);
    b = lerp(DARK_GREEN.b, LIGHT_GREEN.b, s);
  } else {
    // Light Green → Light Yellow (upper half of range)
    const s = (t - 0.5) / 0.5; // 0 at midpoint, 1 at max
    r = lerp(LIGHT_GREEN.r, LIGHT_YELLOW.r, s);
    g = lerp(LIGHT_GREEN.g, LIGHT_YELLOW.g, s);
    b = lerp(LIGHT_GREEN.b, LIGHT_YELLOW.b, s);
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
