export const gradeConfig = {
  correct: {
    label: 'Correct',
    background: 'bg-green-200',
    text: 'text-green-800',
  },
  partially_correct: {
    label: 'Partially Correct',
    background: 'bg-yellow-200',
    text: 'text-yellow-800',
  },
  incorrect: {
    label: 'Incorrect',
    background: 'bg-red-200',
    text: 'text-red-800',
  },
  used_in_essay: {
    label: 'Ungraded',
    background: 'bg-blue-200',
    text: 'text-blue-800',
  },
  attempted_but_not_used: {
    label: 'Unused',
    background: 'bg-gray-200',
    text: 'text-gray-800',
  },
  not_attempted: {
    label: 'Unused',
    background: 'bg-gray-200',
    text: 'text-gray-800',
  },
}

export function getGradeColor(grade) {
  const g = gradeConfig[grade]
  return g ? `${g.background} ${g.text}` : ''
}

export function getGradeBackgroundColor(grade) {
  return gradeConfig[grade]?.background || ''
}

export function getGradeLabel(grade) {
  return gradeConfig[grade]?.label || grade
}

export function cycleGrade(grade) {
  const gradeCycle = Object.keys(gradeConfig)
  const currentIndex = gradeCycle.indexOf(grade)
  return gradeCycle[(currentIndex + 1) % gradeCycle.length]
}
