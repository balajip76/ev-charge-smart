import { describe, it, expect } from 'vitest';
import { getStateColor } from '../../src/calc/color-scale';

describe('getStateColor', () => {
  it('returns pure green (#22c55e) for the minimum value (most EV savings)', () => {
    expect(getStateColor(-100, -100, 100)).toBe('#22c55e');
  });

  it('returns white (#ffffff) for the midpoint of the range', () => {
    // min=-100, max=100, midpoint=0 → t=0.5 → white
    expect(getStateColor(0, -100, 100)).toBe('#ffffff');
  });

  it('returns pure red (#ef4444) for the maximum value (least EV savings)', () => {
    expect(getStateColor(100, -100, 100)).toBe('#ef4444');
  });

  it('returns an intermediate color in the green-to-white region for a lower-half value', () => {
    // -50 with range [-100, 100] → t=0.25 → between green and white
    const color = getStateColor(-50, -100, 100);

    expect(color).not.toBe('#22c55e');
    expect(color).not.toBe('#ffffff');

    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);

    // Red should be between green's red (0x22) and white's (0xff)
    expect(r).toBeGreaterThan(0x22);
    expect(r).toBeLessThan(0xff);
    // Green channel should remain high
    expect(g).toBeGreaterThanOrEqual(0xc5);
  });

  it('returns an intermediate color in the white-to-red region for an upper-half value', () => {
    // 50 with range [-100, 100] → t=0.75 → between white and red
    const color = getStateColor(50, -100, 100);

    expect(color).not.toBe('#ffffff');
    expect(color).not.toBe('#ef4444');

    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);

    // Red channel should remain high
    expect(r).toBeGreaterThanOrEqual(0xef);
    // Green and blue should be between red's (0x44) and white's (0xff)
    expect(g).toBeGreaterThan(0x44);
    expect(g).toBeLessThan(0xff);
  });

  it('returns white (#ffffff) when min === max (zero-range guard, no divide-by-zero)', () => {
    expect(getStateColor(50, 50, 50)).toBe('#ffffff');
    expect(getStateColor(-30, -30, -30)).toBe('#ffffff');
    expect(getStateColor(0, 0, 0)).toBe('#ffffff');
  });

  it('returns pure green for min and pure red for max with real-world-like data', () => {
    // Simulates state data where EV saves $45/mo (best) to $20/mo (worst)
    expect(getStateColor(-45, -45, -20)).toBe('#22c55e');
    expect(getStateColor(-20, -45, -20)).toBe('#ef4444');
  });

  it('always returns a 7-character hex color string (#rrggbb)', () => {
    const testValues = [-100, -75, -50, -25, 0, 25, 50, 75, 100];

    for (const value of testValues) {
      const color = getStateColor(value, -100, 100);
      expect(color).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
});
