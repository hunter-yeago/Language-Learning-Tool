interface User {
  id: number
  name: string
  email: string
}

interface TutorInvitation {
  id: number
  email: string
  token: string
  status: string
  expires_at: string
  tutor: User
}

interface TutorInvitationsProps {
  invitations: TutorInvitation[]
  onAccept: (token: string) => void
  onReject: (token: string) => void
}

export default function TutorInvitations({ invitations, onAccept, onReject }: TutorInvitationsProps) {
  if (!invitations || invitations.length === 0) {
    return null
  }

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tutor Invitations</h3>
      <ul className="space-y-3">
        {invitations.map((invitation) => (
          <li key={invitation.id} className="p-4 border border-blue-200 rounded-md bg-blue-50">
            <div className="mb-3">
              <p className="font-medium text-gray-900">{invitation.tutor.name} has invited you!</p>
              <p className="text-sm text-gray-600">{invitation.tutor.email}</p>
              <p className="text-xs text-gray-500 mt-1">Expires: {new Date(invitation.expires_at).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onAccept(invitation.token)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Accept
              </button>
              <button
                onClick={() => onReject(invitation.token)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
