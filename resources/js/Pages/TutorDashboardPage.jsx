import ActionButton from '@/Components/dashboard/ActionButton'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router } from '@inertiajs/react'

export default function TutorDashboardPage({ essays }) {
  function handleClick(essay) {
    router.post('tutor-essay-page', { essay: essay })
  }

  return (
    <AuthenticatedLayout header={<h1 className="text-2xl font-semibold text-gray-800">Tutor Dashboard</h1>}>
      <Head title="Tutor Review" />

      <section className="flex flex-col gap-3">
        <article className="border p-6 min-h-full bg-white shadow-md rounded-lg flex flex-col gap-6">
          <h2 className="text-xl font-bold text-gray-800">User Essays</h2>

          {essays.length ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {essays.map((essay) => (
                <li key={essay.id} className="border p-4 rounded bg-gray-50 shadow-sm">
                  <h3 className="font-semibold mb-1">{essay.title}</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{essay.content}</p>
                  <p className="text-xs text-gray-400 mt-2">Submitted: {new Date(essay.created_at).toLocaleString()}</p>
                  <ActionButton onClick={() => handleClick(essay)} color="blue" text="Review Essay" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No essays submitted by this user.</p>
          )}
        </article>
      </section>
    </AuthenticatedLayout>
  )
}
