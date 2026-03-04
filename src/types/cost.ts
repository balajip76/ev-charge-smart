export interface CostEstimate {
  monthlyCost: number;
  annualCost: number;
  rateUsed: number; // $/kWh or $/gallon
  efficiencyUsed: number; // kWh/100mi or MPG
  monthlyMiles: number;
}

export interface CostComparison {
  stateAbbr: string;
  stateName: string;
  evCost: CostEstimate;
  gasCost: CostEstimate;
  monthlyDifference: number; // evCost - gasCost (negative = EV cheaper)
  annualDifference: number;
}
