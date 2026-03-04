import { describe, it, expect } from 'vitest';
import { getStateColor } from '../../src/calc/color-scale';

describe('getStateColor', () => {
  it('returns pure green (#22c55e) for -100 (EV much cheaper)', () => {
    expect(getStateColor(-100)).toBe('#22c55e');
  });

  it('returns white (#ffffff) for 0 (break-even)', () => {
    expect(getStateColor(0)).toBe('#ffffff');
  });

  it('returns pure red (#ef4444) for +100 (EV much more expensive)', () => {
    expect(getStateColor(100)).toBe('#ef4444');
  });

  it('returns an intermediate color between green and white for -50', () => {
    const color = getStateColor(-50);

    // Should be between green (#22c55e) and white (#ffffff)
    // Not pure green and not pure white
    expect(color).not.toBe('#22c55e');
    expect(color).not.toBe('#ffffff');

    // Parse hex to verify green channel is high (between 0xc5 and 0xff)
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);

    // Red should be between 0x22 and 0xff
    expect(r).toBeGreaterThan(0x22);
    expect(r).toBeLessThan(0xff);
    // Green should remain high
    expect(g).toBeGreaterThanOrEqual(0xc5);
  });

  it('returns an intermediate color between white and red for +50', () => {
    const color = getStateColor(50);

    // Should be between white (#ffffff) and red (#ef4444)
    expect(color).not.toBe('#ffffff');
    expect(color).not.toBe('#ef4444');

    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);

    // Red should remain high
    expect(r).toBeGreaterThanOrEqual(0xef);
    // Green and blue should be between 0x44 and 0xff
    expect(g).toBeGreaterThan(0x44);
    expect(g).toBeLessThan(0xff);
  });

  it('clamps values below -100 to pure green', () => {
    expect(getStateColor(-200)).toBe('#22c55e');
    expect(getStateColor(-500)).toBe('#22c55e');
  });

  it('clamps values above +100 to pure red', () => {
    expect(getStateColor(200)).toBe('#ef4444');
    expect(getStateColor(500)).toBe('#ef4444');
  });

  it('always returns a 7-character hex color string (#rrggbb)', () => {
    const testValues = [-200, -100, -75, -50, -25, 0, 25, 50, 75, 100, 200];

    for (const value of testValues) {
      const color = getStateColor(value);
      expect(color).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
});
