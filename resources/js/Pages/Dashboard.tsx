import { useEffect, useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import ExistingWordBuckets from '@/Components/dashboard/ExistingWordBuckets'
import { Head, useForm, router } from '@inertiajs/react'
import CreateBucketForm from '@/Components/dashboard/CreateBucketForm'
import ActionButton from '@/Components/dashboard/ActionButton'
import { getGradeBackgroundColor, gradeConfig } from '@/Utilities/tutor_utils/grades'
import Instructions from '@/Components/dashboard/Instructions'
import GradeProgressBar from './GradeProgressBar'
import { Bucket, BucketData } from '@/types/bucket'
import { TutorWord } from '@/types/tutor'
import { Word } from '@/types/word'
import { Essay } from '@/types/essay'
import { voidFunction } from '@/types/types'

// Extend Bucket type to include TutorWord compatibility
interface BucketWithTutorWords extends Omit<Bucket, 'words'> {
  words: TutorWord[]
}

interface Props {
  essays: Essay[]
  buckets: BucketWithTutorWords[]
  bucketID?: string | number
}

interface FormData {
  bucket: BucketData
  essay: {
    title: string
    content: string
    words: Word[]
  }
}

export default function Dashboard({ essays, buckets, bucketID }: Props) {
  const { data, setData, post, processing } = useForm<FormData>({
    bucket: {
      id: undefined,
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

  const [currentBucket, setCurrentBucket] = useState<BucketWithTutorWords | null>(null)
  const [visibleCount, setVisibleCount] = useState(30)
  const [search, setSearch] = useState('')
  const [gradeFilter, setGradeFilter] = useState('')
  const [sortOption, setSortOption] = useState('created-newest')

  // Function to sort by created_at (newest to oldest)
  const sortByCreatedAtNewest = (a: TutorWord, b: TutorWord) => {
    const aTime = a.created_at ? new Date(a.created_at).getTime() : 0
    const bTime = b.created_at ? new Date(b.created_at).getTime() : 0
    return bTime - aTime
  }

  // Function to sort by created_at (oldest to newest)
  const sortByCreatedAtOldest = (a: TutorWord, b: TutorWord) => {
    const aTime = a.created_at ? new Date(a.created_at).getTime() : 0
    const bTime = b.created_at ? new Date(b.created_at).getTime() : 0
    return aTime - bTime
  }

  // Function to sort by grade
  const sortByGrade = (a: TutorWord, b: TutorWord, reverse = false) => {
    const aGradeIndex = Object.keys(gradeConfig).indexOf(a.pivot.grade ?? 'not_graded')
    const bGradeIndex = Object.keys(gradeConfig).indexOf(b.pivot.grade ?? 'not_graded')
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
        case 'grade-ascending':
          return sortByGrade(a, b, true)
        case 'grade-descending':
          return sortByGrade(a, b, false)
        case 'created-newest':
          return sortByCreatedAtNewest(a, b)
        case 'created-oldest':
          return sortByCreatedAtOldest(a, b)
        default:
          return 0
      }
    }) ?? []

  // Set the bucket when the component mounts
  useEffect(() => {
    if (bucketID) {
      const bucketIdNum = typeof bucketID === 'string' ? parseInt(bucketID, 10) : bucketID
      const previousBucket = buckets.find((b) => b.id === bucketIdNum)
      if (previousBucket) {
        setCurrentBucket(previousBucket)
        setData('bucket', {
          id: previousBucket.id,
          title: previousBucket.title,
          description: previousBucket.description,
          words: previousBucket.words,
        })
      }
    }
  }, [bucketID, buckets])

  // Filter essays to only show those associated with the current bucket
  const filteredEssays = essays.filter((essay) => essay.bucket_id === currentBucket?.id)

  const handleWriteEssayPage: voidFunction = () => {
    if (data.bucket.id) {
      router.visit(route('student.write-essay'), {
        method: 'post',
        data: {
          bucket: data.bucket as any,
          bucketID: data.bucket.id,
        }
      })
    }
  }

  

  const handleAddWords: voidFunction = () => {
    if (data.bucket.id) {
      router.visit(route('student.add-words-page'), {
        method: 'post',
        data: {
          bucket_id: data.bucket.id,
          words: data.bucket.words as any,
        }
      })
    }
  }


  return (
    <AuthenticatedLayout header={<h1 className="text-3xl font-semibold text-neutral-900">Student Dashboard</h1>}>
      <Head title="Dashboard" />

      <section className="flex flex-col gap-6">
        <article className="border border-neutral-200 p-8 bg-white shadow-sm rounded-lg flex flex-col gap-10">
          <ExistingWordBuckets
            buckets={buckets as unknown as Bucket[]}
            currentBucketId={currentBucket?.id ?? null}
            setCurrentBucket={setCurrentBucket as (bucket: Bucket | null) => void}
            data={data}
            post={post}
            setData={setData}
            processing={processing}
          />
        </article>

        <article className="border border-neutral-200 p-8 bg-white shadow-sm rounded-lg flex flex-col gap-6">
          {currentBucket ? (
            <>
              <div className="flex items-center justify-between gap-4">
                <h2 className="w-fit text-2xl font-semibold text-neutral-900">{currentBucket.title}</h2>
                <GradeProgressBar words={currentBucket.words} />

                <div className="flex gap-2">
                  <ActionButton onClick={handleAddWords} processing={processing} color="green" text="Add Words" />
                  <ActionButton onClick={handleWriteEssayPage} processing={processing} color="blue" text="Write Essay" />
                </div>
              </div>

              {/* Word Filters */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold text-neutral-900">Vocabulary Words</h3>
                <Instructions />
                <div className="flex items-center gap-4">
                  {/* Text Word Filter */}
                  <input
                    type="text"
                    placeholder="Search words..."
                    className="border border-neutral-300 px-4 py-2.5 rounded-md w-full max-w-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <select className="border border-neutral-300 px-4 py-2.5 rounded-md w-full max-w-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition" name="grades" id="grades" onChange={(e) => setGradeFilter(e.target.value)}>
                    <option value="">All Grades</option>
                    <option value="correct">Correct</option>
                    <option value="partially_correct">Partially Correct</option>
                    <option value="incorrect">Incorrect</option>
                    <option value="used_in_essay">Waiting for Grade</option>
                    <option value="not_graded">Unused</option>
                  </select>

                  <select className="border border-neutral-300 px-4 py-2.5 rounded-md w-full max-w-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                    <option value="created-newest">Newest</option>
                    <option value="created-oldest">Oldest</option>
                    {gradeFilter === '' && (
                      <>
                        <option value="grade-descending">Grade</option>
                        <option value="grade-ascending">Grade (Reverse)</option>
                      </>
                    )}
                  </select>
                </div>

                {sortedWords.length ? (
                  <>
                    <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                      {sortedWords.slice(0, visibleCount).map((word) => (
                        <li
                          key={word.id}
                          className={`border border-neutral-200 rounded-md px-4 py-3 text-center font-medium transition hover:shadow-sm
                              ${getGradeBackgroundColor(word.pivot.grade)}`}
                        >
                          {word.word}
                        </li>
                      ))}
                    </ul>

                    {sortedWords.length > visibleCount && (
                      <button onClick={() => setVisibleCount(visibleCount + 30)} className="mt-4 px-5 py-2.5 text-sm bg-primary-50 text-primary-700 rounded-md hover:bg-primary-100 border border-primary-200 transition font-medium">
                        Load More Words
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-neutral-500 italic">No matching words found.</p>
                )}
              </section>

              {/* Essay List */}
              <section className="pt-6 border-t border-neutral-200">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Essays</h3>
                {filteredEssays.length ? (
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredEssays.map((essay) => (
                      <li key={essay.id} className="border border-neutral-200 p-4 rounded-md bg-neutral-50 hover:shadow-sm transition">
                        <div className="font-semibold text-neutral-900 mb-1">{essay.title}</div>
                        <p className="text-sm text-neutral-600 line-clamp-2">{essay.content}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-neutral-500 italic">No essays yet.</p>
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
      </section>
    </AuthenticatedLayout>
  )
}
