import { Bucket } from '@/types/bucket'

interface Props {
  wordList: string[]
  bucket?: Bucket
  onRemoveWord: (word: string) => void
  onSave: () => void
  processing: boolean
}

export default function WordListPanel({ wordList, bucket, onRemoveWord, onSave, processing }: Props) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Your Word List {wordList.length > 0 && `(${wordList.length})`}
        </h3>
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        {wordList.length > 0 ? (
          <ul className="space-y-2">
            {wordList.map((word, index) => (
              <li
                key={index}
                className="flex justify-between items-center text-gray-900 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium">{word}</span>
                <button
                  onClick={() => onRemoveWord(word)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
                  title="Remove word"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 italic">No words added yet</p>
            <p className="text-sm text-gray-400 mt-2">Add words from your reading to study later</p>
          </div>
        )}
      </div>

      {wordList.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onSave}
            disabled={processing || wordList.length === 0}
            className="w-full inline-flex justify-center items-center px-6 py-3 bg-green-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {processing ? 'Saving...' : `Save ${wordList.length} Word${wordList.length !== 1 ? 's' : ''} to Bucket`}
          </button>
        </div>
      )}
    </div>
  )
}
