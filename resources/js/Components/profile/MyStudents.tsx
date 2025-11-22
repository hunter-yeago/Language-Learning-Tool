interface User {
  id: number
  name: string
  email: string
}

interface MyStudentsProps {
  students: User[]
  onDisconnect: (studentId: number) => void
}

export default function MyStudents({ students, onDisconnect }: MyStudentsProps) {
  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">My Students</h3>
      {students.length > 0 ? (
        <ul className="space-y-3">
          {students.map((student) => (
            <li key={student.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-gray-50">
              <div>
                <p className="font-medium text-gray-900">{student.name}</p>
                <p className="text-sm text-gray-600">{student.email}</p>
              </div>
              <button
                onClick={() => onDisconnect(student.id)}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Disconnect
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 italic">No connected students yet.</p>
      )}
    </div>
  )
}
