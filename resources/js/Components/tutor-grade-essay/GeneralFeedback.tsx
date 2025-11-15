import { TutorFormData } from '@/types/tutor'

interface GeneralFeedbackProps {
  setData: (key: string, value: string) => void;
  data: TutorFormData;
}

export default function GeneralFeedback({ setData, data }: GeneralFeedbackProps) {
  return (
    <div className="w-full mt-4">
      {/* Title */}
      <h3 className="text-lg font-semibold mb-2">General Feedback</h3>

      {/* Feedback */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <textarea
          rows={4}
          placeholder="Enter general feedback for the student..."
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={data.feedback}
          onChange={(e) => setData('feedback', e.target.value)}
        ></textarea>
      </div>
    </div>
  )
}
