import { describe, it, expect } from 'vitest';
import { isDataStale, getDataAge } from '../../src/calc/data-freshness';

/** Helper to create an ISO date string N days in the past. */
function daysAgo(days: number): string {
  return new Date(Date.now() - days * 86400000).toISOString();
}

/** Helper to create an ISO date string N days in the future. */
function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 86400000).toISOString();
}

describe('isDataStale', () => {
  it('returns false for data from 29 days ago (default maxAgeDays = 30)', () => {
    expect(isDataStale(daysAgo(29))).toBe(false);
  });

  it('returns true for data from 31 days ago (default maxAgeDays = 30)', () => {
    expect(isDataStale(daysAgo(31))).toBe(true);
  });

  it('returns false for data from exactly 30 days ago (boundary: 30 days is NOT stale)', () => {
    expect(isDataStale(daysAgo(30))).toBe(false);
  });

  it('returns true when custom maxAgeDays is exceeded (7-day max, 8-day-old data)', () => {
    expect(isDataStale(daysAgo(8), 7)).toBe(true);
  });

  it('returns false for a future date', () => {
    expect(isDataStale(daysFromNow(5))).toBe(false);
  });
});

describe('getDataAge', () => {
  it('returns 15 for data from 15 days ago', () => {
    expect(getDataAge(daysAgo(15))).toBe(15);
  });

  it('returns 0 for data from today', () => {
    expect(getDataAge(new Date().toISOString())).toBe(0);
  });

  it('rounds down fractional days', () => {
    // 2.9 days ago should return 2
    const almostThreeDays = new Date(Date.now() - 2.9 * 86400000).toISOString();
    expect(getDataAge(almostThreeDays)).toBe(2);
  });
});
