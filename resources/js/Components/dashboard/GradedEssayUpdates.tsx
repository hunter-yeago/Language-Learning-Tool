import { Essay } from '@/types/essay'
import { router } from '@inertiajs/react'

interface GradedEssayUpdatesProps {
  essays: Essay[]
  currentBucketId?: number
}

export default function GradedEssayUpdates({ essays, currentBucketId }: GradedEssayUpdatesProps) {
  // Filter for graded essays that haven't been viewed yet
  const newlyGradedEssays = essays.filter(essay =>
    essay.feedback &&
    essay.tutor_id &&
    !essay.viewed
  )

  const handleEssayClick = (essay: Essay) => {
    // Use currentBucketId if available to preserve bucket state
    router.get(route('student.view-essay', { essay_id: essay.id, bucket_id: currentBucketId }))
  }

  return (
    <article className="border border-neutral-200 p-8 bg-white shadow-sm rounded-lg">

      {newlyGradedEssays.length > 0 ? (
        <div className="space-y-3">
          <div className='flex gap-4 items-center'>
            <h2 className="text-xl font-semibold text-neutral-900">Updates</h2>
            <p className="text-sm text-neutral-600">
              You have {newlyGradedEssays.length} newly graded essay{newlyGradedEssays.length > 1 ? 's' : ''}!
            </p>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {newlyGradedEssays.map((essay) => (
              <li
                key={essay.id}
                onClick={() => handleEssayClick(essay)}
                className="border border-green-300 bg-green-50 p-4 rounded-md cursor-pointer hover:shadow-md hover:border-green-400 transition"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-semibold text-neutral-900">{essay.title}</div>
                  <span className="px-2 py-1 text-xs font-medium bg-green-600 text-white rounded">
                    New Feedback
                  </span>
                </div>
                <p className="text-sm text-neutral-600 line-clamp-2">{essay.content}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-neutral-500 italic">No new updates at this time.</p>
      )}
    </article>
  )
}
