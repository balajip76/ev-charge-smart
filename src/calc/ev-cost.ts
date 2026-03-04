import type { CostEstimate } from '../types';

/**
 * Calculate monthly EV charging cost.
 * Formula: (monthlyMiles / 100) * kwhPer100Miles * electricityRate
 *
 * @param monthlyMiles - Miles driven per month
 * @param kwhPer100Miles - EV efficiency in kWh per 100 miles (EPA rating)
 * @param electricityRate - Electricity cost in $/kWh
 */
export function calculateEvMonthlyCost(
  monthlyMiles: number,
  kwhPer100Miles: number,
  electricityRate: number,
): CostEstimate {
  const monthlyCost =
    (monthlyMiles / 100) * kwhPer100Miles * electricityRate;

  return {
    monthlyCost: Math.round(monthlyCost * 100) / 100,
    annualCost: Math.round(monthlyCost * 12 * 100) / 100,
    rateUsed: electricityRate,
    efficiencyUsed: kwhPer100Miles,
    monthlyMiles,
  };
}
