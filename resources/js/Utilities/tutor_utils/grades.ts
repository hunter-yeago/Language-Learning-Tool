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

/**
 * Returns Tailwind CSS classes for background and text color based on the grade type.
 *
 * @param grade - The grade type (correct, incorrect, partially_correct, not_used, or null)
 * @returns A string containing Tailwind CSS classes for background and text colors
 *
 * @example
 * getGradeColor('correct') // Returns: "bg-green-200 text-green-800"
 * getGradeColor(null) // Returns: "text-gray-800"
 */
export function getGradeColor(grade: GradeType): string {
  // Return default gray color if no grade is provided
  if (!grade) return 'text-gray-800';

  // Look up the grade configuration for the provided grade
  const g = gradeConfig[grade as GradeableType];

  // Return combined background and text classes, or default if config not found
  return g ? `${g.background} ${g.text}` : 'text-gray-800';
}

/**
 * Returns only the Tailwind CSS background color class based on the grade type.
 * Used when you only need the background color without text color styling.
 *
 * @param grade - The grade type (correct, incorrect, partially_correct, not_used, or null)
 * @returns A string containing the Tailwind CSS background color class
 *
 * @example
 * getGradeBackgroundColor('correct') // Returns: "bg-green-200"
 * getGradeBackgroundColor(null) // Returns: "bg-gray-200"
 */
export function getGradeBackgroundColor(grade: GradeType): string {
  // Return default gray background if no grade is provided
  if (!grade) return 'bg-gray-200';

  // Return the background color from config, or default gray if not found
  return gradeConfig[grade as GradeableType]?.background || 'bg-gray-200';
}

/**
 * Returns a human-readable label for the grade type.
 * Converts grade enum values into user-friendly display text.
 *
 * @param grade - The grade type (correct, incorrect, partially_correct, not_used, or null)
 * @returns A human-readable string label for the grade
 *
 * @example
 * getGradeLabel('correct') // Returns: "Correct"
 * getGradeLabel('partially_correct') // Returns: "Partially Correct"
 * getGradeLabel(null) // Returns: "No Grade"
 */
export function getGradeLabel(grade: GradeType): string {
  // Return "No Grade" text if no grade is provided
  if (!grade) return 'No Grade';

  // Return the label from config, or fall back to the grade string itself if not found
  return gradeConfig[grade as GradeableType]?.label || grade;
}

/**
 * Cycles to the next grade in the grading sequence.
 * Used when tutors click on word buttons to change grades.
 * The cycle goes: correct → partially_correct → incorrect → not_used → correct (loops)
 *
 * Only cycles through grades marked as "gradeable" in the config.
 *
 * @param grade - The current grade type
 * @returns The next grade type in the cycle
 *
 * @example
 * cycleGrade('correct') // Returns: "partially_correct"
 * cycleGrade('not_used') // Returns: "correct" (loops back to start)
 */
export function cycleGrade(grade: GradeType): GradeType {
  // Build an array of all gradeable grade types from the config
  const gradeCycle = Object.entries(gradeConfig)
    // Filter to only include grades that are defined and marked as gradeable
    .filter(([_, config]) => config !== undefined && config.gradeable)
    // Extract just the grade keys (e.g., 'correct', 'partially_correct')
    .map(([key]) => key) as GradeableType[];

  // Find the current grade's position in the cycle array
  const currentIndex = gradeCycle.indexOf(grade as GradeableType);

  // Return the next grade, using modulo to wrap around to the beginning
  return gradeCycle[(currentIndex + 1) % gradeCycle.length];
}
