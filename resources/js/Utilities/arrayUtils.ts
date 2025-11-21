/**
 * Check if an array is empty or null/undefined
 *
 * @param items - Array to check
 * @returns true if array is null, undefined, or has length 0
 *
 * @example
 * if (isEmpty(words)) {
 *   return <EmptyState />
 * }
 */
export function isEmpty<T>(items?: T[] | null): boolean {
  return !Array.isArray(items) || items.length === 0
}

/**
 * Check if an array is not empty
 *
 * @param items - Array to check
 * @returns true if array exists and has items
 *
 * @example
 * if (isNotEmpty(words)) {
 *   return <WordsList words={words} />
 * }
 */
export function isNotEmpty<T>(items?: T[] | null): boolean {
  return Array.isArray(items) && items.length > 0
}

/**
 * Find an item by ID in an array
 *
 * @param items - Array to search
 * @param id - ID to search for
 * @returns The item if found, undefined otherwise
 *
 * @example
 * const bucket = findById(buckets, 5)
 */
export function findById<T extends { id: number }>(items: T[], id?: number | null): T | undefined {
  if (!id) return undefined
  return items.find(item => item.id === id)
}

/**
 * Find an item by ID or return null
 *
 * @param items - Array to search
 * @param id - ID to search for
 * @returns The item if found, null otherwise
 *
 * @example
 * const bucket = findByIdOrNull(buckets, bucketId)
 * if (bucket) {
 *   console.log(bucket.title)
 * }
 */
export function findByIdOrNull<T extends { id: number }>(items: T[], id?: number | null): T | null {
  return findById(items, id) || null
}

/**
 * Calculate total count of items in nested arrays
 *
 * @param containers - Array of objects containing arrays
 * @param arrayKey - Key name of the nested array property
 * @returns Total count across all nested arrays
 *
 * @example
 * const totalWords = calculateTotalItems(buckets, 'words')
 * // Returns: sum of all words across all buckets
 */
export function calculateTotalItems<T extends Record<K, any[]>, K extends keyof T>(
  containers: T[],
  arrayKey: K
): number {
  return containers.reduce((sum, container) => sum + container[arrayKey].length, 0)
}
