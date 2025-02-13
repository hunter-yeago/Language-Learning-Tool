
export default function WordBank ({ wordBankWords, matchedWords }) {
    const lowerCaseWords = wordBankWords.map(word => word.toLowerCase())

    return (
        <>
            <ul className="pl-6 mb-4 flex flex-wrap gap-3">
                {wordBankWords.length > 0 ? (
                    wordBankWords.map((word, index) => (
                        <li key={index}
                            className={`${matchedWords.includes(lowerCaseWords[index]) ? 'line-through' : 'none'}`}
                        >
                            {word}
                        </li>
                    ))
                ) : (
                    <li className="text-gray-500">No words available.</li>
                )}
            </ul>
        </>

    )
}
