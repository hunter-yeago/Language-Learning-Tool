import { useState, useEffect } from 'react'
import { DictionaryEntry } from '@/types/dictionary'

interface DictionarySearchFormProps {
  setWords: (entries: DictionaryEntry[]) => void
}

export default function DictionarySearchForm({ setWords }: DictionarySearchFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // Auto-search with debouncing
  useEffect(() => {
    const trimmedTerm = searchTerm.trim()

    if (trimmedTerm === '') {
      setWords([])
      setError(null)
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true)
      setError(null)

      try {
        const response = await fetch(`/lookup-word/${encodeURIComponent(trimmedTerm)}`)
        if (!response.ok) throw new Error('Failed to fetch data')

        const data = await response.json()

        if (data.success && data.response?.entries) {
          setWords(data.response.entries)
        } else {
          setWords([])
          setError('No definition found')
        }
      } catch (err) {
        console.error('Error fetching dictionary data:', err)
        setError('Failed to fetch data. Please try again.')
        setWords([])
      } finally {
        setIsSearching(false)
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
  }, [searchTerm, setWords])

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md space-y-4">
      <label className="block text-lg font-medium text-gray-700">Search Dictionary:</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type a word..."
          className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        {isSearching && (
          <div className="flex items-center px-4 text-gray-500 text-sm">
            Searching...
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
