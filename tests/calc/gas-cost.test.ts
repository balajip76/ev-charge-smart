import { describe, it, expect } from 'vitest';
import { calculateGasMonthlyCost } from '../../src/calc/gas-cost';
import type { CostEstimate } from '../../src/types';

describe('calculateGasMonthlyCost', () => {
  it('calculates correctly for 1000 miles, 27 MPG, $3.20/gal', () => {
    const result: CostEstimate = calculateGasMonthlyCost(1000, 27, 3.2);

    // (1000 / 27) * 3.20 = 37.037... * 3.20 = 118.5185...
    expect(result.monthlyCost).toBe(118.52);
    expect(result.annualCost).toBe(1422.22);
  });

  it('calculates correctly for Camry efficiency with CA gas price (1000mi, 32 MPG, $4.85/gal)', () => {
    const result: CostEstimate = calculateGasMonthlyCost(1000, 32, 4.85);

    // (1000 / 32) * 4.85 = 31.25 * 4.85 = 151.5625
    expect(result.monthlyCost).toBe(151.56);
    expect(result.annualCost).toBe(1818.75);
  });

  it('returns $0.00 for 0 miles driven', () => {
    const result: CostEstimate = calculateGasMonthlyCost(0, 27, 3.2);

    expect(result.monthlyCost).toBe(0.0);
    expect(result.annualCost).toBe(0.0);
  });

  it('handles minimum mileage (100 miles)', () => {
    const result: CostEstimate = calculateGasMonthlyCost(100, 27, 3.2);

    // (100 / 27) * 3.20 = 3.7037... * 3.20 = 11.8518...
    expect(result.monthlyCost).toBe(11.85);
    expect(result.annualCost).toBe(142.22);
  });

  it('passes through rateUsed, efficiencyUsed, and monthlyMiles', () => {
    const result: CostEstimate = calculateGasMonthlyCost(1500, 30, 3.50);

    expect(result.rateUsed).toBe(3.5);
    expect(result.efficiencyUsed).toBe(30);
    expect(result.monthlyMiles).toBe(1500);
  });
});
