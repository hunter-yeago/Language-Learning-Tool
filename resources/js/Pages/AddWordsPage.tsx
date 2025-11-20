import { useState, FormEventHandler } from 'react'
import { useForm } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Bucket } from '@/types/bucket'
import { Word } from '@/types/word'
import BucketInfoCard from '@/Components/add-words/BucketInfoCard'
import DictionaryLookup from '@/Components/add-words/DictionaryLookup'
import WordListPanel from '@/Components/add-words/WordListPanel'

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

    if (!bucket?.id) {
      console.error('No bucket selected')
      return
    }

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
    const updatedWordList = wordList.filter((word) => word !== wordToRemove)
    setWordList(updatedWordList)
    setData('words', updatedWordList)
  }

  return (
    <AuthenticatedLayout
      header={
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Add Words to Bucket</h2>
          {bucket?.title && <p className="text-sm text-gray-600 mt-1">{bucket.title}</p>}
        </div>
      }
    >
      <div className="px-4 sm:px-6 lg:px-8 mx-auto mt-8 max-w-6xl">
        {bucket && (
          <div className="mb-6">
            <BucketInfoCard bucket={bucket} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DictionaryLookup
            currentWord={currentWord}
            setCurrentWord={setCurrentWord}
            onAddWord={addWord}
            errors={errors.words}
          />

          <WordListPanel
            wordList={wordList}
            bucket={bucket}
            onRemoveWord={removeWord}
            onSave={handleSubmit}
            processing={processing}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
