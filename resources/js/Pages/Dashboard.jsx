import { useEffect, useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import ExistingWordBuckets from '@/Components/dashboard/ExistingWordBuckets'
import { Head, useForm } from '@inertiajs/react'
import CreateBucketForm from '@/Components/dashboard/CreateBucketForm'
import ActionButton from '@/Components/dashboard/ActionButton'
import { getGradeBackgroundColor, gradeConfig } from '@/Utilities/tutor_utils/grades'
import Instructions from '@/Components/dashboard/Instructions'
import GradeProgressBar from './GradeProgressBar'

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
  const [gradeFilter, setGradeFilter] = useState('')
  const [sortOption, setSortOption] = useState('grade-desc')

  // Get all grade keys (correct, partially_correct, etc.)
  const gradeKeys = Object.keys(gradeConfig)

  // Function to sort by created_at (newest to oldest)
  const sortByCreatedAtNewest = (a, b) => new Date(b.created_at) - new Date(a.created_at)

  // Function to sort by created_at (oldest to newest)
  const sortByCreatedAtOldest = (a, b) => new Date(a.created_at) - new Date(b.created_at)

  // Function to sort by grade
  const sortByGrade = (a, b, reverse = false) => {
    const aGradeIndex = gradeKeys.indexOf(a.pivot.grade)
    const bGradeIndex = gradeKeys.indexOf(b.pivot.grade)
    const comparison = aGradeIndex - bGradeIndex

    return reverse ? -comparison : comparison // Reverse the comparison if needed
  }

  // Sort words based on the selected option
  const sortedWords = currentBucket?.words
    ?.filter((word) => word.word.toLowerCase().includes(search.toLowerCase()))
    ?.filter((word) => {
      if (!gradeFilter) return true
      return word.pivot.grade === gradeFilter
    })
    ?.sort((a, b) => {
      switch (sortOption) {
        case 'grade-asc':
          return sortByGrade(a, b, true) // Ascending order
        case 'grade-desc':
          return sortByGrade(a, b, false) // Descending order
        case 'created-newest':
          return sortByCreatedAtNewest(a, b)
        case 'created-oldest':
          return sortByCreatedAtOldest(a, b)
        default:
          return 0
      }
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

  // Filter essays to only show those associated with the current bucket
  const filteredEssays = essays.filter((essay) => essay.bucket_id === currentBucket?.id)

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

  console.log('the current bucket', currentBucket)

  return (
    <AuthenticatedLayout header={<h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>}>
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
              <h2 className="w-fit text-xl font-bold text-gray-800">{currentBucket.title}</h2>
              <GradeProgressBar words={currentBucket.words} />

              <div className="flex gap-2">
                <ActionButton onClick={handleAddWords} processing={processing} color="green" text="Add Words" />
                <ActionButton onClick={handleWriteEssayPage} processing={processing} color="blue" text="Write Essay" />
              </div>
            </div>

            {/* Word Filters */}
            <section className="space-y-2">
              <h3 className="font-semibold text-gray-700">Words in this Bucket</h3>
              <Instructions />
              <div className="flex items-center gap-4">
                {/* Text Word Filter */}
                <input
                  type="text"
                  placeholder="Search words..."
                  className="border px-3 py-1 rounded w-full max-w-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select className="border px-3 py-1 rounded w-full max-w-sm" name="grades" id="grades" onChange={(e) => setGradeFilter(e.target.value)}>
                  <option value="">All</option>
                  <option value="correct">Correct</option>
                  <option value="partially_correct">Partially Correct</option>
                  <option value="incorrect">Incorrect</option>
                  <option value="used_in_essay">Waiting for Grade</option>
                  <option value="not_attempted">Unused</option>
                </select>

                <select className="border px-3 py-1 rounded w-full max-w-sm" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                  <option value="grade-desc">Grade</option>
                  <option value="grade-asc">Grade (Reverse)</option>
                  <option value="created-newest">Newest First</option>
                  <option value="created-oldest">Oldest First</option>
                </select>
              </div>

              {sortedWords.length ? (
                <>
                  <ul className="border p-2 grid grid-cols-2 md:grid-cols-4 gap-3 text-gray-800 mt-4">
                    {sortedWords.slice(0, visibleCount).map((word) => (
                      <li
                        key={word.id}
                        className={`border rounded px-3 py-2 text-center ${word.pivot.grade}
                            ${getGradeBackgroundColor(word.pivot.grade)}`}
                      >
                        {word.word}
                      </li>
                    ))}
                  </ul>

                  {sortedWords.length > visibleCount && (
                    <button onClick={() => setVisibleCount(visibleCount + 30)} className="mt-4 px-4 py-2 text-sm bg-blue-100 rounded hover:bg-blue-200">
                      Load More
                    </button>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-500 italic">No matching words found.</p>
              )}
            </section>

            {/* Essay List */}
            <section className="">
              <h3 className="font-semibold text-gray-700 mb-2">Essays</h3>
              {filteredEssays.length ? (
                <ul className="grid grid-cols-2 gap-3">
                  {filteredEssays.map((essay) => (
                    <li key={essay.id} className="border p-3 rounded bg-gray-50">
                      <div className="font-medium">{essay.title}</div>
                      <p className="text-sm text-gray-600 line-clamp-2">{essay.content}</p>
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
