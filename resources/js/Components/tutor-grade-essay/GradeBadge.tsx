import { getGradeColor } from '@/Utilities/tutor_utils/grades'
import { GradeType } from '@/types/tutor'

interface GradeBadgeProps {
  grade: GradeType;
}

export default function GradeBadge({ grade }: GradeBadgeProps) {
  return (
    <span className={`inline-block px-2 py-1 rounded ${getGradeColor(grade)}`}>
      {grade === 'correct' ? 'Correct' : grade === 'partially_correct' ? 'Partially Correct' : grade === 'incorrect' ? 'Incorrect' : 'Waiting for Grade'}
    </span>
  )
}
