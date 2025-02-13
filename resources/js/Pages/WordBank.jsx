
export default function WordBank ({ wordBankWords, usedWords }) {
    const lowerCaseWords = wordBankWords.map(word => word.toLowerCase())

    if (!Array.isArray(wordBankWords) && wordBankWords.length > 0) {
        return <p className="text-gray-500">No words available.</p>
    }

    return (
        <>
            <ul className="pl-6 mb-4 flex flex-wrap gap-3">
                {
                    wordBankWords.map((word, index) => (
                        <li key={index}
                            className={`${usedWords.includes(lowerCaseWords[index]) ? 'line-through' : 'none text-green-900'}`}
                        >
                            {word}
                        </li>
                    ))
                }
            </ul>
        </>

    )
}
