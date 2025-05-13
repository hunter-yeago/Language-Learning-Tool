export default function CommentWords({ essay, data, setCurrentComment }) {
  return (
    <ul className="flex flex-wrap gap-2 border items-center rounded-lg p-4">
      {essay.words.map((word) => {
        return (
          <li key={word.id}>
            <button onClick={() => setCurrentComment(word.id)} className={`px-2 py-1 rounded-full border hover:bg-gray-100`}>
              {word.word}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
