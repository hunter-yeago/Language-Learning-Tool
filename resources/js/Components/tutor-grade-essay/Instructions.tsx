import { useState } from 'react'
import { cycleGrade, getGradeColor } from '@/Utilities/tutor_utils/grades'
import { GradeType } from '@/types/tutor'

export default function Instructions() {
  const [exampleGrade, setExampleGrade] = useState<GradeType>(null)

  const handleExampleClick = () => {
    setExampleGrade(cycleGrade(exampleGrade))
  }

  return (
    <div className="flex gap-10 text-sm text-gray-600 py-4">
      <div className="flex flex-col gap-1">
        <span>Click on highlighted words to grade them:</span>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full border">Correct</span> →
          <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full border">Partially Correct</span> →
          <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full border">Incorrect</span>
        </div>
      </div>

      <div className="flex flex-col gap-1 pt-1">
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={handleExampleClick}
              className={`list-none border px-2 py-1 rounded-full ${getGradeColor(exampleGrade)}`}
            >
              Example
            </button>
            <div className="text-xs text-blue-700 border-t-2 border-blue-500 pt-0.5 px-1">
              Previous Grade
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
