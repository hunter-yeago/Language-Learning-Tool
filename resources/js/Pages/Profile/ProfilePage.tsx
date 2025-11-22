import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm, usePage } from '@inertiajs/react'
import { FormEventHandler } from 'react'
import { PageProps } from '@/types'
import UserInformation from '@/Components/profile/UserInformation'
import Notifications from '@/Components/profile/Notifications'
import PendingInvitations from '@/Components/profile/PendingInvitations'
import InviteStudent from '@/Components/profile/InviteStudent'
import MyStudents from '@/Components/profile/MyStudents'
import MyTutors from '@/Components/profile/MyTutors'
import TutorInvitations from '@/Components/profile/TutorInvitations'

interface User {
  id: number
  name: string
  email: string
  roles?: Array<{ id: number; name: string }>
}

interface TutorInvitation {
  id: number
  email: string
  token: string
  status: string
  expires_at: string
  tutor: User
}

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

interface ProfilePageProps extends PageProps {
  students?: User[]
  tutors?: User[]
  pendingInvitations?: TutorInvitation[]
  notifications?: Notification[]
}

export default function ProfilePage({ students, tutors, pendingInvitations, notifications }: ProfilePageProps) {
  const { auth } = usePage<PageProps>().props
  const user = auth.user
  const userRoles = user.roles?.map((role: any) => role.name) || []
  const isTutor = userRoles.includes('tutor')
  const isStudent = userRoles.includes('student')

  const { data, setData, post, processing, errors } = useForm<{ email: string }>({ email: '' })

  const handleInviteStudent: FormEventHandler = (e) => {
    e.preventDefault()
    post(route('tutor.invite-student'), {
      preserveScroll: true,
      onSuccess: () => setData('email', ''),
    })
  }

  const handleDisconnect = (studentId: number) => {
    if (confirm('Are you sure you want to disconnect from this student? Any pending essays will be returned to their drafts.')) {
      post(route('tutor.profile.disconnect-student', { studentId }), {
        preserveScroll: true,
      })
    }
  }

  const handleAcceptInvitation = (token: string) => {
    post(route('invitation.accept', { token }), {
      preserveScroll: true,
    })
  }

  const handleRejectInvitation = (token: string) => {
    if (confirm('Are you sure you want to reject this invitation?')) {
      post(route('invitation.reject', { token }), {
        preserveScroll: true,
      })
    }
  }

  const handleCancelInvitation = (id: number) => {
    if (confirm('Are you sure you want to cancel this invitation?')) {
      post(route('invitation.cancel', { id }), {
        preserveScroll: true,
      })
    }
  }

  const handleDismissNotification = (notificationId: string) => {
    post(route('notifications.mark-as-read', { id: notificationId }), {
      preserveScroll: true,
    })
  }

  return (
    <AuthenticatedLayout header={<h2 className="text-2xl font-semibold text-gray-800">Profile Settings</h2>}>
      <Head title="Profile" />

      <div className="py-6">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* User Information Section */}
          <UserInformation user={user} userRoles={userRoles} />

          {/* Tutor Notifications Section */}
          {isTutor && <Notifications notifications={notifications || []} onDismiss={handleDismissNotification} />}

          {/* Tutor Section: Pending Invitations Sent */}
          {isTutor && <PendingInvitations invitations={pendingInvitations || []} onCancel={handleCancelInvitation} />}

          {/* Tutor Section: Invite Students */}
          {isTutor && (
            <InviteStudent
              email={data.email}
              onEmailChange={(email) => setData('email', email)}
              onSubmit={handleInviteStudent}
              processing={processing}
              errors={errors}
            />
          )}

          {/* Tutor Section: My Students */}
          {isTutor && students && <MyStudents students={students} onDisconnect={handleDisconnect} />}

          {/* Student Notifications Section */}
          {isStudent && <Notifications notifications={notifications || []} onDismiss={handleDismissNotification} />}

          {/* Student Section: My Tutors */}
          {isStudent && tutors && <MyTutors tutors={tutors} />}

          {/* Student Section: Pending Invitations Received */}
          {isStudent && (
            <TutorInvitations
              invitations={pendingInvitations || []}
              onAccept={handleAcceptInvitation}
              onReject={handleRejectInvitation}
            />
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
