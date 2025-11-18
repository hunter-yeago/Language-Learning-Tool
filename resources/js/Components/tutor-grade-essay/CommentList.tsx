import { getGradeColor } from '@/Utilities/tutor_utils/grades'
import { Essay } from '@/types/essay';
import { TutorWord } from '@/types/tutor'

interface CommentListProps {
  essay: Essay;
  data: TutorWord[];
  currentComment: number | null;
  setCurrentComment: (wordId: number | null) => void;
  setData: (key: string, value: TutorWord[]) => void;
  setTempData: (comment: string) => void;
}

export default function CommentList({ data, currentComment, setCurrentComment, setData, setTempData }: CommentListProps) {
  if (!data) return null

  function deleteComment(wordId: number) {
    // Update the word's comment in the data array
    const updatedWords = data.map((word) => {
      if (word.id === wordId) {
        return {
          ...word,
          pivot: {
            ...word.pivot,
            comment: '', // Clear the comment
          },
        }
      }
      return word
    })

    // Update the form data
    setData('words', updatedWords)
    setTempData('')
    setCurrentComment(null)
  }

  return (
    <div className="flex flex-col gap-3">
      {data.map((word) => {
        // Skip words without comments
        if (!word.pivot?.comment?.trim()) return null

        return (
          <div key={word.id} className="flex flex-col gap-2 border rounded-lg p-4 bg-gray-50">
            {/* Word / Grade / Buttons */}
            <div className="flex justify-between items-start">
              <p className="flex items-center gap-2">
                <span className={`list-none px-2 border py-1 rounded-full ${getGradeColor(word.pivot.grade)}`}>{word.word}</span>
                <span>
                  {word.pivot.grade === 'correct' && '- Correct'}
                  {word.pivot.grade === 'incorrect' && '- Incorrect'}
                  {word.pivot.grade === 'partially_correct' && '- Partially Correct'}
                </span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCurrentComment(word.id)
                    setTempData(word.pivot.comment) // Set current comment for editing
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button onClick={() => deleteComment(word.id)} className="text-red-600 hover:underline">
                  Delete
                </button>
              </div>
            </div>
            {/* Comment */}
            {currentComment !== word.id && word.pivot.comment && <p>{word.pivot.comment}</p>}
          </div>
        )
      })}
    </div>
  )
}
