// gradeable property - we do not want to include these in cycles with functionality exclusive to things that are "gradeable"
// for example, if a student did not use a word in the essay, then it is not possible to cycle to the other states.
// Additionally, we do not want it to be possbile to cycle to "attempted_but_not_used from a word that is marked incorrect"

export const gradeConfig = {
  correct: {
    label: 'Correct',
    background: 'bg-green-200',
    text: 'text-green-800',
    gradeable: true,
  },
  partially_correct: {
    label: 'Partially Correct',
    background: 'bg-yellow-200',
    text: 'text-yellow-800',
    gradeable: true,
  },
  incorrect: {
    label: 'Incorrect',
    background: 'bg-red-200',
    text: 'text-red-800',
    gradeable: true,
  },
  used_in_essay: {
    label: 'Ungraded',
    background: 'bg-blue-200',
    text: 'text-blue-800',
    gradeable: false,
  },
  attempted_but_not_used: {
    label: 'Unused',
    background: 'bg-gray-200',
    text: 'text-gray-800',
    gradeable: false,
  },
  not_attempted: {
    label: 'Unused',
    background: 'bg-gray-200',
    text: 'text-gray-800',
    gradeable: false,
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
  const gradeCycle = Object.entries(gradeConfig)
    .filter(([_, config]) => config.gradeable)
    .map(([key]) => key)

  const currentIndex = gradeCycle.indexOf(grade)
  return gradeCycle[(currentIndex + 1) % gradeCycle.length]
}
