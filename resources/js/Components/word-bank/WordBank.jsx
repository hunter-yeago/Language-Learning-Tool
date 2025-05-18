export default function WordBank({ words, wordButtons }) {
  if (!Array.isArray(words) || words.length === 0) return <p className="text-gray-500">No words available.</p>

  return (
    <>
      <ul className="mb-2 flex flex-wrap gap-3">
        {/* iterate over essay words */}
        {words.map((currentWord, index) => {
          // return true if the word id from this mapped word is equal to one of the ids in the wordButtons array
          const isUsed = wordButtons.some((usedWord) => usedWord.id === currentWord.id)

          return (
            <li key={index} className={isUsed ? 'line-through' : 'text-green-900'}>
              {currentWord.word}
            </li>
          )
        })}
      </ul>
    </>
  )
}
