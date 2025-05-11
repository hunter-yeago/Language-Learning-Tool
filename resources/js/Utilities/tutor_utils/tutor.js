export function getMatchingWordPositions(text, words) {
  const sortedWords = [...words].sort((a, b) => b.word.length - a.word.length)
  const matches = []

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

  return matches
}

export function filterOverlappingMatches(positions) {
  const filtered = []
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

export function buildHighlightedSegments(text, positions) {
  let lastIndex = 0
  const segments = []

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
