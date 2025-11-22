import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router } from '@inertiajs/react'
import { Essay } from '@/types/essay'
import { getGradeColor } from '@/Utilities/tutor_utils/grades'
import { buildHighlightedSegments, filterOverlappingMatches, getMatchingWordPositions } from '@/Utilities/tutor_utils/tutor'
import { useState } from 'react'
import axios from 'axios'

export default function StudentEssayReviewPage({ essay, bucket_id }: { essay: Essay; bucket_id?: number }) {
  const words = essay.words
  const [publicUrl, setPublicUrl] = useState<string | null>(null)
  const [isPublic, setIsPublic] = useState(false)
  const [loading, setLoading] = useState(false)

  const makePublic = async () => {
    console.log('Essay object:', essay)
    console.log('Essay ID:', essay?.id)

    if (!essay?.id) {
      alert('Error: Essay ID not found')
      return
    }

    if (confirm('Make this essay publicly accessible? Anyone with the link can view and review it.')) {
      setLoading(true)
      try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        const url = `/essays/${essay.id}/visibility`
        console.log('Posting to:', url)

        const response = await axios.post(url, {
          visibility_type: 'public',
          allow_anonymous: true,
          expires_in_days: 30,
        }, {
          headers: {
            'X-CSRF-TOKEN': csrfToken || '',
          }
        })
        setPublicUrl(response.data.public_url)
        setIsPublic(true)
        alert('Essay is now public! Link copied to clipboard.')
        navigator.clipboard.writeText(response.data.public_url)
      } catch (error: any) {
        console.error('Make public error:', error)
        console.error('Error response:', error.response)
        alert('Error: ' + (error.response?.data?.message || error.message || 'Failed to make public'))
      } finally {
        setLoading(false)
      }
    }
  }

  const makePrivate = async () => {
    if (confirm('Make this essay private again?')) {
      setLoading(true)
      try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        await axios.post(`/essays/${essay.id}/visibility`, {
          visibility_type: 'private',
        }, {
          headers: {
            'X-CSRF-TOKEN': csrfToken || '',
          }
        })
        setIsPublic(false)
        setPublicUrl(null)
        alert('Essay is now private')
      } catch (error: any) {
        console.error('Make private error:', error)
        alert('Error: ' + (error.response?.data?.message || error.message || 'Failed to make private'))
      } finally {
        setLoading(false)
      }
    }
  }

  const viewReviews = () => {
    router.get(route('student.essays.approve-page', { essayId: essay.id }))
  }

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
        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <button
            onClick={() => router.get(route('/'), { bucketID: bucket_id })}
            className="px-4 py-2 text-sm text-primary-700 hover:text-primary-900 transition"
          >
            ← Back to Dashboard
          </button>

          <div className="flex gap-2">
            {!isPublic ? (
              <button
                onClick={makePublic}
                disabled={loading}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Share Publicly'}
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(publicUrl!)
                    alert('Link copied!')
                  }}
                  className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  Copy Public Link
                </button>
                <button
                  onClick={makePrivate}
                  disabled={loading}
                  className="px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Make Private'}
                </button>
              </>
            )}

            {/* View all reviews button - always available for any essay */}
            <button
              onClick={viewReviews}
              className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
            >
              View All Reviews
            </button>
          </div>
        </div>

        {/* Public URL Display */}
        {publicUrl && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-900 font-medium mb-2">✓ Essay is public!</p>
            <p className="text-xs text-blue-700">
              Share this link on Reddit, Discord, or anywhere to get feedback from native speakers:
            </p>
            <code className="block mt-2 p-2 bg-white border border-blue-300 rounded text-xs break-all">
              {publicUrl}
            </code>
            <p className="text-xs text-blue-600 mt-2">Link expires in 30 days</p>
          </div>
        )}

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
