import { getGradeColor } from '@/Utilities/tutor_utils/grades'
import WordButton from './WordButton'

export default function WordBankItem({ word, handleWordClick }) {
  if (word.pivot.grade === 'attempted_but_not_used')
    return (
      <li key={word.id}>
        <span className="bg-gray-100 text-gray-800 line-through px-2 py-1 rounded-full">{word.word}</span>
      </li>
    )

  console.log('word', word)

  return (
    <li key={word.id}>
      <WordButton color={getGradeColor(word.pivot.grade)} clickHandler={() => handleWordClick(word.id)} word={word.word} />
    </li>
  )
}
