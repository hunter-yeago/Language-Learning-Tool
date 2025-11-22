import { Essay } from '@/types/essay'

/**
 * Check if an essay has been graded by a tutor
 *
 * @param essay - The essay to check
 * @returns true if the essay has both tutor_id and feedback
 *
 * @example
 * const graded = isEssayGraded(essay)
 * // Returns: true if essay has been graded
 */
export function isEssayGraded(essay: Essay): boolean {
  return !!(essay.tutor_id && essay.feedback)
}

/**
 * Check if an essay is newly graded (graded but not yet viewed by student)
 *
 * @param essay - The essay to check
 * @returns true if the essay has been graded but not viewed
 *
 * @example
 * const newlyGraded = isEssayNewlyGraded(essay)
 * // Returns: true if essay is graded but unviewed
 */
export function isEssayNewlyGraded(essay: Essay): boolean {
  return !!(essay.feedback && essay.tutor_id && !essay.viewed)
}

/**
 * Filter essays to only include those that have been graded
 *
 * @param essays - Array of essays to filter
 * @returns Array of graded essays
 *
 * @example
 * const gradedEssays = filterGradedEssays(allEssays)
 * // Returns: [essay1, essay2, ...] (only graded ones)
 */
export function filterGradedEssays(essays: Essay[]): Essay[] {
  return essays.filter(isEssayGraded)
}

/**
 * Filter essays to only include those that are newly graded
 *
 * @param essays - Array of essays to filter
 * @returns Array of newly graded essays
 *
 * @example
 * const newEssays = filterNewlyGradedEssays(allEssays)
 * // Returns: [essay1, essay2, ...] (only newly graded ones)
 */
export function filterNewlyGradedEssays(essays: Essay[]): Essay[] {
  return essays.filter(isEssayNewlyGraded)
}

/**
 * Filter essays by bucket ID
 *
 * @param essays - Array of essays to filter
 * @param bucketId - The bucket ID to filter by
 * @returns Array of essays belonging to the specified bucket
 *
 * @example
 * const bucketEssays = filterEssaysByBucket(allEssays, 5)
 * // Returns: [essay1, essay2, ...] (only essays from bucket 5)
 */
export function filterEssaysByBucket(essays: Essay[], bucketId?: number | null): Essay[] {
  if (!bucketId) return []
  return essays.filter(essay => essay.bucket_id === bucketId)
}

/**
 * Count the number of graded essays
 *
 * @param essays - Array of essays to count
 * @returns Number of graded essays
 *
 * @example
 * const count = countGradedEssays(allEssays)
 * // Returns: 5
 */
export function countGradedEssays(essays: Essay[]): number {
  return filterGradedEssays(essays).length
}
