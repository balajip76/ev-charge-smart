import type { CostComparison } from '../../types';
import styles from './Tooltip.module.css';

interface TooltipProps {
  comparison: CostComparison | null;
  x: number;
  y: number;
}

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

function formatDifference(value: number): string {
  const abs = Math.abs(value);
  if (value < 0) return `-$${abs.toFixed(2)}`;
  if (value > 0) return `+$${abs.toFixed(2)}`;
  return `$${abs.toFixed(2)}`;
}

export function Tooltip({ comparison, x, y }: TooltipProps) {
  if (!comparison) return null;

  // Offset from cursor and detect viewport edges
  const offset = 12;
  const tooltipWidth = 220;
  const tooltipHeight = 120;
  const left =
    x + tooltipWidth + offset > window.innerWidth
      ? x - tooltipWidth - offset
      : x + offset;
  const top =
    y + tooltipHeight + offset > window.innerHeight
      ? y - tooltipHeight - offset
      : y + offset;

  return (
    <div
      className={styles.tooltip}
      style={{ left, top }}
      role="tooltip"
      data-testid="cost-tooltip"
    >
      <div className={styles.stateName}>{comparison.stateName}</div>
      <div className={styles.row}>
        <span className={styles.label}>EV Cost</span>
        <span className={styles.evValue}>
          {formatCurrency(comparison.evCost.monthlyCost)}/mo
        </span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>Gas Cost</span>
        <span className={styles.gasValue}>
          {formatCurrency(comparison.gasCost.monthlyCost)}/mo
        </span>
      </div>
      <div className={styles.divider} />
      <div className={styles.row}>
        <span className={styles.label}>Difference</span>
        <span
          className={
            comparison.monthlyDifference <= 0
              ? styles.evCheaper
              : styles.gasCheaper
          }
        >
          {formatDifference(comparison.monthlyDifference)}/mo
        </span>
      </div>
    </div>
  );
}
