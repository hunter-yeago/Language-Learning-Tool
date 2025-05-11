import { getGradeColor } from '@/Utilities/tutor_utils/grades'
import {
  buildHighlightedSegments,
  filterOverlappingMatches,
  getMatchingWordPositions,
} from '@/Utilities/tutor_utils/tutor'

export default function StudentEssay({ essay, wordData }) {
  function highlightWordButtons(text) {
    if (!text || !essay.words?.length) return <p>{text}</p>

    const matches = getMatchingWordPositions(text, essay.words)
    const filtered = filterOverlappingMatches(matches)
    const segments = buildHighlightedSegments(text, filtered)

    return (
      <div className="whitespace-pre-wrap text-gray-700">
        {segments.map((segment, idx) => {
          if (segment.type === 'text') {
            return <span key={idx}>{segment.content}</span>
          }

          const word = wordData[segment.wordId] || {}
          return (
            <button
              key={`${segment.wordId}-${idx}`}
              className={`px-2 py-1 rounded-full border ${
                word.grade ? getGradeColor(word.grade) : 'border-gray-300'
              }`}
            >
              {segment.content}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <section
      className="w-full border rounded-lg p-4 bg-gray-50"
      aria-label="the essay"
    >
      <h3 className="text-lg font-semibold mb-2">{essay.title}</h3>
      {highlightWordButtons(essay.content)}
    </section>
  )
}
