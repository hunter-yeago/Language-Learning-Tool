/**
 * Returns 's' if count is not 1, empty string otherwise
 * Useful for simple pluralization in English
 *
 * @param count - The count to check
 * @returns 's' if count !== 1, otherwise ''
 *
 * @example
 * <div>{count} word{pluralizeS(count)}</div>
 * // Returns: "5 words" or "1 word"
 */
export function pluralizeS(count: number): string {
  return count !== 1 ? 's' : ''
}

/**
 * Returns the plural or singular form based on count
 *
 * @param count - The count to check
 * @param singular - The singular form (default: '')
 * @param plural - The plural form (default: 's')
 * @returns plural if count !== 1, otherwise singular
 *
 * @example
 * pluralize(5, '', 's') // Returns: 's'
 * pluralize(1, '', 's') // Returns: ''
 * pluralize(5, 'is', 'are') // Returns: 'are'
 * pluralize(1, 'is', 'are') // Returns: 'is'
 */
export function pluralize(count: number, singular: string = '', plural: string = 's'): string {
  return count !== 1 ? plural : singular
}
