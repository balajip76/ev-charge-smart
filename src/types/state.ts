export interface StateEnergyRate {
  name: string;
  rate: number; // $/kWh
  period: string; // e.g. "2026-01"
}

export interface EnergyRatesData {
  lastUpdated: string; // ISO 8601
  source: string;
  sourceUrl: string;
  unit: 'dollars_per_kwh';
  states: Record<string, StateEnergyRate>;
}

export interface StateGasPrice {
  name: string;
  price: number; // $/gallon
  period: string;
}

export interface GasPricesData {
  lastUpdated: string;
  source: string;
  sourceUrl?: string;
  unit: 'dollars_per_gallon';
  states: Record<string, StateGasPrice>;
}
