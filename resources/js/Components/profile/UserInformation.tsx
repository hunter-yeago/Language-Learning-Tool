interface User {
  id: number
  name: string
  email: string
  roles?: Array<{ id: number; name: string }>
}

interface UserInformationProps {
  user: User
  userRoles: string[]
}

export default function UserInformation({ user, userRoles }: UserInformationProps) {
  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <p className="mt-1 text-sm text-gray-900">{user.name}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="mt-1 text-sm text-gray-900">{user.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <p className="mt-1 text-sm text-gray-900">{userRoles.join(', ')}</p>
        </div>
      </div>
    </div>
  )
}
