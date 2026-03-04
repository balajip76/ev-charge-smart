import type {
  CostComparison,
  CostEstimate,
  EnergyRatesData,
  GasPricesData,
  EvVehicle,
  GasVehicle,
} from '../types';
import { calculateEvMonthlyCost } from './ev-cost';
import { calculateGasMonthlyCost } from './gas-cost';

export function calculateComparison(
  stateAbbr: string,
  stateName: string,
  evCost: CostEstimate,
  gasCost: CostEstimate,
): CostComparison {
  const monthlyDifference =
    Math.round((evCost.monthlyCost - gasCost.monthlyCost) * 100) / 100;
  return {
    stateAbbr,
    stateName,
    evCost,
    gasCost,
    monthlyDifference,
    annualDifference: Math.round(monthlyDifference * 12 * 100) / 100,
  };
}

export function calculateAllStates(
  energyRates: EnergyRatesData,
  gasPrices: GasPricesData,
  ev: EvVehicle,
  gasVehicle: GasVehicle,
  monthlyMiles: number,
): Record<string, CostComparison> {
  const result: Record<string, CostComparison> = {};

  for (const [abbr, energyData] of Object.entries(energyRates.states)) {
    const gasData = gasPrices.states[abbr];
    if (!gasData) continue;

    const evCost = calculateEvMonthlyCost(
      monthlyMiles,
      ev.kwhPer100Miles,
      energyData.rate,
    );
    const gasCost = calculateGasMonthlyCost(
      monthlyMiles,
      gasVehicle.mpg,
      gasData.price,
    );

    result[abbr] = calculateComparison(abbr, energyData.name, evCost, gasCost);
  }

  return result;
}
