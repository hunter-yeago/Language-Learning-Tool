// gradeable property - we do not want to include these in cycles with functionality exclusive to things that are "gradeable"
// for example, if a student did not use a word in the essay, then it is not possible to cycle to the other states.
// Additionally, we do not want it to be possbile to cycle to "attempted_but_not_used from a word that is marked incorrect"

// TODO - add unused back in here
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

  // so that tutor can reset the word when they are grading the students' essay
  // this may be broken, I guess I'll find out someday!
  not_used: {
    label: 'Not Used',
    background: 'bg-gray-200',
    text: 'text-gray-800',
    gradeable: true,
  },
}

export function getGradeColor(grade) {
  const g = gradeConfig[grade]
  return g ? `${g.background} ${g.text}` : 'text-gray-800'
}

// update to handle waiting / not waitinf for grade
export function getGradeBackgroundColor(grade) {
  return gradeConfig[grade]?.background || 'bg-gray-200'
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
