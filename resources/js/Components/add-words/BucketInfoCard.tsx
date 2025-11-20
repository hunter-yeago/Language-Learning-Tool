import { Bucket } from '@/types/bucket'

interface Props {
  bucket: Bucket
}

export default function BucketInfoCard({ bucket }: Props) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{bucket.title}</h3>
          {bucket.description && <p className="text-gray-700 mb-3">{bucket.description}</p>}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span className="font-medium">Total Words:</span>
              <span className="bg-white px-2 py-0.5 rounded-full border border-indigo-200">
                {bucket.words?.length || 0}
              </span>
            </div>
            {bucket.created_at && (
              <div className="flex items-center gap-1">
                <span className="font-medium">Created:</span>
                <span>{formatDate(bucket.created_at)}</span>
              </div>
            )}
            {bucket.updated_at && (
              <div className="flex items-center gap-1">
                <span className="font-medium">Last Updated:</span>
                <span>{formatDate(bucket.updated_at)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
