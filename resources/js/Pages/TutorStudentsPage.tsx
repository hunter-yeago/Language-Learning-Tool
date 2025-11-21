import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, usePage } from '@inertiajs/react'
import StudentOverviewCard from '@/Components/tutor/StudentOverviewCard'
import { Bucket } from '@/types/bucket'
import { TutorWord } from '@/types/tutor'

interface Student {
  id: number
  name: string
  email: string
  buckets: Bucket<TutorWord>[]
  total_essays: number
  graded_essays: number
}

interface Props {
  students: Student[]
  student_id?: number
}

export default function TutorStudentsPage({ students, student_id }: Props) {
  const expandedStudentId = student_id ? Number(student_id) : null
  return (
    <AuthenticatedLayout header={<h1 className="text-2xl font-semibold text-gray-800">My Students</h1>}>
      <Head title="My Students" />

      <div className="py-6">
        {students.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                You have <span className="font-semibold">{students.length}</span> student
                {students.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="space-y-4">
              {students.map((student) => (
                <StudentOverviewCard
                  key={student.id}
                  student={student}
                  initialExpanded={expandedStudentId === student.id}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <div className="max-w-md mx-auto">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Yet</h3>
              <p className="text-gray-600">
                You don't have any students assigned to you yet. Students will appear here once they submit essays
                for grading.
              </p>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}
