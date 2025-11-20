import { useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import GradedEssayUpdates from '@/Components/dashboard/GradedEssayUpdates'
import BucketOverviewCard from '@/Components/dashboard/BucketOverviewCard'
import { Bucket } from '@/types/bucket'
import { TutorWord } from '@/types/tutor'
import { Essay } from '@/types/essay'

interface Props {
  essays: Essay[]
  buckets: Bucket<TutorWord>[]
}

export default function ProgressPage({ essays, buckets }: Props) {
  const [selectedBucketId, setSelectedBucketId] = useState<number | null>(null)

  return (
    <AuthenticatedLayout header={<h1 className="text-3xl font-semibold text-neutral-900">Progress</h1>}>
      <Head title="Progress" />

      <section className="flex flex-col gap-6">
        <GradedEssayUpdates essays={essays} currentBucketId={selectedBucketId ?? undefined} />

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
