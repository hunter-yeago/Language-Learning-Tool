import { FormEventHandler } from 'react'

interface InviteStudentProps {
  email: string
  onEmailChange: (email: string) => void
  onSubmit: FormEventHandler
  processing: boolean
  errors: {
    email?: string
  }
}

export default function InviteStudent({ email, onEmailChange, onSubmit, processing, errors }: InviteStudentProps) {
  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Invite Student</h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Student Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="student@example.com"
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Enter the email address of an existing student user to send them an invitation.
          </p>
        </div>
        <button
          type="submit"
          disabled={processing}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {processing ? 'Sending...' : 'Send Invitation'}
        </button>
      </form>
    </div>
  )
}
