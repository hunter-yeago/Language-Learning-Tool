import { useEffect, useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm } from '@inertiajs/react'
import ExistingWordBuckets from '@/Components/dashboard/ExistingWordBuckets'
import BucketDisplay from '@/Components/dashboard/BucketDisplay'
import CreateBucketForm from '@/Components/dashboard/CreateBucketForm'
import ActionButton from '@/Components/dashboard/ActionButton'

export default function Dashboard({ essays, buckets, bucketID }) {
  const { data, setData, post, processing } = useForm({
    bucket: {
      id: null,
      title: '',
      description: '',
      words: [],
    },
    essay: {
      title: '',
      content: '',
      words: [],
    },
  })

  const [currentBucket, setCurrentBucket] = useState(null)

  const [visibleCount, setVisibleCount] = useState(30)
  const [search, setSearch] = useState('')
  const [notUsed, setNotUsed] = useState(false)
  const [onlyUsed, setOnlyUsed] = useState(false)

  const filteredWords = currentBucket?.words
    ?.filter((word) => word.word.toLowerCase().includes(search.toLowerCase()))
    ?.filter((word) => {
      if (notUsed)
        return (
          word.pivot.grade === ('attempted_but_not_used' || 'not_attempted')
        )
      if (onlyUsed) return word.pivot.grade === 'used_in_essay'
      return true
    })

  // Set the bucket when the component mounts
  useEffect(() => {
    const previousBucket = buckets.find((b) => b.id === parseInt(bucketID))
    if (bucketID && previousBucket) {
      setCurrentBucket(previousBucket)
      setData('bucket', {
        id: previousBucket.id,
        title: previousBucket.title,
        description: previousBucket.description,
        words: previousBucket.words,
      })
    }
  }, [bucketID, buckets])

  function handleWriteEssayPage(e) {
    e.preventDefault()
    if (data.bucket) {
      post(route('write-essay'), {
        bucket: data.bucket,
        bucketID: data.bucket.id,
      })
    }
  }

  function handleAddWords(e) {
    e.preventDefault()
    if (data.bucket.id) {
      post(route('add-words-page'), {
        bucket_id: data.bucket.id,
        words: data.bucket.words,
      })
    }
  }

  console.log('the current buce', currentBucket)

  return (
    <AuthenticatedLayout
      header={
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
      }
    >
      <Head title="Dashboard" />

      <article className="border p-6 min-h-full bg-white shadow-md rounded-lg flex flex-col gap-10">
        <ExistingWordBuckets
          buckets={buckets}
          currentBucketId={currentBucket?.id}
          setCurrentBucket={setCurrentBucket}
          data={data}
          post={post}
          setData={setData}
          processing={processing}
        />
      </article>

      <article className="border p-6 min-h-full bg-white shadow-md rounded-lg flex flex-col gap-6">
        {currentBucket ? (
          <>
            <div className="flex justify-between gap-4">
              <h2 className="w-fit text-xl font-bold text-gray-800">
                {currentBucket.title}
              </h2>

              <div className="flex gap-2">
                <ActionButton
                  onClick={handleAddWords}
                  processing={processing}
                  color="green"
                  text="Add Words"
                />

                <ActionButton
                  onClick={handleWriteEssayPage}
                  processing={processing}
                  color="blue"
                  text="Write Essay"
                />
              </div>
            </div>

            {/* Word Filters */}
            <section className="space-y-2">
              <h3 className="font-semibold text-gray-700">
                Words in this Bucket
              </h3>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  placeholder="Search words..."
                  className="border px-3 py-1 rounded w-full max-w-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={notUsed}
                    onChange={() => {
                      setNotUsed(!notUsed)
                      setOnlyUsed(false)
                    }}
                  />
                  Only unused
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={onlyUsed}
                    onChange={() => {
                      setOnlyUsed(!onlyUsed)
                      setNotUsed(false) // turn off the other
                    }}
                  />
                  Only used
                </label>
              </div>

              {filteredWords.length ? (
                <>
                  <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 text-gray-800 mt-4">
                    {filteredWords.slice(0, visibleCount).map((word) => (
                      <li
                        key={word.id}
                        className="border rounded px-3 py-2 bg-gray-50"
                      >
                        {word.word}
                      </li>
                    ))}
                  </ul>

                  {filteredWords.length > visibleCount && (
                    <button
                      onClick={() => setVisibleCount(visibleCount + 30)}
                      className="mt-4 px-4 py-2 text-sm bg-blue-100 rounded hover:bg-blue-200"
                    >
                      Load More
                    </button>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No matching words found.
                </p>
              )}
            </section>

            {/* Essay List */}
            <section>
              <h3 className="font-semibold text-gray-700 mb-2">
                Essays Using This Bucket
              </h3>
              {essays.length ? (
                <ul className="space-y-3">
                  {essays.map((essay) => (
                    <li
                      key={essay.id}
                      className="border p-3 rounded bg-gray-50"
                    >
                      <div className="font-medium">{essay.title}</div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {essay.content}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">No essays yet.</p>
              )}
            </section>
          </>
        ) : (
          <CreateBucketForm
            bucketData={data.bucket}
            setData={setData}
            post={post}
            data={data}
            onCancel={() => setCurrentBucket(null)}
            processing={processing}
          />
        )}
      </article>
    </AuthenticatedLayout>
  )
}
