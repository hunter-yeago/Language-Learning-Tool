import { gradeConfig, GRADE_ORDER, calculateGradeCounts } from '@/Utilities/tutor_utils/grades'
import { TutorWord } from '@/types/tutor'

interface Props {
  words: TutorWord[]
}

export default function GradeProgressBar({ words }: Props) {
  if (!words || words.length === 0) return null

  const gradeCounts = calculateGradeCounts(words)
  const total = words.length

  return (
    <div className="w-[min(50%,400px)] h-8 bg-gray-200 flex rounded overflow-hidden border">
      {GRADE_ORDER.map((grade) => {
        const count = gradeCounts[grade] || 0
        if (count === 0) return null
        const width = `${(count / total) * 100}%`
        return (
          <div
            key={grade}
            className={`${gradeConfig[grade]?.background || 'bg-gray-200'}`}
            style={{ width }}
            title={`${gradeConfig[grade]?.label || grade}: ${count} (${((count / total) * 100).toFixed(1)}%)`}
          />
        )
      })}
    </div>
  )
}
