import { useState } from 'react'
import { router } from '@inertiajs/react'
import { Bucket } from '@/types/bucket'

interface BucketSettingsProps {
  bucket: Bucket<any>
}

export default function BucketSettings({ bucket }: BucketSettingsProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteBucket = () => {
    setIsDeleting(true)
    router.delete(route('student.delete-bucket', { bucket_id: bucket.id }), {
      preserveState: false, // Force full page reload with fresh data
      onFinish: () => {
        setShowDeleteModal(false)
        setIsDeleting(false)
      }
    })
  }

  return (
    <section className="pt-6 border-t border-neutral-200">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Bucket Settings</h3>

      <div className="space-y-4">
        {/* Placeholder settings */}
        <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
          <h4 className="font-medium text-gray-700 mb-2">General Settings</h4>
          <p className="text-sm text-gray-500">Additional settings will be available here.</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
          <h4 className="font-medium text-gray-700 mb-2">Notifications</h4>
          <p className="text-sm text-gray-500">Configure notification preferences for this bucket.</p>
        </div>

        {/* Danger Zone */}
        <div className="p-4 bg-red-50 rounded-md border border-red-200">
          <h4 className="font-medium text-red-800 mb-2">Danger Zone</h4>
          <p className="text-sm text-red-600 mb-3">
            Deleting this bucket will permanently remove all associated words and essays. This action cannot be undone.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Delete Bucket
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Delete Bucket?</h3>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete <strong>"{bucket.title}"</strong>? This will permanently delete:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>{bucket.words?.length || 0} vocabulary words</li>
              <li>All associated essays and their feedback</li>
              <li>All progress and grades</li>
            </ul>
            <p className="text-red-600 font-medium mb-6">This action cannot be undone!</p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBucket}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Bucket'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
