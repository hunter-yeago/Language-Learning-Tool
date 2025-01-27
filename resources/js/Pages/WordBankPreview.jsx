export default function WordBankPreview({ wordList }) {
    return (
        <div className="w-1/3 max-h-80 overflow-y-auto border border-gray-300 rounded-md p-4">
            <h3 className="text-lg font-medium text-gray-800">Word Bank Preview:</h3>
            <ul className="list-disc list-inside mt-2 text-gray-900">
                {wordList.map((word, index) => (
                    <li key={index}>{word}</li>
                ))}
            </ul>
        </div>
    );
}
