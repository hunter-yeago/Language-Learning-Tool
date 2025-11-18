import { Word } from '@/types/word'

interface WordMatch {
  word: Word
  startIndex: number
  endIndex: number
}

interface TextSegment {
  type: 'text' | 'word'
  content: string
  wordId?: number
}

export function getMatchingWordPositions(text: string, words: Word[]): WordMatch[] {
  const sortedWords = [...words].sort((a, b) => b.word.length - a.word.length)
  const matches: WordMatch[] = []

  // console.log('sort words', sortedWords)

  sortedWords.forEach((wordObj) => {
    const word = wordObj.word.toLowerCase()
    const wordRegex = new RegExp(`\\b${word}\\b`, 'gi')
    let match

    while ((match = wordRegex.exec(text.toLowerCase())) !== null) {
      matches.push({
        word: wordObj,
        startIndex: match.index,
        endIndex: match.index + word.length,
      })
    }
  })

  // console.log('matches', matches)

  return matches
}

export function filterOverlappingMatches(positions: WordMatch[]): WordMatch[] {
  const filtered: WordMatch[] = []
  let lastEnd = -1

  positions
    .sort((a, b) => a.startIndex - b.startIndex)
    .forEach((pos) => {
      if (pos.startIndex >= lastEnd) {
        filtered.push(pos)
        lastEnd = pos.endIndex
      }
    })

  return filtered
}

export function buildHighlightedSegments(text: string, positions: WordMatch[]): TextSegment[] {
  let lastIndex = 0
  const segments: TextSegment[] = []

  positions.forEach((pos) => {
    if (pos.startIndex > lastIndex) {
      segments.push({
        type: 'text',
        content: text.substring(lastIndex, pos.startIndex),
      })
    }

    segments.push({
      type: 'word',
      content: text.substring(pos.startIndex, pos.endIndex),
      wordId: pos.word.id,
    })

    lastIndex = pos.endIndex
  })

  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      content: text.substring(lastIndex),
    })
  }

  return segments
}
