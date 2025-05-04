export function getGradeColor(grade) {

  if (grade === 'correct') {
    return "bg-green-200 text-green-800";
  } else if (grade === 'partiallyCorrect') {
    return "bg-yellow-200 text-yellow-800";
  } else if (grade === 'incorrect') {
    return "bg-red-200 text-red-800";
  } else {
    return ""
  }

}

export function cycleGrade(grade) {

  if (!grade) return 'correct';
  else if (grade === 'correct') return 'partiallyCorrect';
  else if (grade === 'partiallyCorrect') return 'incorrect';
  
  return undefined;

}