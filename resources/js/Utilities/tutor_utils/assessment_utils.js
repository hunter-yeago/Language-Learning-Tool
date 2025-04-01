export function getAssesmentColor(assessment) {

  if (assessment === 'correct') {
    return "bg-green-200 text-green-800";
  } else if (assessment === 'partiallyCorrect') {
    return "bg-yellow-200 text-yellow-800";
  } else if (assessment === 'incorrect') {
    return "bg-red-200 text-red-800";
  } else {
    return "bg-blue-200 text-blue-800";
  }

}

export function cycleAssessmentStatus(assessment) {

  if (!assessment) return 'correct';
  else if (assessment === 'correct') return 'partiallyCorrect';
  else if (assessment === 'partiallyCorrect') return 'incorrect';
  
  return undefined;

}