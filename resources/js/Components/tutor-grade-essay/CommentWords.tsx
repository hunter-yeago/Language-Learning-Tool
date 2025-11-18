import { Essay } from '@/types/essay';
import { TutorWord } from '@/types/tutor'

interface CommentWordsProps {
  essay: Essay;
  data: TutorWord[];
  setCurrentComment: (wordId: number | null) => void;
  words: TutorWord[];
}

export default function CommentWords({ setCurrentComment, words }: CommentWordsProps) {
  return (
    <ul className="flex flex-wrap gap-2 border items-center rounded-lg p-4">
      {words.map((word) => {
        return (
          <li key={word.id}>
            <button onClick={() => setCurrentComment(word.id)} className={`px-2 py-1 rounded-full border hover:bg-gray-100`}>
              {word.word}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
