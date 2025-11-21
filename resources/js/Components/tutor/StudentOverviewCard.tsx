import { Bucket } from '@/types/bucket'
import { TutorWord } from '@/types/tutor'
import { Essay } from '@/types/essay'
import { gradeConfig, GRADE_ORDER, calculateGradeCounts, calculateMasteryPercentage, calculateTotalWords } from '@/Utilities/tutor_utils/grades'
import { filterEssaysByBucket, isEssayGraded } from '@/Utilities/essayUtils'
import { pluralizeS } from '@/Utilities/stringUtils'
import { calculatePercentageString } from '@/Utilities/mathUtils'
import { useState, useEffect } from 'react'
import { router } from '@inertiajs/react'

interface Student {
  id: number
  name: string
  email: string
  buckets: Bucket<TutorWord>[]
  essays: Essay[]
  total_essays: number
  graded_essays: number
}

interface Props {
  student: Student
  initialExpanded?: boolean
}

export default function StudentOverviewCard({ student, initialExpanded = false }: Props) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded)

  // Update expanded state when initialExpanded changes
  useEffect(() => {
    setIsExpanded(initialExpanded)
  }, [initialExpanded])

  const totalWords = calculateTotalWords(student.buckets)
  const totalBuckets = student.buckets.length

  // Calculate overall grade statistics across all buckets
  const allWords = student.buckets.flatMap((bucket) => bucket.words)
  const overallGradeCounts = calculateGradeCounts(allWords)
  const correctWords = overallGradeCounts['correct'] || 0
  const masteredPercentage = calculateMasteryPercentage(overallGradeCounts, totalWords)

  return (
    <div className="w-full bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-gray-300 transition-all">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left cursor-pointer"
      >
        {/* Student Header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-600">{student.email}</p>
              </div>
              {isExpanded ? (
                <svg className="h-6 w-6 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="h-6 w-6 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </div>

            {/* Overall Mastery */}
            {totalWords > 0 && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Overall Mastery</span>
                  <span className="text-sm font-semibold text-gray-900">{masteredPercentage}%</span>
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  {correctWords} of {totalWords} words correct
                </div>

                {/* Overall Progress Bar */}
                <div className="h-6 bg-gray-200 flex rounded overflow-hidden border border-gray-300">
                  {GRADE_ORDER.map((grade) => {
                    const count = overallGradeCounts[grade] || 0
                    if (count === 0) return null
                    const width = calculatePercentageString(count, totalWords)
                    return (
                      <div
                        key={grade}
                        className={`${gradeConfig[grade]?.background || 'bg-gray-200'}`}
                        style={{ width }}
                        title={`${gradeConfig[grade]?.label || grade}: ${count}`}
                      />
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Overall Stats Grid */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
            <div className="text-2xl font-bold text-indigo-900">{totalBuckets}</div>
            <div className="text-xs text-indigo-700">Bucket{pluralizeS(totalBuckets)}</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
            <div className="text-2xl font-bold text-purple-900">{totalWords}</div>
            <div className="text-xs text-purple-700">Total Words</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="text-2xl font-bold text-blue-900">{student.total_essays}</div>
            <div className="text-xs text-blue-700">Essay{pluralizeS(student.total_essays)} Written</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="text-2xl font-bold text-green-900">{student.graded_essays}</div>
            <div className="text-xs text-green-700">Essay{pluralizeS(student.graded_essays)} Graded</div>
          </div>
        </div>
      </button>

      {/* Buckets List - Only shown when expanded */}
      {isExpanded && student.buckets.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Buckets:</h4>
          <div className="grid grid-cols-2 gap-4">
            {student.buckets.map((bucket) => {
              const bucketGradeCounts = calculateGradeCounts(bucket.words)
              const bucketTotal = bucket.words.length
              const bucketMastery = calculateMasteryPercentage(bucketGradeCounts, bucketTotal)

              // Get essays for this bucket
              const bucketEssays = filterEssaysByBucket(student.essays, bucket.id)

              return (
                <div key={bucket.id} className="bg-gray-50 rounded p-3 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-gray-900 truncate">{bucket.title}</span>
                    <span className="text-xs text-gray-600 flex-shrink-0 ml-2">
                      {bucket.words.length} word{pluralizeS(bucket.words.length)}
                    </span>
                  </div>
                  {bucketTotal > 0 && (
                    <>
                      <div className="text-xs text-gray-600 mb-1">{bucketMastery}% mastered</div>
                      <div className="h-4 bg-gray-200 flex rounded overflow-hidden">
                        {GRADE_ORDER.map((grade) => {
                          const count = bucketGradeCounts[grade] || 0
                          if (count === 0) return null
                          const width = calculatePercentageString(count, bucketTotal)
                          return (
                            <div
                              key={grade}
                              className={`${gradeConfig[grade]?.background || 'bg-gray-200'}`}
                              style={{ width }}
                            />
                          )
                        })}
                      </div>
                    </>
                  )}

                  {/* Essays for this bucket */}
                  {bucketEssays.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <div className="text-xs font-semibold text-gray-700 mb-2">Essays:</div>
                      <div className="space-y-2">
                        {bucketEssays.map((essay) => (
                          <div
                            key={essay.id}
                            onClick={(e) => {
                              e.stopPropagation()
                              router.get(route('tutor.view-essay', { essay_id: essay.id, student_id: student.id }))
                            }}
                            className="bg-white rounded px-2 py-1.5 border border-gray-200 text-xs cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900 truncate">{essay.title}</span>
                              {isEssayGraded(essay) ? (
                                <span className="px-1.5 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded flex-shrink-0 ml-2">
                                  Graded
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded flex-shrink-0 ml-2">
                                  Pending
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty State - Only shown when expanded */}
      {isExpanded && student.buckets.length === 0 && (
        <div className="text-center py-4 mt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 italic">No buckets yet</p>
        </div>
      )}
    </div>
  )
}
