import type { CostEstimate } from '../types';

/**
 * Calculate monthly gas fueling cost.
 * Formula: (monthlyMiles / mpg) * gasPricePerGallon
 *
 * @param monthlyMiles - Miles driven per month
 * @param mpg - Gas vehicle efficiency in miles per gallon (EPA combined)
 * @param gasPricePerGallon - Gas price in $/gallon
 */
export function calculateGasMonthlyCost(
  monthlyMiles: number,
  mpg: number,
  gasPricePerGallon: number,
): CostEstimate {
  const monthlyCost = (monthlyMiles / mpg) * gasPricePerGallon;

  return {
    monthlyCost: Math.round(monthlyCost * 100) / 100,
    annualCost: Math.round(monthlyCost * 12 * 100) / 100,
    rateUsed: gasPricePerGallon,
    efficiencyUsed: mpg,
    monthlyMiles,
  };
}
