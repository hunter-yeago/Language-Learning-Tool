export default function GeneralFeedback() {
  return (
    <div className="w-full mt-4">
      {/* Title */}
      <h3 className="text-lg font-semibold mb-2">General Feedback</h3>

      {/* Feedback */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <textarea
          rows="4"
          placeholder="Enter general feedback for the student..."
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        ></textarea>

        <div className="flex justify-end mt-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Save</button>
        </div>
      </div>
    </div>
  )
}
