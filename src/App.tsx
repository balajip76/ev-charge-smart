import { useState, useCallback } from 'react';
import { useVehicleSelection } from './hooks/useVehicleSelection';
import { useCostData } from './hooks/useCostData';
import type { CostComparison } from './types';
import vehicleCatalog from './data/vehicles.json';
import { USMap } from './components/USMap/USMap';
import { Tooltip } from './components/Tooltip/Tooltip';
import { Legend } from './components/Legend/Legend';
import styles from './App.module.css';

const evs = vehicleCatalog.evs;
const gasVehicles = vehicleCatalog.gasVehicles;

export default function App() {
  const { selectedEv, selectedGas, monthlyMiles } = useVehicleSelection(
    evs,
    gasVehicles,
  );
  const { costsByState } = useCostData(selectedEv, selectedGas, monthlyMiles);

  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const hoveredComparison: CostComparison | null = hoveredState
    ? costsByState[hoveredState] ?? null
    : null;

  // Compute min/max differences for legend
  const diffs = Object.values(costsByState).map((c) => c.monthlyDifference);
  const minDiff = diffs.length > 0 ? Math.min(...diffs) : -100;
  const maxDiff = diffs.length > 0 ? Math.max(...diffs) : 100;

  const handleStateHover = useCallback(
    (stateAbbr: string | null, event: React.MouseEvent) => {
      setHoveredState(stateAbbr);
      if (stateAbbr) {
        setTooltipPos({ x: event.clientX, y: event.clientY });
      }
    },
    [],
  );

  const handleStateClick = useCallback((stateAbbr: string) => {
    // Phase 5 will add detail panel; for MVP just log
    console.log('Clicked state:', stateAbbr);
  }, []);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>EVChargeSmart</h1>
        <p className={styles.subtitle}>
          Compare EV charging vs gas costs across all 50 states
        </p>
      </header>

      <section className={styles.mapSection}>
        <USMap
          costsByState={costsByState}
          minDiff={minDiff}
          maxDiff={maxDiff}
          onStateHover={handleStateHover}
          onStateClick={handleStateClick}
        />
        <Legend minDiff={minDiff} maxDiff={maxDiff} />
        <Tooltip
          comparison={hoveredComparison}
          x={tooltipPos.x}
          y={tooltipPos.y}
        />
      </section>

      <footer className={styles.footer}>
        <p className={styles.footerTitle}>Data Sources</p>
        <ul className={styles.sourceList}>
          <li>
            <strong>Electricity rates</strong> — U.S. Energy Information
            Administration (EIA),{' '}
            <a
              href="https://www.eia.gov/electricity/monthly/"
              target="_blank"
              rel="noreferrer"
            >
              Electric Power Monthly
            </a>{' '}
            (Jan 2026)
          </li>
          <li>
            <strong>Gas prices</strong> — EIA / AAA,{' '}
            <a
              href="https://gasprices.aaa.com/state-gas-price-averages/"
              target="_blank"
              rel="noreferrer"
            >
              State Gas Price Averages
            </a>{' '}
            (Feb 2026)
          </li>
          <li>
            <strong>Vehicle efficiency</strong> — U.S. Environmental Protection
            Agency (EPA),{' '}
            <a
              href="https://www.fueleconomy.gov/"
              target="_blank"
              rel="noreferrer"
            >
              fueleconomy.gov
            </a>
          </li>
        </ul>
        <p className={styles.footerNote}>
          Estimates assume home charging and average residential electricity
          rates. Actual costs may vary.
        </p>
      </footer>
    </div>
  );
}
