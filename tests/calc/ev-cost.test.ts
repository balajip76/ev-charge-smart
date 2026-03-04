import { describe, it, expect } from 'vitest';
import { calculateEvMonthlyCost } from '../../src/calc/ev-cost';
import type { CostEstimate } from '../../src/types';

describe('calculateEvMonthlyCost', () => {
  it('calculates correctly for 1000 miles, 30 kWh/100mi, $0.15/kWh', () => {
    const result: CostEstimate = calculateEvMonthlyCost(1000, 30, 0.15);

    expect(result.monthlyCost).toBe(45.0);
    expect(result.annualCost).toBe(540.0);
  });

  it('calculates correctly for Model 3 efficiency with CA rate (1000mi, 26 kWh/100mi, $0.2714/kWh)', () => {
    const result: CostEstimate = calculateEvMonthlyCost(1000, 26, 0.2714);

    expect(result.monthlyCost).toBe(70.56);
    expect(result.annualCost).toBe(846.77);
  });

  it('returns $0.00 for 0 miles driven', () => {
    const result: CostEstimate = calculateEvMonthlyCost(0, 30, 0.15);

    expect(result.monthlyCost).toBe(0.0);
    expect(result.annualCost).toBe(0.0);
  });

  it('handles high mileage (5000 miles) with a high electricity rate', () => {
    const result: CostEstimate = calculateEvMonthlyCost(5000, 35, 0.40);

    // (5000 / 100) * 35 * 0.40 = 50 * 35 * 0.40 = 700.00
    expect(result.monthlyCost).toBe(700.0);
    expect(result.annualCost).toBe(8400.0);
  });

  it('passes through rateUsed, efficiencyUsed, and monthlyMiles', () => {
    const result: CostEstimate = calculateEvMonthlyCost(1200, 28, 0.18);

    expect(result.rateUsed).toBe(0.18);
    expect(result.efficiencyUsed).toBe(28);
    expect(result.monthlyMiles).toBe(1200);
  });
});
