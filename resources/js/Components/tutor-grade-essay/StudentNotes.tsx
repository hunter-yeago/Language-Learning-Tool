import { Essay } from '@/types/essay'

interface Props {
  essay: Essay
}

export default function StudentNotes({ essay }: Props) {
  if (!essay.notes || essay.notes.trim() === '') {
    return null
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        Student Notes
      </h3>
      <p className="text-blue-800 whitespace-pre-wrap">{essay.notes}</p>
    </div>
  )
}
