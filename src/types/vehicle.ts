export interface EvVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  kwhPer100Miles: number; // kWh per 100 miles (EPA rating)
  label: string; // Display label, e.g. "Tesla Model 3 (2025)"
}

export interface GasVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  mpg: number; // Miles per gallon (EPA combined)
  label: string;
}

export interface VehicleCatalog {
  evs: EvVehicle[];
  gasVehicles: GasVehicle[];
}
