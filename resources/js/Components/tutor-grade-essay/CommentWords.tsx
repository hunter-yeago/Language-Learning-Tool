import { TutorWord } from '@/types/tutor'
import { getGradeColor } from '@/Utilities/tutor_utils/grades'

interface CommentWordsProps {
  words: TutorWord[];
  setCurrentComment: (wordId: number | null) => void;
}

export default function CommentWords({ setCurrentComment, words }: CommentWordsProps) {
  return (
    <ul className="flex flex-wrap gap-4">
      {words.map((word) => {
        return (
          <li key={word.id}>
            <button
              onClick={() => setCurrentComment(word.id)}
              className={`px-2 py-1 rounded-full border hover:opacity-80 ${getGradeColor(word.pivot.grade)}`}
            >
              {word.word}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
