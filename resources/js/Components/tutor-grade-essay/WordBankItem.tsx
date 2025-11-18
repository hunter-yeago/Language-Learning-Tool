import { getGradeColor } from '@/Utilities/tutor_utils/grades'
import { TutorWord } from '@/types/tutor'
import WordButton from './WordButton'

interface WordBankItemProps {
  word: TutorWord;  
  handleWordClick: (wordId: number) => void;
}

export default function WordBankItem({ word, handleWordClick }: WordBankItemProps) {
  // console.log('word in word bank item', word)
  return (
    <li key={word.id}>
      <WordButton color={getGradeColor(word.pivot.grade)} clickHandler={() => handleWordClick(word.id)} word={word.word} />
    </li>
  )
}
