

interface GeneralFeedbackProps {
  setData: (key: string, value: string) => void;
  feedback: string;
}

export default function GeneralFeedback({ setData, feedback }: GeneralFeedbackProps) {
  return (
    <div className="w-full mt-4">
      <h3 className="text-lg font-semibold mb-2">General Feedback</h3>

      <div className="border rounded-lg p-4 bg-gray-50">
        <textarea
          rows={4}
          placeholder="Enter general feedback for the student..."
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={feedback}
          onChange={(e) => setData('feedback', e.target.value)}
        ></textarea>
      </div>
    </div>
  )
}
