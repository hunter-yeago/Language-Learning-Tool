import WordBank from '@/Components/tutor-grade-essay/WordBank'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm } from '@inertiajs/react'
import Comments from '@/Components/tutor-grade-essay/Comments'
import StudentEssay from '@/Components/tutor-grade-essay/StudentEssay'
import GeneralFeedback from '@/Components/tutor-grade-essay/GeneralFeedback'
import { TutorWord } from '@/types/tutor'
import { Essay } from '@/types/essay'
import { FormEventHandler } from 'react'

interface Props {
  essay: Essay
  words: TutorWord[]
}

export default function TutorEssayPage({ essay, words }: Props) {
  // console.log('essay', essay)
  // console.log('words', words)

  const { data, setData, post } = useForm({
    words: words,
    essay_id: essay.id,
    feedback: '',
  })

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault()

    post(route('tutor.update-essay'))
  } 

  // console.log('firing')

  return (
    <AuthenticatedLayout header={<h1 className="text-2xl font-semibold text-gray-800">Student Essay Review</h1>}>
      <Head title="Student Essay Review" />
      <div className="flex flex-col gap-6 p-6 bg-white shadow-md rounded-lg">
        <WordBank essay={essay} setData={setData} words={data.words} />
        <StudentEssay essay={essay} data={data.words} words={words} />
        <Comments words={words} essay={essay} data={data.words} setData={setData} />
        <GeneralFeedback setData={setData} data={data} />

        <div className="flex justify-end mt-2">
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Submit
          </button>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
