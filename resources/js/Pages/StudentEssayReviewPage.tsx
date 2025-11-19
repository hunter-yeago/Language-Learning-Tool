import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router } from '@inertiajs/react'
import { Essay } from '@/types/essay'
import { getGradeColor } from '@/Utilities/tutor_utils/grades'
import { buildHighlightedSegments, filterOverlappingMatches, getMatchingWordPositions } from '@/Utilities/tutor_utils/tutor'

export default function StudentEssayReviewPage({ essay, bucket_id }: { essay: Essay; bucket_id?: number }) {
  const words = essay.words

  function highlightWordButtons(text: string) {
    if (!text || !words?.length) return <p>{text}</p>

    const matches = getMatchingWordPositions(text, words)
    const filtered = filterOverlappingMatches(matches)
    const segments = buildHighlightedSegments(text, filtered)

    return (
      <div className="whitespace-pre-wrap text-gray-700">
        {segments.map((segment, index) => {
          if (segment.type === 'text') return <span key={index}>{segment.content}</span>

          const word = words.find((w) => w.id === segment.wordId)
          if (!word) return null

          return (
            <span
              key={`${segment.wordId}-${index}`}
              className={`px-2 py-1 rounded-full border ${word.pivot.grade ? getGradeColor(word.pivot.grade) : 'border-gray-300'}`}
            >
              {segment.content}
            </span>
          )
        })}
      </div>
    )
  }

  return (
    <AuthenticatedLayout header={<h1 className="text-2xl font-semibold text-gray-800">Essay Review</h1>}>
      <Head title="Essay Review" />
      <div className="flex flex-col gap-6 p-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.get(route('/'), { bucketID: bucket_id })}
          className="self-start px-4 py-2 text-sm text-primary-700 hover:text-primary-900 transition"
        >
          ← Back to Dashboard
        </button>

        {/* Essay Content */}
        <section className="w-full border rounded-lg p-6 bg-gray-50">
          <h2 className="text-2xl font-semibold mb-4 text-neutral-900">{essay.title}</h2>
          {highlightWordButtons(essay.content)}
        </section>

        {/* Word Comments */}
        {words.some((word) => word.pivot.comment) && (
          <section className="w-full border rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold mb-4 text-neutral-900">Word Feedback</h3>
            <ul className="space-y-3">
              {words
                .filter((word) => word.pivot.comment)
                .map((word) => (
                  <li key={word.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                    <span className={`px-2 py-1 rounded-full border text-sm font-medium ${word.pivot.grade ? getGradeColor(word.pivot.grade) : 'border-gray-300'}`}>
                      {word.word}
                    </span>
                    <p className="text-sm text-gray-700 flex-1">{word.pivot.comment}</p>
                  </li>
                ))}
            </ul>
          </section>
        )}

        {/* General Feedback */}
        {essay.feedback && (
          <section className="w-full border rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold mb-4 text-neutral-900">General Feedback</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{essay.feedback}</p>
          </section>
        )}
      </div>
    </AuthenticatedLayout>
  )
}
