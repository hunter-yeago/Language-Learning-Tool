import { useState, FormEvent } from 'react'
import { DictionaryEntry } from '@/types/dictionary'

interface DictionarySearchFormProps {
  setWords: (entries: DictionaryEntry[]) => void
}

export default function DictionarySearchForm({ setWords }: DictionarySearchFormProps) {
  const [error, setError] = useState<string | null>(null)

  async function searchDictionary(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const word = (form.elements.namedItem('word') as HTMLInputElement).value

    if (!word) {
      setWords([])
      setError('Please enter a word.')
      return
    }

    try {
      const response = await fetch(`/lookup-word/${word}`)
      if (!response.ok) throw new Error('Failed to fetch data')

      const data = await response.json()

      setWords(data.response.entries)
      setError(null)
    } catch (err) {
      console.error('Error fetching dictionary data:', err)
      setError('Failed to fetch data. Please try again.')
    }
  }

  return (
    <form className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md space-y-4" onSubmit={searchDictionary}>
      <label className="block text-lg font-medium text-gray-700">Search Dictionary:</label>
      <div className="flex gap-2">
        <input name="word" className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
          Search
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  )
}
