const MS_PER_DAY = 86_400_000; // 24 * 60 * 60 * 1000
const DEFAULT_MAX_AGE_DAYS = 30;

/**
 * Get the number of full days since the given timestamp.
 * @param lastUpdated - ISO 8601 timestamp string
 * @returns Number of days (rounded down)
 */
export function getDataAge(lastUpdated: string): number {
  const updatedDate = new Date(lastUpdated).getTime();
  const now = Date.now();
  return Math.floor((now - updatedDate) / MS_PER_DAY);
}

/**
 * Check if data is stale (older than maxAgeDays).
 * @param lastUpdated - ISO 8601 timestamp string
 * @param maxAgeDays - Maximum age in days before data is considered stale (default: 30)
 * @returns true if data is older than maxAgeDays
 */
export function isDataStale(
  lastUpdated: string,
  maxAgeDays: number = DEFAULT_MAX_AGE_DAYS,
): boolean {
  return getDataAge(lastUpdated) > maxAgeDays;
}
