import { useState } from 'react'
import { useForm } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

export default function TutorDashboardPage() {
  const { data, setData, post, processing } = useForm({
    tutor: {
      id: null,
      name: '',
    },
  })

  const [tutor, setTutor] = useState(null)

  // Example function to simulate setting tutor info and submitting it
  const handleSetTutor = () => {
    // Simulate setting tutor data
    const tutorData = { id: 1, name: 'John Doe' }
    setData('tutor', tutorData)
    setTutor(tutorData)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    post(route('submit-tutor-info'), { data: tutor })
  }

  return (
    <AuthenticatedLayout header={<h1 className="text-2xl font-semibold text-gray-800">Tutor Dashboard</h1>}>
      <section className="p-6 bg-white shadow-md rounded-lg">
        <button onClick={handleSetTutor} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
          Set Tutor Information
        </button>

        {tutor && (
          <div className="mt-4">
            <h2 className="font-semibold text-gray-700">Tutor Information</h2>
            <p>Name: {tutor.name}</p>
            <button onClick={handleSubmit} className="mt-2 px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600" disabled={processing}>
              Submit Tutor Info
            </button>
          </div>
        )}
      </section>
    </AuthenticatedLayout>
  )
}
