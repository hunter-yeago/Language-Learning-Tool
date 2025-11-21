import { useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import GradedEssayUpdates from '@/Components/dashboard/GradedEssayUpdates'
import BucketOverviewCard from '@/Components/dashboard/BucketOverviewCard'
import { Bucket } from '@/types/bucket'
import { TutorWord } from '@/types/tutor'
import { Essay } from '@/types/essay'
import { gradeConfig, GRADE_ORDER, calculateGradeCounts, calculateMasteryPercentage, calculateTotalWords } from '@/Utilities/tutor_utils/grades'
import { countGradedEssays } from '@/Utilities/essayUtils'
import { pluralizeS } from '@/Utilities/stringUtils'
import { calculatePercentageString } from '@/Utilities/mathUtils'

interface Props {
  essays: Essay[]
  buckets: Bucket<TutorWord>[]
}

export default function ProgressPage({ essays, buckets }: Props) {
  const [selectedBucketId, setSelectedBucketId] = useState<number | null>(null)

  // Calculate overall statistics
  const totalWords = calculateTotalWords(buckets)
  const totalBuckets = buckets.length
  const totalEssays = essays.length
  const gradedEssays = countGradedEssays(essays)

  // Calculate overall grade statistics across all buckets
  const allWords = buckets.flatMap((bucket) => bucket.words)
  const overallGradeCounts = calculateGradeCounts(allWords)
  const correctWords = overallGradeCounts['correct'] || 0
  const masteredPercentage = calculateMasteryPercentage(overallGradeCounts, totalWords)

  return (
    <AuthenticatedLayout header={<h1 className="text-3xl font-semibold text-neutral-900">Progress</h1>}>
      <Head title="Progress" />

      <section className="flex flex-col gap-6">
        <GradedEssayUpdates essays={essays} currentBucketId={selectedBucketId ?? undefined} />

        {/* Overall Mastery Section */}
        {totalWords > 0 && (
          <article className="border  border-neutral-200 p-4 px-6 bg-white shadow-sm rounded-lg">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Overall Mastery</h2>

            <div className='flex flex-col items-center gap-5'>
                {/* Progress Bar */}
              <div className='w-full'>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-medium text-gray-700">Word Mastery Progress</span>
                  <span className="text-base font-semibold text-gray-900">{masteredPercentage}%</span>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  {correctWords} of {totalWords} words correct
                </div>
                <div className="h-8 bg-gray-200 flex rounded overflow-hidden border border-gray-300">
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

              {/* Overall Stats Grid */}
              <div className="w-full grid grid-cols-4 gap-4 mb-6">
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                  <div className="text-3xl font-bold text-indigo-900">{totalBuckets}</div>
                  <div className="text-sm text-indigo-700">Bucket{pluralizeS(totalBuckets)}</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="text-3xl font-bold text-purple-900">{totalWords}</div>
                  <div className="text-sm text-purple-700">Total Words</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-3xl font-bold text-blue-900">{totalEssays}</div>
                  <div className="text-sm text-blue-700">Essay{pluralizeS(totalEssays)} Written</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="text-3xl font-bold text-green-900">{gradedEssays}</div>
                  <div className="text-sm text-green-700">Essay{pluralizeS(gradedEssays)} Graded</div>
                </div>
              </div>
            </div>


          
          </article>
        )}

        {/* Bucket Overview Section */}
        {buckets.length > 0 ? (
          <article className="border border-neutral-200 p-8 bg-white shadow-sm rounded-lg">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Your Buckets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {buckets.map((bucket) => (
                <BucketOverviewCard
                  key={bucket.id}
                  bucket={bucket}
                  essays={essays}
                  onSelect={() => setSelectedBucketId(bucket.id)}
                  isSelected={selectedBucketId === bucket.id}
                />
              ))}
            </div>
          </article>
        ) : (
          <article className="border border-neutral-200 p-8 bg-white shadow-sm rounded-lg text-center">
            <p className="text-neutral-600">No buckets yet. Create your first bucket to get started!</p>
          </article>
        )}
      </section>
    </AuthenticatedLayout>
  )
}
