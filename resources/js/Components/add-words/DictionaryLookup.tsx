import { useState, useEffect } from 'react'
import { DictionaryEntry } from '@/types/dictionary'
import { Bucket } from '@/types/bucket'
import axios from 'axios'

interface Props {
  currentWord: string
  setCurrentWord: (word: string) => void
  onAddWord: () => void
  errors?: string
}

interface ExistingWordCheck {
  exists: boolean
  buckets?: Array<{ id: number; title: string }>
}

export default function DictionaryLookup({ currentWord, setCurrentWord, onAddWord, errors }: Props) {
  const [dictionaryEntry, setDictionaryEntry] = useState<DictionaryEntry | null>(null)
  const [isLoadingDefinition, setIsLoadingDefinition] = useState(false)
  const [definitionError, setDefinitionError] = useState<string | null>(null)
  const [existingWordCheck, setExistingWordCheck] = useState<ExistingWordCheck | null>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onAddWord()
    }
  }

  useEffect(() => {
    const trimmedWord = currentWord.trim()

    if (trimmedWord === '') {
      setDictionaryEntry(null)
      setDefinitionError(null)
      setExistingWordCheck(null)
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsLoadingDefinition(true)
      setDefinitionError(null)

      try {
        // Fetch both dictionary definition and check if word exists
        const [dictionaryResponse, existsResponse] = await Promise.all([
          axios.get(`/lookup-word/${encodeURIComponent(trimmedWord)}`).catch(err => {
            console.error('Dictionary lookup error:', err)
            return { data: { success: false } }
          }),
          axios.post('/buckets/check-word-exists', { word: trimmedWord }).catch(err => {
            console.error('Word exists check error:', err)
            return { data: { exists: false } }
          }),
        ])

        if (dictionaryResponse.data.success && dictionaryResponse.data.response?.entries?.length > 0) {
          setDictionaryEntry(dictionaryResponse.data.response.entries[0])
        } else {
          setDictionaryEntry(null)
          setDefinitionError('No definition found')
        }

        setExistingWordCheck(existsResponse.data)
      } catch (error) {
        console.error('Error fetching data:', error)
        setDictionaryEntry(null)
        setDefinitionError('Failed to load definition')
        setExistingWordCheck({ exists: false })
      } finally {
        setIsLoadingDefinition(false)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [currentWord])

  return (
    <div className="space-y-4">
      {/* Input Card */}
      <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Look Up Word</h3>

        <div>
          <label htmlFor="wordInput" className="block text-sm font-medium text-gray-700 mb-2">
            Enter a word
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="wordInput"
              value={currentWord}
              onChange={(e) => setCurrentWord(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a word to see its definition..."
              className="flex-1 block rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={onAddWord}
              disabled={!currentWord.trim() || existingWordCheck?.exists}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add
            </button>
          </div>
          {errors && <div className="text-red-500 text-sm mt-2">{errors}</div>}
          {existingWordCheck?.exists && existingWordCheck.buckets && (
            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm font-medium text-amber-800">
                This word already exists in:
              </p>
              <ul className="mt-1 space-y-1">
                {existingWordCheck.buckets.map((bucket) => (
                  <li key={bucket.id} className="text-sm text-amber-700">
                    • {bucket.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Dictionary Definition Card */}
      {currentWord.trim() && (
        <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 min-h-[300px]">
          {isLoadingDefinition ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Loading definition...</div>
            </div>
          ) : definitionError ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500 italic">{definitionError}</div>
            </div>
          ) : dictionaryEntry ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-2xl font-bold text-gray-900">{dictionaryEntry.entry}</h4>
              </div>

              {dictionaryEntry.lexemes.map((lexeme, lexemeIndex) => (
                <div key={lexemeIndex} className="space-y-3">
                  <div className="text-sm font-medium text-indigo-600 italic">{lexeme.partOfSpeech}</div>

                  <ol className="space-y-3 list-decimal list-inside">
                    {lexeme.senses.map((sense, senseIndex) => (
                      <li key={senseIndex} className="text-gray-700">
                        <span className="ml-1">{sense.definition}</span>

                        {sense.usageExamples && sense.usageExamples.length > 0 && (
                          <div className="mt-2 ml-6 space-y-1">
                            {sense.usageExamples.map((example, exampleIndex) => (
                              <div key={exampleIndex} className="text-sm text-gray-600 italic">
                                "{example}"
                              </div>
                            ))}
                          </div>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-400 text-center">
                <p>Start typing to see definitions</p>
                <p className="text-sm mt-1">Quick lookup helps you learn as you read</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
