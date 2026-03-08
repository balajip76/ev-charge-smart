import { describe, it, expect } from 'vitest';
import { getStateColor } from '../../src/calc/color-scale';

describe('getStateColor', () => {
  it('returns dark green (#15803d) for the minimum value (most EV savings)', () => {
    expect(getStateColor(-100, -100, 100)).toBe('#15803d');
  });

  it('returns light green (#86efac) for the midpoint of the range', () => {
    // min=-100, max=100, midpoint=0 → t=0.5 → light green
    expect(getStateColor(0, -100, 100)).toBe('#86efac');
  });

  it('returns light yellow (#fef08a) for the maximum value (least EV savings)', () => {
    expect(getStateColor(100, -100, 100)).toBe('#fef08a');
  });

  it('returns an intermediate color in the dark-green-to-light-green region for a lower-half value', () => {
    // -50 with range [-100, 100] → t=0.25 → between dark green and light green
    const color = getStateColor(-50, -100, 100);

    expect(color).not.toBe('#15803d');
    expect(color).not.toBe('#86efac');

    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);

    // Red should be between dark green's (0x15) and light green's (0x86)
    expect(r).toBeGreaterThan(0x15);
    expect(r).toBeLessThan(0x86);
    // Green channel should remain high throughout the green spectrum
    expect(g).toBeGreaterThanOrEqual(0x80);
  });

  it('returns an intermediate color in the light-green-to-light-yellow region for an upper-half value', () => {
    // 50 with range [-100, 100] → t=0.75 → between light green and light yellow
    const color = getStateColor(50, -100, 100);

    expect(color).not.toBe('#86efac');
    expect(color).not.toBe('#fef08a');

    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);

    // Red should be between light green's (0x86) and light yellow's (0xfe)
    expect(r).toBeGreaterThan(0x86);
    expect(r).toBeLessThan(0xfe);
    // Green channel should remain high (both light green and light yellow have high green)
    expect(g).toBeGreaterThanOrEqual(0xef);
  });

  it('returns light green (#86efac) when min === max (zero-range guard, no divide-by-zero)', () => {
    expect(getStateColor(50, 50, 50)).toBe('#86efac');
    expect(getStateColor(-30, -30, -30)).toBe('#86efac');
    expect(getStateColor(0, 0, 0)).toBe('#86efac');
  });

  it('returns dark green for min and light yellow for max with real-world-like data', () => {
    // Simulates state data where EV saves $45/mo (best) to $20/mo (worst)
    expect(getStateColor(-45, -45, -20)).toBe('#15803d');
    expect(getStateColor(-20, -45, -20)).toBe('#fef08a');
  });

  it('always returns a 7-character hex color string (#rrggbb)', () => {
    const testValues = [-100, -75, -50, -25, 0, 25, 50, 75, 100];

    for (const value of testValues) {
      const color = getStateColor(value, -100, 100);
      expect(color).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
});
