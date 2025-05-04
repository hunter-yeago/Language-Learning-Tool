export default function Instructions(){

  return(
    <p className="text-sm text-gray-600">
      Click on highlighted words to grade them:
      <span className="inline-block px-2 mx-1 bg-green-200 text-green-800 rounded">Correct</span> →
      <span className="inline-block px-2 mx-1 bg-yellow-200 text-yellow-800 rounded">Partially Correct</span> →
      <span className="inline-block px-2 mx-1 bg-red-200 text-red-800 rounded">Incorrect</span>
    </p>
  )
}