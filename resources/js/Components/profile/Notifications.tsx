interface Notification {
  id: string
  type: string
  data: {
    message: string
    student_id?: number
    student_name?: string
    student_email?: string
    tutor_id?: number
    tutor_name?: string
  }
  read_at: string | null
  created_at: string
}

interface NotificationsProps {
  notifications: Notification[]
  onDismiss: (notificationId: string) => void
}

export default function Notifications({ notifications, onDismiss }: NotificationsProps) {
  if (!notifications || notifications.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <div key={notification.id} className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-900">{notification.data.message}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(notification.created_at).toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => onDismiss(notification.id)}
            className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Dismiss notification"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
