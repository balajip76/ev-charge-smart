import { describe, it, expect } from 'vitest';
import { calculateComparison, calculateAllStates } from '../../src/calc/comparison';
import type {
  CostEstimate,
  CostComparison,
  EnergyRatesData,
  GasPricesData,
  EvVehicle,
  GasVehicle,
} from '../../src/types';

describe('calculateComparison', () => {
  const makeEvCost = (monthlyCost: number): CostEstimate => ({
    monthlyCost,
    annualCost: Math.round(monthlyCost * 12 * 100) / 100,
    rateUsed: 0.15,
    efficiencyUsed: 30,
    monthlyMiles: 1000,
  });

  const makeGasCost = (monthlyCost: number): CostEstimate => ({
    monthlyCost,
    annualCost: Math.round(monthlyCost * 12 * 100) / 100,
    rateUsed: 3.2,
    efficiencyUsed: 27,
    monthlyMiles: 1000,
  });

  it('returns negative monthlyDifference when EV is cheaper', () => {
    const evCost = makeEvCost(45);
    const gasCost = makeGasCost(118.52);

    const result: CostComparison = calculateComparison('CA', 'California', evCost, gasCost);

    expect(result.stateAbbr).toBe('CA');
    expect(result.stateName).toBe('California');
    expect(result.evCost).toEqual(evCost);
    expect(result.gasCost).toEqual(gasCost);
    expect(result.monthlyDifference).toBe(-73.52);
    expect(result.annualDifference).toBe(-73.52 * 12);
  });

  it('returns positive monthlyDifference when EV is more expensive', () => {
    const evCost = makeEvCost(150);
    const gasCost = makeGasCost(100);

    const result: CostComparison = calculateComparison('HI', 'Hawaii', evCost, gasCost);

    expect(result.monthlyDifference).toBe(50);
    expect(result.annualDifference).toBe(600);
  });
});

describe('calculateAllStates', () => {
  const mockEnergyRates: EnergyRatesData = {
    lastUpdated: '2026-01-15T00:00:00Z',
    source: 'EIA',
    sourceUrl: 'https://www.eia.gov/',
    unit: 'dollars_per_kwh',
    states: {
      CA: { name: 'California', rate: 0.2714, period: '2026-01' },
      TX: { name: 'Texas', rate: 0.1350, period: '2026-01' },
      NY: { name: 'New York', rate: 0.2200, period: '2026-01' },
    },
  };

  const mockGasPrices: GasPricesData = {
    lastUpdated: '2026-01-15T00:00:00Z',
    source: 'AAA',
    unit: 'dollars_per_gallon',
    states: {
      CA: { name: 'California', price: 4.85, period: '2026-01' },
      TX: { name: 'Texas', price: 2.95, period: '2026-01' },
      NY: { name: 'New York', price: 3.60, period: '2026-01' },
    },
  };

  const mockEv: EvVehicle = {
    id: 'tesla-model-3-2025',
    make: 'Tesla',
    model: 'Model 3',
    year: 2025,
    kwhPer100Miles: 26,
    label: 'Tesla Model 3 (2025)',
  };

  const mockGasVehicle: GasVehicle = {
    id: 'toyota-camry-2025',
    make: 'Toyota',
    model: 'Camry',
    year: 2025,
    mpg: 32,
    label: 'Toyota Camry (2025)',
  };

  it('returns a Record with entries for all 3 states', () => {
    const result: Record<string, CostComparison> = calculateAllStates(
      mockEnergyRates,
      mockGasPrices,
      mockEv,
      mockGasVehicle,
      1000,
    );

    expect(Object.keys(result)).toHaveLength(3);
    expect(result).toHaveProperty('CA');
    expect(result).toHaveProperty('TX');
    expect(result).toHaveProperty('NY');
  });

  it('computes valid CostComparison for each state', () => {
    const result = calculateAllStates(
      mockEnergyRates,
      mockGasPrices,
      mockEv,
      mockGasVehicle,
      1000,
    );

    const ca = result['CA']!;
    expect(ca.stateAbbr).toBe('CA');
    expect(ca.stateName).toBe('California');
    expect(ca.evCost.monthlyCost).toBeGreaterThan(0);
    expect(ca.gasCost.monthlyCost).toBeGreaterThan(0);
    expect(ca.monthlyDifference).toBe(
      ca.evCost.monthlyCost - ca.gasCost.monthlyCost,
    );
    expect(ca.annualDifference).toBe(ca.monthlyDifference * 12);
  });

  it('skips states that are missing from gas prices data', () => {
    const sparseGasPrices: GasPricesData = {
      ...mockGasPrices,
      states: {
        CA: { name: 'California', price: 4.85, period: '2026-01' },
        // TX and NY intentionally omitted
      },
    };

    const result = calculateAllStates(
      mockEnergyRates,
      sparseGasPrices,
      mockEv,
      mockGasVehicle,
      1000,
    );

    expect(Object.keys(result)).toHaveLength(1);
    expect(result).toHaveProperty('CA');
    expect(result).not.toHaveProperty('TX');
    expect(result).not.toHaveProperty('NY');
  });
});
