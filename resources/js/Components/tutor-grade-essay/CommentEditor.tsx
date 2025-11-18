import { getGradeColor } from '@/Utilities/tutor_utils/grades'
import { TutorWord } from '@/types/tutor'

interface CommentEditorProps {
  words: TutorWord[];
  setData: (key: string, value: TutorWord[]) => void;
  currentComment: number | null;
  setCurrentComment: (wordId: number | null) => void;
  tempData: string;
  setTempData: (comment: string) => void;
}

export default function CommentEditor({ currentComment, setCurrentComment, tempData, setTempData, words, setData }: CommentEditorProps) {
  function saveComment() {
    if (currentComment != null) {
      // Find the current word in data array
      const updatedWords = words.map((word: TutorWord) => {
        if (word.id === currentComment) {
          return {
            ...word,
            pivot: {
              ...word.pivot,
              comment: tempData,
            },
          }
        }
        return word
      })

      // Update the form data
      setData('words', updatedWords)
    }

    setTempData('')
    setCurrentComment(null)
  }

  function cancelEdit() {
    setTempData('')
    setCurrentComment(null)
  }

  if (!currentComment) return null

  // Find the word object from the data
  const wordObj = words.find((word) => word.id === currentComment)

  if (!wordObj) return null

  return (
    <article className="border rounded-lg p-4 bg-gray-50 mb-4">
      <h4 className="font-medium mb-2">
        Comment on: <span className={`px-2 py-1 rounded-full ${getGradeColor(wordObj.pivot?.grade)}`}>{wordObj.word}</span>
      </h4>
      <textarea
        value={tempData}
        onChange={(event) => setTempData(event.target.value)}
        rows={3}
        placeholder="Add a comment about this word..."
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <div className="mt-2 flex justify-end gap-2">
        <button onClick={cancelEdit} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">
          Cancel
        </button>
        <button onClick={saveComment} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Save
        </button>
      </div>
    </article>
  )
}
