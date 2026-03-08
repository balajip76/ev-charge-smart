import styles from './Legend.module.css';

interface LegendProps {
  minDiff: number;
  maxDiff: number;
  monthlyMiles: number;
}

function getRightLabel(maxDiff: number): string {
  if (maxDiff < 0) return `EV saves $${Math.abs(Math.round(maxDiff))}/mo`;
  if (maxDiff === 0) return 'Break even';
  return `Gas saves $${Math.abs(Math.round(maxDiff))}/mo`;
}

export function Legend({ minDiff, maxDiff, monthlyMiles }: LegendProps) {
  return (
    <div className={styles.legend} aria-label="Cost comparison color legend">
      <p className={styles.mileageNote}>
        Based on {monthlyMiles.toLocaleString()} miles/month
      </p>
      <div className={styles.labels}>
        <span className={styles.labelLeft}>
          EV saves ${Math.abs(Math.round(minDiff))}/mo
        </span>
        <span className={styles.labelRight}>{getRightLabel(maxDiff)}</span>
      </div>
      <div className={styles.gradientBar} />
    </div>
  );
}
