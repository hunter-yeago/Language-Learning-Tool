import { useState } from 'react'
import GeneralFeedback from '@/Components/tutor-essay-page/GeneralFeedback'
import WordBank from '@/Components/tutor-essay-page/WordBank'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm } from '@inertiajs/react'
import Comments from '@/Components/tutor-essay-page/Comments'
import StudentEssay from '@/Components/tutor-essay-page/StudentEssay'

export default function TutorEssayPage({ essay, words }) {
  const { data, setData, post, processing } = useForm({
    words,
  })

  function handleSubmit(e) {
    e.preventDefault()
    post(route('update-bucket-and-essay'), {
      words: data.words,
    })
  }

  return (
    <AuthenticatedLayout header={<h1 className="text-2xl font-semibold text-gray-800">Student Essay Review</h1>}>
      <Head title="Student Essay Review" />
      <div className="flex flex-col gap-6 p-6 bg-white shadow-md rounded-lg">
        <WordBank essay={essay} setData={setData} data={data.words} />
        <StudentEssay essay={essay} data={data.words} />
        <Comments essay={essay} data={data.words} setData={setData} />
        <GeneralFeedback />

        <div className="flex justify-end mt-2">
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Submit
          </button>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
