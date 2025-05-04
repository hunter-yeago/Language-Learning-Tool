export default function WordBank ({ words, WordButtons }) {

    if (!Array.isArray(words) || words.length === 0) return <p className="text-gray-500">No words available.</p>

    return (
        <>
            <ul className="mb-2 flex flex-wrap gap-3">
                {
                    words.map((word, index) => (
                        <li key={index}
                        className={`${WordButtons.includes(word) ? 'line-through' : 'text-green-900'}`}
                    >
                        {word.word}
                    </li>
                                        
                    ))
                }
            </ul>
        </>

    )
}
