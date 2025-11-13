// gradeable property - we do not want to include these in cycles with functionality exclusive to things that are "gradeable"
// for example, if a student did not use a word in the essay, then it is not possible to cycle to the other states.
// Additionally, we do not want it to be possbile to cycle to "attempted_but_not_used from a word that is marked incorrect"

import { GradeType } from '@/types/tutor';

type GradeableType = Exclude<GradeType, null>;

interface GradeConfigItem {
  label: string
  background: string
  text: string
  gradeable: boolean
}

export type GradeConfig = {
  [key in GradeableType]: GradeConfigItem
} & {
  [key: string]: GradeConfigItem | undefined
}

// TODO - add unused back in here
export const gradeConfig: GradeConfig = {
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

export function getGradeColor(grade: GradeType): string {
  if (!grade) return 'text-gray-800';
  const g = gradeConfig[grade as GradeableType];
  return g ? `${g.background} ${g.text}` : 'text-gray-800';
}

// update to handle waiting / not waitinf for grade
export function getGradeBackgroundColor(grade: GradeType): string {
  if (!grade) return 'bg-gray-200';
  return gradeConfig[grade as GradeableType]?.background || 'bg-gray-200';
}

export function getGradeLabel(grade: GradeType): string {
  if (!grade) return 'No Grade';
  return gradeConfig[grade as GradeableType]?.label || grade;
}

export function cycleGrade(grade: GradeType): GradeType {
  const gradeCycle = Object.entries(gradeConfig)
    .filter(([_, config]) => config !== undefined && config.gradeable)
    .map(([key]) => key) as GradeableType[];

  const currentIndex = gradeCycle.indexOf(grade as GradeableType);
  return gradeCycle[(currentIndex + 1) % gradeCycle.length];
}
