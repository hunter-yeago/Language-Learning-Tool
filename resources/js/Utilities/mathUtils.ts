/**
 * Calculate percentage from count and total
 *
 * @param count - The count value
 * @param total - The total value
 * @returns Percentage (0-100)
 *
 * @example
 * const pct = calculatePercentage(25, 100)
 * // Returns: 25
 */
export function calculatePercentage(count: number, total: number): number {
  if (total === 0) return 0
  return (count / total) * 100
}

/**
 * Calculate percentage and return as a string with '%' suffix
 *
 * @param count - The count value
 * @param total - The total value
 * @returns Percentage string (e.g., "25%")
 *
 * @example
 * const width = calculatePercentageString(25, 100)
 * // Returns: "25%"
 */
export function calculatePercentageString(count: number, total: number): string {
  return `${calculatePercentage(count, total)}%`
}

/**
 * Calculate percentage with specified decimal precision
 *
 * @param count - The count value
 * @param total - The total value
 * @param decimals - Number of decimal places (default: 1)
 * @returns Percentage string with fixed decimals (e.g., "25.5%")
 *
 * @example
 * const pct = calculatePercentageWithPrecision(1, 3, 1)
 * // Returns: "33.3%"
 */
export function calculatePercentageWithPrecision(
  count: number,
  total: number,
  decimals: number = 1
): string {
  if (total === 0) return '0%'
  return `${((count / total) * 100).toFixed(decimals)}%`
}
