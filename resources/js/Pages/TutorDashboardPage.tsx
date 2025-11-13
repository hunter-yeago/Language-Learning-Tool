import ActionButton from '@/Components/dashboard/ActionButton'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router } from '@inertiajs/react'
import { Essay } from '@/types/essay'

interface Props {
  essays: Essay[]
}

export default function TutorDashboardPage({ essays }: Props) {
  function handleClick(essay: Essay) {
    router.get('/grade-essay', { essay_id: essay.id })
  }

  return (
    <AuthenticatedLayout header={<h1 className="text-3xl font-semibold text-neutral-900">Tutor Dashboard</h1>}>
      <Head title="Tutor Review" />

      <section className="flex flex-col gap-6">
        <article className="border border-neutral-200 p-8 bg-white shadow-sm rounded-lg flex flex-col gap-6">
          <h2 className="text-2xl font-semibold text-neutral-900">Submitted Essays</h2>

          {essays.length ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {essays.map((essay) => (
                <li key={essay.id} className="border border-neutral-200 p-6 rounded-lg bg-white hover:shadow-md transition">
                  <h3 className="font-semibold text-lg text-neutral-900 mb-2">{essay.title}</h3>
                  <p className="text-sm text-neutral-600 whitespace-pre-wrap line-clamp-3 mb-3">{essay.content}</p>
                  <p className="text-xs text-neutral-500 mb-4">Submitted: {new Date(essay.created_at).toLocaleString()}</p>
                  <ActionButton onClick={() => handleClick(essay)} processing={false} color="blue" text="Review Essay" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-500 italic">No essays awaiting review.</p>
          )}
        </article>
      </section>
    </AuthenticatedLayout>
  )
}
