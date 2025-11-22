import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router } from '@inertiajs/react'
import { Essay } from '@/types/essay'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { getGradeColor } from '@/Utilities/tutor_utils/grades'

interface ReviewSummary {
  summary: {
    essay_id: number
    total_reviews: number
    requires_student_review: boolean
    words: Array<{
      word_id: number
      word_text: string
      consensus_grade: string | null
      consensus_confidence: number | null
      review_count: number
      reviewer_grades: Array<{
        reviewer_name: string
        reviewer_type: string
        grade: string
        comment?: string
      }>
    }>
  }
  reviews: Array<{
    id: number
    reviewer_name: string
    reviewer_type: string
    status: string
    feedback: string
    completed_at: string
    word_grades: Array<{
      word_id: number
      word_text: string
      grade: string
      comment?: string
    }>
  }>
}

export default function ReviewApprovalPage({ essay }: { essay: Essay }) {
  const [reviewData, setReviewData] = useState<ReviewSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [approving, setApproving] = useState(false)
  const [selectedGrades, setSelectedGrades] = useState<Record<number, string>>({})

  useEffect(() => {
    loadReviewSummary()
  }, [])

  const loadReviewSummary = async () => {
    try {
      const response = await axios.get(`/essays/${essay.id}/review-summary`)
      setReviewData(response.data)

      // Pre-select consensus grades
      const initial: Record<number, string> = {}
      response.data.summary.words.forEach((word: any) => {
        initial[word.word_id] = word.consensus_grade
      })
      setSelectedGrades(initial)
    } catch (error) {
      console.error('Failed to load reviews:', error)
      alert('Failed to load review data')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!confirm('Approve these grades? This will update your word bucket.')) {
      return
    }

    setApproving(true)
    try {
      const approved_grades = Object.entries(selectedGrades).map(([wordId, grade]) => ({
        word_id: parseInt(wordId),
        grade: grade,
      }))

      await axios.post(`/essays/${essay.id}/approve-grades`, { approved_grades })
      alert('Grades approved! Your bucket has been updated.')
      router.get(route('student.view-essay'), { essay_id: essay.id, bucket_id: essay.bucket_id })
    } catch (error: any) {
      alert('Error: ' + (error.response?.data?.message || 'Failed to approve grades'))
    } finally {
      setApproving(false)
    }
  }

  if (loading) {
    return (
      <AuthenticatedLayout header={<h1>Loading Reviews...</h1>}>
        <div className="flex justify-center items-center p-12">
          <div className="text-gray-500">Loading review data...</div>
        </div>
      </AuthenticatedLayout>
    )
  }

  if (!reviewData) {
    return (
      <AuthenticatedLayout header={<h1>Error</h1>}>
        <div className="p-6">
          <p>Failed to load review data</p>
          <button onClick={() => router.get(route('/'))}>Back to Dashboard</button>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout header={<h1 className="text-2xl font-semibold">Review Multiple Feedback</h1>}>
      <Head title="Review Approval" />
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">{essay.title}</h2>
              <p className="text-gray-600">
                {reviewData.summary.total_reviews} {reviewData.summary.total_reviews === 1 ? 'reviewer' : 'reviewers'} provided feedback
              </p>
            </div>
            <button
              onClick={() => router.get(route('student.view-essay'), { essay_id: essay.id, bucket_id: essay.bucket_id })}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              ← Back to Essay
            </button>
          </div>
        </div>

        {/* Info Box */}
        {reviewData.summary.requires_student_review && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-900">
              Some grades have conflicting reviews. Please review each word and choose which grade to accept.
            </p>
          </div>
        )}

        {/* Word-by-Word Review */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Word Grades</h3>
            <p className="text-sm text-gray-600 mt-1">
              Click on a grade to select it. Consensus suggestions are pre-selected.
            </p>
          </div>

          <div className="divide-y">
            {reviewData.summary.words.map((word) => (
              <div key={word.word_id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold">{word.word_text}</h4>
                    <p className="text-sm text-gray-600">
                      Consensus: <span className="font-medium">{word.consensus_grade}</span> ({word.consensus_confidence}% confidence)
                    </p>
                  </div>
                </div>

                {/* Grade Options */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">All Reviews:</p>
                  {word.reviewer_grades.map((review: { reviewer_name: string; reviewer_type: string; grade: string; comment?: string }, idx: number) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedGrades(prev => ({ ...prev, [word.word_id]: review.grade }))}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                        selectedGrades[word.word_id] === review.grade
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(review.grade as any)}`}>
                            {review.grade}
                          </span>
                          <div>
                            <p className="text-sm font-medium">{review.reviewer_name}</p>
                            <p className="text-xs text-gray-500">{review.reviewer_type}</p>
                          </div>
                        </div>
                        {selectedGrades[word.word_id] === review.grade && (
                          <span className="text-blue-600">Selected</span>
                        )}
                      </div>
                      {review.comment && (
                        <p className="text-sm text-gray-700 mt-2 ml-2">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Reviews */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Complete Feedback from All Reviewers</h3>
          </div>
          <div className="divide-y">
            {reviewData.reviews.map((review) => (
              <div key={review.id} className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold">{review.reviewer_name}</p>
                    <p className="text-sm text-gray-500 capitalize">{review.reviewer_type} reviewer</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(review.completed_at).toLocaleDateString()}
                  </p>
                </div>
                {review.feedback && (
                  <div className="bg-gray-50 rounded p-4 mb-3">
                    <p className="text-sm text-gray-700">{review.feedback}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end sticky bottom-6 bg-white p-4 rounded-lg shadow-lg border">
          <button
            onClick={() => router.get(route('student.view-essay'), { essay_id: essay.id, bucket_id: essay.bucket_id })}
            className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleApprove}
            disabled={approving}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {approving ? 'Approving...' : `Approve ${Object.keys(selectedGrades).length} Grades`}
          </button>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
