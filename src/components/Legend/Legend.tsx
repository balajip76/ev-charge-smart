import styles from './Legend.module.css';

interface LegendProps {
  minDiff: number;
  maxDiff: number;
}

export function Legend({ minDiff, maxDiff }: LegendProps) {
  return (
    <div className={styles.legend} aria-label="Cost comparison color legend">
      <div className={styles.labels}>
        <span className={styles.labelLeft}>
          EV saves ${Math.abs(Math.round(minDiff))}/mo
        </span>
        <span className={styles.labelCenter}>Break-even</span>
        <span className={styles.labelRight}>
          Gas saves ${Math.abs(Math.round(maxDiff))}/mo
        </span>
      </div>
      <div className={styles.gradientBar} />
    </div>
  );
}
