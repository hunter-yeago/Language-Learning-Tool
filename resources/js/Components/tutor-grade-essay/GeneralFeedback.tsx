

interface GeneralFeedbackProps {
  setData: (key: string, value: string) => void;
  feedback: string;
}

export default function GeneralFeedback({ setData, feedback }: GeneralFeedbackProps) {
  return (
      <section className="border rounded-lg p-4 bg-gray-50">
        
        <h3 className="text-lg font-semibold mb-4">
          General Feedback <span className="text-red-600">*</span>
        </h3>

        <textarea
          rows={4}
          placeholder="Enter general feedback for the student... (required)"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={feedback}
          onChange={(e) => setData('feedback', e.target.value)}
          required
        ></textarea>
        
      </section>
  )
}
