import { useMemo } from 'react';
import type { EvVehicle, GasVehicle, CostComparison } from '../types';
import type { EnergyRatesData, GasPricesData } from '../types/state';
import { calculateAllStates } from '../calc';
import energyRatesJson from '../data/energy-rates.json';
import gasPricesJson from '../data/gas-prices.json';

const energyRates = energyRatesJson as EnergyRatesData;
const gasPrices = gasPricesJson as GasPricesData;

export function useCostData(
  selectedEv: EvVehicle,
  selectedGas: GasVehicle,
  monthlyMiles: number,
): {
  costsByState: Record<string, CostComparison>;
  energySource: string;
  gasSource: string;
  lastUpdated: string;
} {
  const costsByState = useMemo(
    () =>
      calculateAllStates(
        energyRates,
        gasPrices,
        selectedEv,
        selectedGas,
        monthlyMiles,
      ),
    [selectedEv, selectedGas, monthlyMiles],
  );

  return {
    costsByState,
    energySource: energyRates.source,
    gasSource: gasPrices.source,
    lastUpdated: energyRates.lastUpdated,
  };
}
