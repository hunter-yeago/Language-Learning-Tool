import { GradeType } from '@/types/tutor'

/**
 * Filter words that are ungraded (no grade or marked as not_used)
 *
 * @param words - Array of words to filter
 * @returns Array of ungraded words
 *
 * @example
 * const ungraded = filterUngradedWords(bucket.words)
 * // Returns: [word1, word2, ...] (only words without grades)
 */
export function filterUngradedWords<T extends { pivot?: { grade?: GradeType | null } }>(words: T[]): T[] {
  return words.filter(word => !word.pivot?.grade || word.pivot.grade === 'not_used')
}

/**
 * Check if there are any ungraded words
 *
 * @param words - Array of words to check
 * @returns true if there are ungraded words
 *
 * @example
 * if (hasUngradedWords(bucket.words)) {
 *   console.log('Please grade all words')
 * }
 */
export function hasUngradedWords<T extends { pivot?: { grade?: GradeType | null } }>(words: T[]): boolean {
  return filterUngradedWords(words).length > 0
}

/**
 * Filter words that have comments
 *
 * @param words - Array of words to filter
 * @returns Array of words with non-empty comments
 *
 * @example
 * const commented = filterWordsWithComments(bucket.words)
 * // Returns: [word1, word2, ...] (only words with comments)
 */
export function filterWordsWithComments<T extends { pivot?: { comment?: string } }>(words: T[]): T[] {
  return words.filter(word => word.pivot?.comment?.trim())
}

/**
 * Check if any words have comments
 *
 * @param words - Array of words to check
 * @returns true if any word has a comment
 *
 * @example
 * if (hasWordComments(bucket.words)) {
 *   // Show comments section
 * }
 */
export function hasWordComments<T extends { pivot?: { comment?: string } }>(words: T[]): boolean {
  return words.some(word => word.pivot?.comment?.trim())
}

/**
 * Update a word's grade in an array
 *
 * @param words - Array of words
 * @param wordId - ID of the word to update
 * @param grade - New grade value
 * @returns New array with updated word
 *
 * @example
 * const updated = updateWordGrade(words, 5, 'correct')
 * // Returns: new array with word 5's grade set to 'correct'
 */
export function updateWordGrade<T extends { id: number; pivot?: any }>(
  words: T[],
  wordId: number,
  grade: GradeType
): T[] {
  return words.map(word =>
    word.id === wordId
      ? { ...word, pivot: { ...word.pivot, grade } }
      : word
  )
}

/**
 * Update a word's comment in an array
 *
 * @param words - Array of words
 * @param wordId - ID of the word to update
 * @param comment - New comment value
 * @returns New array with updated word
 *
 * @example
 * const updated = updateWordComment(words, 5, 'Good job!')
 * // Returns: new array with word 5's comment updated
 */
export function updateWordComment<T extends { id: number; pivot?: any }>(
  words: T[],
  wordId: number,
  comment: string
): T[] {
  return words.map(word =>
    word.id === wordId
      ? { ...word, pivot: { ...word.pivot, comment } }
      : word
  )
}

/**
 * Clear a word's comment (set to empty string)
 *
 * @param words - Array of words
 * @param wordId - ID of the word to clear comment for
 * @returns New array with cleared comment
 *
 * @example
 * const updated = clearWordComment(words, 5)
 * // Returns: new array with word 5's comment cleared
 */
export function clearWordComment<T extends { id: number; pivot?: any }>(
  words: T[],
  wordId: number
): T[] {
  return updateWordComment(words, wordId, '')
}

/**
 * Find a word by ID
 *
 * @param words - Array of words to search
 * @param wordId - ID of the word to find
 * @returns The word if found, undefined otherwise
 *
 * @example
 * const word = findWordById(words, 5)
 * if (word) {
 *   console.log(word.word)
 * }
 */
export function findWordById<T extends { id: number }>(words: T[], wordId: number): T | undefined {
  return words.find(word => word.id === wordId)
}

/**
 * Check if a word is used in an essay (appears in used words list)
 *
 * @param word - The word to check
 * @param usedWords - Array of words that have been used
 * @returns true if the word is in the used words list
 *
 * @example
 * const used = isWordUsed(word, essayWords)
 * // Returns: true if word appears in essayWords
 */
export function isWordUsed<T extends { id: number }>(word: T, usedWords: T[]): boolean {
  return usedWords.some(usedWord => usedWord.id === word.id)
}

/**
 * Create a lookup map of word IDs to their usage status
 *
 * @param words - All words
 * @param usedWords - Words that have been used
 * @returns Record mapping word ID to boolean (true if used)
 *
 * @example
 * const usageMap = createWordUsageMap(allWords, essayWords)
 * // Returns: { 1: true, 2: false, 3: true, ... }
 */
export function createWordUsageMap<T extends { id: number }>(
  words: T[],
  usedWords: T[]
): Record<number, boolean> {
  const usedWordIds = new Set(usedWords.map(word => word.id))
  return Object.fromEntries(words.map(word => [word.id, usedWordIds.has(word.id)]))
}

/**
 * Get CSS color class for a word based on its grade
 *
 * @param grade - The word's grade
 * @param gradeColorFn - Function that returns color classes for a grade
 * @param defaultClass - Default class if no grade (default: 'border-gray-300')
 * @returns CSS class string
 *
 * @example
 * const className = getWordColorClass(word.pivot.grade, getGradeColor)
 * // Returns: 'bg-green-200 text-green-800' or 'border-gray-300'
 */
export function getWordColorClass(
  grade: GradeType | null | undefined,
  gradeColorFn: (grade: GradeType) => string,
  defaultClass: string = 'border-gray-300'
): string {
  return grade ? gradeColorFn(grade) : defaultClass
}
