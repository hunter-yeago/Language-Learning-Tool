export default function Instructions() {
  return (
    <p className="text-sm text-gray-600 flex flex-wrap gap-2 items-center">
      Word highlight meanings:
      <span className="inline-block px-2 rounded bg-green-200 text-green-800">Correct</span>
      <span className="inline-block px-2 rounded bg-yellow-200 text-yellow-800">Partially Correct</span>
      <span className="inline-block px-2 rounded bg-red-200 text-red-800">Incorrect</span>
      <span className="inline-block px-2 rounded bg-blue-200 text-blue-800">Waiting for Grade</span>
      <span className="inline-block px-2 rounded bg-gray-200 text-gray-800">Unused</span>
    </p>
  )
}
