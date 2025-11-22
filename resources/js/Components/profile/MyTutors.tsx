interface User {
  id: number
  name: string
  email: string
}

interface MyTutorsProps {
  tutors: User[]
}

export default function MyTutors({ tutors }: MyTutorsProps) {
  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">My Tutors</h3>
      {tutors.length > 0 ? (
        <ul className="space-y-3">
          {tutors.map((tutor) => (
            <li key={tutor.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-gray-50">
              <div>
                <p className="font-medium text-gray-900">{tutor.name}</p>
                <p className="text-sm text-gray-600">{tutor.email}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 italic">No connected tutors yet. Check pending invitations below.</p>
      )}
    </div>
  )
}
