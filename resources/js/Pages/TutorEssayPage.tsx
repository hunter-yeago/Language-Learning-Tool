import WordBank from '@/Components/tutor-grade-essay/WordBank'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm } from '@inertiajs/react'
import Comments from '@/Components/tutor-grade-essay/Comments'
import StudentEssay from '@/Components/tutor-grade-essay/StudentEssay'
import GeneralFeedback from '@/Components/tutor-grade-essay/GeneralFeedback'
import StudentNotes from '@/Components/tutor-grade-essay/StudentNotes'
import { Essay } from '@/types/essay'
import { FormEventHandler, useState } from 'react'


export default function TutorEssayPage({ essay }: {essay: Essay}) {
  const { data, setData, post } = useForm({
    words: essay.words,
    essay_id: essay.id,
    feedback: '',
  })

  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault()

    const errors: string[] = []

    // Check if all words are graded
    const ungradedWords = data.words.filter(word => !word.pivot.grade || word.pivot.grade === 'not_used')
    if (ungradedWords.length > 0) {
      errors.push(`Please grade all words. ${ungradedWords.length} word(s) remaining: ${ungradedWords.map(w => w.word).join(', ')}`)
    }

    // Check if general feedback is provided
    if (!data.feedback || data.feedback.trim() === '') {
      errors.push('Please provide general feedback before submitting.')
    }

    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }

    setValidationErrors([])
    post(route('tutor.update-essay'))
  }

  // Create a working essay object that uses the form data
  const workingEssay = {
    ...essay,
    words: data.words
  }

  return (
    <AuthenticatedLayout header={<h1 className="text-2xl font-semibold text-gray-800">Student Essay Review</h1>}>
      <Head title="Student Essay Review" />
      <div className="flex flex-col gap-6 p-6 bg-white shadow-md rounded-lg">
        <StudentNotes essay={essay} />
        <WordBank essay={workingEssay} setData={setData} />
        <StudentEssay essay={workingEssay}/>
        <Comments essay={workingEssay} setData={setData} />
        <GeneralFeedback feedback={data.feedback} setData={setData} />

        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-300 rounded-lg p-4">
            <h3 className="text-red-800 font-semibold mb-2">Please fix the following errors:</h3>
            <ul className="list-disc list-inside text-red-700 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end mt-2">
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Submit
          </button>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
