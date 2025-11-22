import { useState, useEffect } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { capitalizeFirstLetter } from '@/Utilities/strings/capitalize_first_letter.js'
import LexemeCard from '@/Components/dictionary/LexemeCard'
import { findPluralForm } from '@/Utilities/dictionary/dictionary'
import DictionarySearchForm from '@/Components/dictionary/DictionarySearchForm'
import { Head } from '@inertiajs/react'
import { DictionaryEntry } from '@/types/dictionary'
import { Bucket } from '@/types/bucket'
import axios from 'axios'

interface Props {
  buckets: Bucket[]
}

interface ExistingWordCheck {
  exists: boolean
  buckets?: Array<{ id: number; title: string }>
}

export default function DictionaryPage({ buckets }: Props) {
  const [words, setWords] = useState<DictionaryEntry[]>([])
  const [existingWordCheck, setExistingWordCheck] = useState<ExistingWordCheck | null>(null)
  const [selectedBucketId, setSelectedBucketId] = useState<number | null>(null)
  const [addingWord, setAddingWord] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Check if word exists in user's buckets whenever words change
  useEffect(() => {
    if (words.length > 0) {
      const checkWord = async () => {
        try {
          const response = await axios.post('/buckets/check-word-exists', { word: words[0].entry })
          setExistingWordCheck(response.data)
        } catch (error) {
          console.error('Error checking word existence:', error)
        }
      }
      checkWord()
      setSuccessMessage(null)
      setErrorMessage(null)
    } else {
      setExistingWordCheck(null)
    }
  }, [words])

  const handleAddWord = async () => {
    if (!selectedBucketId || !words[0]?.entry) return

    setAddingWord(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      const response = await axios.post('/buckets/add-word', {
        word: words[0].entry,
        bucket_id: selectedBucketId,
      })

      if (response.data.success) {
        setSuccessMessage(response.data.message)
        // Refresh the word existence check
        const checkResponse = await axios.post('/buckets/check-word-exists', { word: words[0].entry })
        setExistingWordCheck(checkResponse.data)
        setSelectedBucketId(null)
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Failed to add word to bucket')
    } finally {
      setAddingWord(false)
    }
  }

  return (
    <AuthenticatedLayout header={<h1 className="text-2xl font-semibold text-gray-800">Dictionary</h1>}>
      <Head title="Dictionary" />

      <DictionarySearchForm setWords={setWords} />

      {words.length > 0 && (
        <section className="max-w-2xl mx-auto mt-6 space-y-4">
          {/* Word Existence Status & Add to Bucket */}
          <div className="p-6 bg-white shadow-md rounded-md">
            <h2 className="text-xl mb-4 font-bold">{capitalizeFirstLetter(words[0].entry)}</h2>

            {/* Success/Error Messages */}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            )}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-medium text-red-800">{errorMessage}</p>
              </div>
            )}

            {/* Word Already Exists */}
            {existingWordCheck?.exists && existingWordCheck.buckets && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-semibold text-blue-800 mb-2">
                  This word already exists in your buckets:
                </p>
                <ul className="space-y-1">
                  {existingWordCheck.buckets.map((bucket) => (
                    <li key={bucket.id} className="text-sm text-blue-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      {bucket.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Add to Bucket Section */}
            {!existingWordCheck?.exists && buckets.length > 0 && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-3">Add this word to a bucket:</p>
                <div className="flex gap-2">
                  <select
                    value={selectedBucketId || ''}
                    onChange={(e) => setSelectedBucketId(Number(e.target.value))}
                    className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  >
                    <option value="">Select a bucket...</option>
                    {buckets.map((bucket) => (
                      <option key={bucket.id} value={bucket.id}>
                        {bucket.title}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddWord}
                    disabled={!selectedBucketId || addingWord}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {addingWord ? 'Adding...' : 'Add'}
                  </button>
                </div>
              </div>
            )}

            {!existingWordCheck?.exists && buckets.length === 0 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  You don't have any buckets yet. Create a bucket from your dashboard to start adding words.
                </p>
              </div>
            )}
          </div>

          {/* Dictionary Definition */}
          <div className="p-6 bg-white shadow-md rounded-md" aria-label={`dictionary results for ${words[0].entry}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Definition</h3>
            <div className="flex flex-col gap-4">
              {words.map((entry) =>
                entry.lexemes.map((lexeme, index) => <LexemeCard key={index} lexeme={lexeme} pluralForm={findPluralForm(words[0].lexemes) ?? ''} />),
              )}
            </div>
          </div>
        </section>
      )}
    </AuthenticatedLayout>
  )
}
