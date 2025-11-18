import { getGradeColor } from '@/Utilities/tutor_utils/grades'
import { buildHighlightedSegments, filterOverlappingMatches, getMatchingWordPositions } from '@/Utilities/tutor_utils/tutor'
import { Essay } from '@/types/essay';
import { TutorWord } from '@/types/tutor'

interface StudentEssayProps {
  essay: Essay;
  data: TutorWord[];
  words: TutorWord[];
}

export default function StudentEssay({ essay, data, words }: StudentEssayProps) {
  console.log('essay', essay)
  console.log('words', words)

  // const words = essay
  
  function highlightWordButtons(text: string) {
    if (!text || !words?.length) return <p>{text}</p>

    const matches = getMatchingWordPositions(text, words)
    const filtered = filterOverlappingMatches(matches)
    const segments = buildHighlightedSegments(text, filtered)

    return (
      <div className="whitespace-pre-wrap text-gray-700">
        {segments.map((segment, index) => {
          
          // return regular essay text 
          if (segment.type === 'text') return <span key={index}>{segment.content}</span>

          // connect data word with segment word via id
          const word = data.find((word) => word.id === segment.wordId)

          // early return
          if (!word) return <></>

          return (
            <button key={`${segment.wordId}-${index}`} className={`px-2 py-1 rounded-full border ${word.pivot.grade ? getGradeColor(word.pivot.grade) : 'border-gray-300'}`}>
              {segment.content}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <section className="w-full border rounded-lg p-4 bg-gray-50" aria-label="the essay">
      <h3 className="text-lg font-semibold mb-2">{essay.title}</h3>
      {highlightWordButtons(essay.content)}
    </section>
  )
}
