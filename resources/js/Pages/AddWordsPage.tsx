import { useState, FormEventHandler } from 'react'
import { useForm } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Bucket } from '@/types/bucket'
import { Word } from '@/types/word'

interface Props {
  bucket: Bucket
  words: Word[]
}

export default function AddWordsPage({ bucket }: Props) {
  const { setData, post, processing, errors } = useForm({
    words: [] as string[],
  })

  const [currentWord, setCurrentWord] = useState('')
  const [wordList, setWordList] = useState<string[]>([])

  /**
   * Handles Enter key press in the word input field.
   * Adds the word without submitting the form.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      // Add the word to the list
      addWord()
    }
  }

  /**
   * Adds a word to the word list if it's valid and not a duplicate.
   * Validates the word by trimming whitespace and checking for empty strings.
   */
  const addWord = () => {
    // Remove leading/trailing whitespace
    const trimmedWord = currentWord.trim()

    // Only proceed if the word is not empty
    if (trimmedWord !== '') {
      // Prevent duplicate words from being added
      if (!wordList.includes(trimmedWord)) {
        // Create new array with the added word
        const updatedWordList = [...wordList, trimmedWord]

        // Update local state for UI display
        setWordList(updatedWordList)

        // Update form data for submission
        setData('words', updatedWordList)

        // Clear the input field
        setCurrentWord('')
      }
    }
  }

  /**
   * Handles form submission to save all words to the bucket.
   * Sends the word list to the backend and clears the form on success.
   */
  const handleSubmit: FormEventHandler = (e) => {
    // Prevent default form submission behavior
    e.preventDefault()

    // Send POST request to add words to the bucket
    post(`/buckets/${bucket.id}/add-new-words`, {
      data: { words: wordList },

      // On successful save, clear the word list and form data
      onSuccess: () => {
        setWordList([])
        setData('words', [])
      },

      // Log any errors that occur during submission
      onError: (error) => console.error('Error adding words:', error),
    })
  }

  /**
   * Removes a word from the word list.
   * Updates both local state and form data.
   */
  const removeWord = (wordToRemove: string) => {
    // Filter out the word to remove
    const updatedWordList = wordList.filter((word) => word !== wordToRemove)

    // Update local state for UI display
    setWordList(updatedWordList)

    // Update form data for submission
    setData('words', updatedWordList)
  }

  return (
    <AuthenticatedLayout header={<h2 className="text-2xl font-semibold text-gray-800">Write an Essay</h2>}>
      {/* Container - Word Bank Preview, Word Adding Form */}
      <div className="flex flex-col px-20 mx-auto gap-3 mt-20 max-w-[800px]">
        {/* Word Bank Preview */}
        <div className=" max-h-80 overflow-y-auto border border-gray-300 rounded-md p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Word Bank Preview:</h3>
          {wordList.length > 0 ? (
            <ul className="space-y-1">
              {wordList.map((word, index) => (
                <li key={index} className="flex justify-between items-center text-gray-900 bg-gray-100 px-2 py-1 rounded">
                  {word}
                  <button onClick={() => removeWord(word)} className="text-red-500 hover:text-red-700">
                    x
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No words added yet</p>
          )}
        </div>

        {/*add a word input box container*/}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="wordInput" className="block text-sm font-medium text-gray-700">
                Add a Word
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="wordInput"
                  value={currentWord}
                  onChange={(e) => setCurrentWord(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <button type="button" onClick={addWord} className="mt-1 ml-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  Add
                </button>
              </div>
              {errors.words && <div className="text-red-500 text-sm">{errors.words}</div>}
            </div>

            <div className="mt-4">
              <button
                type="submit"
                disabled={processing || wordList.length === 0}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {processing ? 'Saving...' : 'Save Words'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
