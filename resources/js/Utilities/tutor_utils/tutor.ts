import { Word } from '@/types/word'

/**
 * Represents a matched word found in the essay text with its position.
 */
interface WordMatch {
  word: Word
  startIndex: number
  endIndex: number
}

/**
 * Represents a segment of text that is either plain text or a matched word.
 * Used to build the highlighted essay view with clickable word buttons.
 */
interface TextSegment {
  type: 'text' | 'word'
  content: string
  wordId?: number
}

/**
 * Finds all positions where vocabulary words appear in the essay text.
 * Uses case-insensitive regex matching with word boundaries to find whole words only.
 * Sorts words by length (longest first) to prioritize longer matches and avoid partial matches.
 *
 * @param text - The essay text to search through
 * @param words - Array of vocabulary words to find in the text
 * @returns Array of word matches with their positions in the text
 *
 * @example
 * const text = "The benevolent teacher taught the class."
 * const words = [{ id: 1, word: "benevolent" }, { id: 2, word: "teacher" }]
 * getMatchingWordPositions(text, words)
 * // Returns: [
 * //   { word: { id: 1, word: "benevolent" }, startIndex: 4, endIndex: 14 },
 * //   { word: { id: 2, word: "teacher" }, startIndex: 15, endIndex: 22 }
 * // ]
 */
export function getMatchingWordPositions(text: string, words: Word[]): WordMatch[] {
  // Sort words by length (longest first) to prioritize longer matches over shorter substrings
  const sortedWords = [...words].sort((a, b) => b.word.length - a.word.length)

  // Initialize array to store all found matches
  const matches: WordMatch[] = []

  // Iterate through each vocabulary word to find its occurrences in the text
  sortedWords.forEach((wordObj) => {
    // Convert word to lowercase for case-insensitive matching
    const word = wordObj.word.toLowerCase()

    // Create regex with word boundaries (\b) to match whole words only, case-insensitive (gi flags)
    const wordRegex = new RegExp(`\\b${word}\\b`, 'gi')
    let match

    // Find all occurrences of this word in the text
    while ((match = wordRegex.exec(text.toLowerCase())) !== null) {
      // Store each match with its position and the original word object
      matches.push({
        word: wordObj,
        startIndex: match.index,
        endIndex: match.index + word.length,
      })
    }
  })

  return matches
}

/**
 * Filters out overlapping word matches, keeping only the first occurrence when words overlap.
 * This prevents highlighting the same portion of text multiple times.
 *
 * For example, if "benevolent" and "violent" both match in "benevolent", only "benevolent"
 * is kept since it starts first.
 *
 * @param positions - Array of word matches that may have overlapping positions
 * @returns Array of word matches with no overlapping positions
 *
 * @example
 * const matches = [
 *   { word: {...}, startIndex: 0, endIndex: 10 },
 *   { word: {...}, startIndex: 5, endIndex: 15 },  // Overlaps with first
 *   { word: {...}, startIndex: 20, endIndex: 25 }
 * ]
 * filterOverlappingMatches(matches)
 * // Returns: [
 * //   { word: {...}, startIndex: 0, endIndex: 10 },
 * //   { word: {...}, startIndex: 20, endIndex: 25 }
 * // ]
 */
export function filterOverlappingMatches(positions: WordMatch[]): WordMatch[] {
  // Initialize array to store non-overlapping matches
  const filtered: WordMatch[] = []

  // Track the end position of the last added match (start at -1 so first match always passes)
  let lastEnd = -1

  positions
    // Sort matches by their start position (left to right in the text)
    .sort((a, b) => a.startIndex - b.startIndex)
    .forEach((pos) => {
      // Only add this match if it starts at or after the end of the previous match (no overlap)
      if (pos.startIndex >= lastEnd) {
        filtered.push(pos)

        // Update the end position for the next iteration
        lastEnd = pos.endIndex
      }
    })

  return filtered
}

/**
 * Builds an array of text segments alternating between plain text and matched words.
 * This creates the data structure needed to render the essay with highlighted word buttons.
 *
 * The function iterates through word positions and creates:
 * - "text" segments for plain essay text
 * - "word" segments for vocabulary words (with wordId for linking to grades/comments)
 *
 * @param text - The complete essay text
 * @param positions - Array of non-overlapping word matches sorted by position
 * @returns Array of segments representing the essay with identified word positions
 *
 * @example
 * const text = "The benevolent teacher taught."
 * const positions = [
 *   { word: { id: 1, word: "benevolent" }, startIndex: 4, endIndex: 14 }
 * ]
 * buildHighlightedSegments(text, positions)
 * // Returns: [
 * //   { type: "text", content: "The " },
 * //   { type: "word", content: "benevolent", wordId: 1 },
 * //   { type: "text", content: " teacher taught." }
 * // ]
 */
export function buildHighlightedSegments(text: string, positions: WordMatch[]): TextSegment[] {
  // Track the current position in the text as we process word matches
  let lastIndex = 0

  // Initialize array to store alternating text and word segments
  const segments: TextSegment[] = []

  // Process each word match position
  positions.forEach((pos) => {
    // If there's plain text before this word, add it as a text segment
    if (pos.startIndex > lastIndex) {
      segments.push({
        type: 'text',
        content: text.substring(lastIndex, pos.startIndex),
      })
    }

    // Add the matched word as a word segment with its ID for linking
    segments.push({
      type: 'word',
      content: text.substring(pos.startIndex, pos.endIndex),
      wordId: pos.word.id,
    })

    // Update position to continue after this word
    lastIndex = pos.endIndex
  })

  // If there's remaining text after the last word, add it as a text segment
  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      content: text.substring(lastIndex),
    })
  }

  return segments
}
