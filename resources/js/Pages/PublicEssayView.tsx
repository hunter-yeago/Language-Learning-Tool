import { Head } from '@inertiajs/react'
import { Essay } from '@/types/essay'
import { useState } from 'react'
import axios from 'axios'

interface PublicEssayViewProps {
  essay: Essay
  visibility: {
    visibility_type: string
    allow_anonymous: boolean
    public_url_token: string
  }
  canReview: boolean
}

export default function PublicEssayView({ essay, visibility, canReview }: PublicEssayViewProps) {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [reviewerName, setReviewerName] = useState('')
  const [feedback, setFeedback] = useState('')
  const [wordGrades, setWordGrades] = useState<Record<number, { grade: string; comment: string }>>({})

  // Initialize all words with empty grades
  useState(() => {
    const initial: Record<number, { grade: string; comment: string }> = {}
    essay.words.forEach((word) => {
      initial[word.id] = { grade: '', comment: '' }
    })
    setWordGrades(initial)
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate at least one word is graded
    const hasGrades = Object.values(wordGrades).some((g) => g.grade !== '')
    if (!hasGrades) {
      alert('Please grade at least one word')
      return
    }

    if (!feedback.trim()) {
      alert('Please provide some overall feedback')
      return
    }

    setSubmitting(true)
    try {
      const word_grades = Object.entries(wordGrades)
        .filter(([_, data]) => data.grade !== '')
        .map(([wordId, data]) => ({
          word_id: parseInt(wordId),
          grade: data.grade,
          comment: data.comment || null,
        }))

      await axios.post(`/public/essay/${visibility.public_url_token}/review`, {
        reviewer_name: reviewerName || 'Anonymous Reviewer',
        feedback,
        word_grades,
      })

      setSubmitted(true)
      alert('Thank you! Your review has been submitted.')
    } catch (error: any) {
      alert('Error: ' + (error.response?.data?.message || 'Failed to submit review'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title={`Public Essay: ${essay.title}`} />

      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              Public Essay
            </span>
            <span className="text-sm text-gray-600">by {essay.user?.name || 'Language Learner'}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{essay.title}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Essay Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Essay Content</h2>
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{essay.content}</p>
          </div>
        </div>

        {/* Review Form */}
        {canReview && !submitted ? (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Leave Feedback</h2>
              <p className="text-sm text-gray-600 mb-4">
                Help this language learner by reviewing their word usage! Your feedback will be combined with other reviews.
              </p>
            </div>

            {/* Reviewer Name (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name (optional)
              </label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="Anonymous Reviewer"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank to stay anonymous</p>
            </div>

            {/* Word Grading */}
            <div>
              <h3 className="text-md font-semibold mb-3">Grade Each Word</h3>
              <div className="space-y-4">
                {essay.words.map((word) => (
                  <div key={word.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-semibold">{word.word}</span>
                      <select
                        value={wordGrades[word.id]?.grade || ''}
                        onChange={(e) =>
                          setWordGrades((prev) => ({
                            ...prev,
                            [word.id]: { ...prev[word.id], grade: e.target.value },
                          }))
                        }
                        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select grade</option>
                        <option value="correct">✓ Correct</option>
                        <option value="partially_correct">~ Partially Correct</option>
                        <option value="incorrect">✗ Incorrect</option>
                        <option value="not_used">Not Used</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      value={wordGrades[word.id]?.comment || ''}
                      onChange={(e) =>
                        setWordGrades((prev) => ({
                          ...prev,
                          [word.id]: { ...prev[word.id], comment: e.target.value },
                        }))
                      }
                      placeholder="Optional: Add a comment about this word usage"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Overall Feedback */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Feedback *
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                required
                placeholder="Provide general feedback about the essay..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        ) : submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <p className="text-green-900 font-medium mb-2">✓ Thank you for your review!</p>
            <p className="text-sm text-green-700">
              Your feedback has been submitted and will help this learner improve.
            </p>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <p className="text-gray-600">Anonymous reviews are not enabled for this essay.</p>
          </div>
        )}

        {/* Info Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>This is a publicly shared essay for language learning feedback.</p>
          <p className="mt-1">
            Powered by <span className="font-medium">Language Learning Tool</span>
          </p>
        </div>
      </div>
    </div>
  )
}
