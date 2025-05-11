import { gradeConfig } from '@/Utilities/tutor_utils/grades'

export default function GradeProgressBar({ words }) {
  if (!words || words.length === 0) return null

  const gradeOrder = ['correct', 'partially_correct', 'incorrect', 'used_in_essay', 'not_attempted']

  const gradeCounts = words.reduce((acc, word) => {
    const grade = word.pivot?.grade || 'not_attempted'
    acc[grade] = (acc[grade] || 0) + 1
    return acc
  }, {})

  const total = words.length

  return (
    <div className="w-[min(50%,400px)] h-8 bg-gray-200 flex rounded overflow-hidden border">
      {gradeOrder.map((grade) => {
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
