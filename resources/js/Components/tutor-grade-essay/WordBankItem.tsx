import { getGradeColor, getGradeLabel } from '@/Utilities/tutor_utils/grades'
import { TutorWord } from '@/types/tutor'
import WordButton from './WordButton'

interface WordBankItemProps {
  word: TutorWord;
  handleWordClick: (wordId: number) => void;
}

export default function WordBankItem({ word, handleWordClick }: WordBankItemProps) {
  const hasPreviousGrade = word.previous_grade && word.previous_grade !== null

  // Get border and text color for previous grade indicator
  const getPreviousGradeStyles = () => {
    if (!word.previous_grade) return { borderColor: '', textColor: '' }

    const styleMap: Record<string, { borderColor: string; textColor: string }> = {
      'correct': { borderColor: 'border-green-500', textColor: 'text-green-700' },
      'partially_correct': { borderColor: 'border-yellow-500', textColor: 'text-yellow-700' },
      'incorrect': { borderColor: 'border-red-500', textColor: 'text-red-700' },
      'not_used': { borderColor: 'border-gray-500', textColor: 'text-gray-700' },
    }

    return styleMap[word.previous_grade] || { borderColor: '', textColor: '' }
  }

  const styles = getPreviousGradeStyles()

  return (
    <li key={word.id} className="flex flex-col items-center gap-1">
      <WordButton color={getGradeColor(word.pivot.grade)} clickHandler={() => handleWordClick(word.id)} word={word.word} />
      {hasPreviousGrade && (
        <div className={`text-xs ${styles.textColor} border-t-2 ${styles.borderColor} pt-0.5 px-1`}>
          {getGradeLabel(word.previous_grade)}
        </div>
      )}
    </li>
  )
}
