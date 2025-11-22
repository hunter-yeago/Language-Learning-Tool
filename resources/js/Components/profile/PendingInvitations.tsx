interface TutorInvitation {
  id: number
  email: string
  token: string
  status: string
  expires_at: string
}

interface PendingInvitationsProps {
  invitations: TutorInvitation[]
  onCancel: (id: number) => void
}

export default function PendingInvitations({ invitations, onCancel }: PendingInvitationsProps) {
  if (!invitations || invitations.length === 0) {
    return null
  }

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Invitations</h3>
      <ul className="space-y-3">
        {invitations.map((invitation) => (
          <li key={invitation.id} className="flex items-center justify-between p-3 border border-yellow-200 rounded-md bg-yellow-50">
            <div>
              <p className="font-medium text-gray-900">{invitation.email}</p>
              <p className="text-xs text-gray-600">Expires: {new Date(invitation.expires_at).toLocaleDateString()}</p>
            </div>
            <button
              onClick={() => onCancel(invitation.id)}
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
