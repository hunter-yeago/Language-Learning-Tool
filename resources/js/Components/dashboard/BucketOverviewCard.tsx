import { Bucket } from '@/types/bucket'
import { TutorWord } from '@/types/tutor'
import { Essay } from '@/types/essay'
import { gradeConfig, GRADE_ORDER, calculateGradeCounts, calculateMasteryPercentage } from '@/Utilities/tutor_utils/grades'

interface Props {
  bucket: Bucket<TutorWord>
  essays: Essay[]
  onSelect: () => void
  isSelected: boolean
}

export default function BucketOverviewCard({ bucket, essays, onSelect, isSelected }: Props) {
  const bucketEssays = essays.filter((essay) => essay.bucket_id === bucket.id)

  // Calculate grade statistics
  const gradeCounts = calculateGradeCounts(bucket.words)
  const totalWords = bucket.words.length
  const correctWords = gradeCounts['correct'] || 0
  const masteredPercentage = calculateMasteryPercentage(gradeCounts, totalWords)

  return (
    <div
      onClick={onSelect}
      className={`
        bg-white border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg
        ${isSelected ? 'border-indigo-500 shadow-md' : 'border-gray-200'}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{bucket.title}</h3>
          {bucket.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">{bucket.description}</p>
          )}
        </div>
        {isSelected && (
          <div className="ml-2 flex-shrink-0">
            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-gray-900">{totalWords}</div>
          <div className="text-xs text-gray-600">Total Words</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-gray-900">{bucketEssays.length}</div>
          <div className="text-xs text-gray-600">Essays</div>
        </div>
      </div>

      {/* Mastery Stats */}
      {totalWords > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-700">Mastered</span>
            <span className="text-xs font-semibold text-gray-900">{masteredPercentage}%</span>
          </div>
          <div className="text-xs text-gray-600 mb-2">
            {correctWords} of {totalWords} words
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {totalWords > 0 && (
        <div className="h-6 bg-gray-200 flex rounded overflow-hidden border border-gray-300">
          {GRADE_ORDER.map((grade) => {
            const count = gradeCounts[grade] || 0
            if (count === 0) return null
            const width = `${(count / totalWords) * 100}%`
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
      )}

      {/* Empty State */}
      {totalWords === 0 && (
        <div className="text-center py-2">
          <p className="text-sm text-gray-500 italic">No words yet</p>
        </div>
      )}
    </div>
  )
}
