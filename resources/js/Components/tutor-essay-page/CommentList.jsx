import { getGradeColor } from '@/Utilities/tutor_utils/grades'

export default function CommentList({
  essay,
  wordData,
  currentComment,
  setCurrentComment,
  setWordData,
  setTempData,
}) {
  function deleteComment(wordId) {
    setWordData((prev) => {
      const updated = { ...prev }
      if (updated[wordId]) {
        updated[wordId].comment = ''
      }
      return updated
    })
    setTempData('')
    setCurrentComment(null)
  }

  return (
    <div className="flex flex-col gap-3">
      {essay.words.map((word) => {
        const data = wordData[word.id]
        if (!data?.comment?.trim()) return null

        return (
          <div
            key={word.id}
            className="flex flex-col gap-2 border rounded-lg p-4 bg-gray-50"
          >
            {/* Word / Grade / Buttons */}
            <div className="flex justify-between items-start">
              <p className="flex items-center gap-2">
                <span
                  className={`list-none px-2 border py-1 rounded-full ${getGradeColor(data.grade)}`}
                >
                  {word.word}
                </span>
                <span>
                  {data.grade === 'correct' && '- Correct'}
                  {data.grade === 'incorrect' && '- Incorrect'}
                  {data.grade === 'partially_correct' && '- Partially Correct'}
                </span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentComment(word.id)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteComment(word.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Comment */}
            {currentComment !== word.id && data.comment && (
              <p>{data.comment}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
