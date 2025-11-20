import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { useState, FormEventHandler, ChangeEvent } from 'react'
import { useForm } from '@inertiajs/react'
import WordBank from '@/Components/word-bank/WordBank'
import { Bucket } from '@/types/bucket'
import { Word } from '@/types/word'

interface WordWithUsed extends Word {
  used: boolean
}

interface Props {
  bucket: Bucket
  words: Word[]
}

interface FormData {
  title: string
  content: string
  bucket_id: number
  words: WordWithUsed[]
  tutor_id: number
  notes: string
}

export default function WriteEssayPage({ bucket, words }: Props) {
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [wordButtons, setWordButtons] = useState<Word[]>([])
  const { setData, post, processing } = useForm<FormData>({
    title: '',
    content: '',
    bucket_id: bucket.id,
    words: [],
    tutor_id: 2,
    notes: '',
  })

  /**
   * Handles changes to the essay title input.
   * Updates both form data and local state.
   */
  function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
    // Update form data for submission
    setData('title', e.target.value)

    // Update local state for UI display
    setTitle(e.target.value)
  }

  /**
   * Handles changes to the notes textarea.
   * Updates both form data and local state.
   */
  function handleNotesChange(e: ChangeEvent<HTMLTextAreaElement>) {
    // Update form data for submission
    setData('notes', e.target.value)

    // Update local state for UI display
    setNotes(e.target.value)
  }

  /**
   * Handles changes to the essay content textarea.
   * Finds which vocabulary words are used in the text and updates word usage status.
   */
  function handleTextChange(e: ChangeEvent<HTMLTextAreaElement>) {
    // Find which vocabulary words appear in the essay text
    const usedWords = findUsedWords(e.target.value)

    // Update displayed word buttons in the word bank
    setWordButtons(usedWords)

    // Update form data with essay content and word usage
    setData((prevData) => {
      return {
        ...prevData,
        content: e.target.value,
        words: getUpdatedWords(usedWords), // Mark which words are used/unused
      }
    })
  }

  /**
   * Escapes special regex characters in a string to prevent regex errors.
   * Necessary to handle words that might contain regex special chars like :) or (test)
   */
  function escapeRegex(string: string): string {
    // Replace all regex special characters with escaped versions
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  /**
   * Creates an updated words array with usage status for each word.
   * Marks which words from the bucket are actually used in the essay.
   */
  function getUpdatedWords(usedWords: Word[]): WordWithUsed[] {
    // Create a Set of used word IDs for O(1) lookup performance
    const usedWordIds = new Set(usedWords.map((word) => word.id))

    // Map through all bucket words and mark each as used or unused
    return words.map((word) => ({
      ...word,
      used: usedWordIds.has(word.id), // True if word appears in essay, false otherwise
    }))
  }

  /**
   * Finds which vocabulary words from the bucket appear in the essay text.
   * Uses case-insensitive regex matching with word boundaries to match whole words only.
   *
   * 'i' flag = case-insensitive match
   * \\b = word boundary (ensures "benevolent" matches only as full word, not inside "benevolently")
   */
  function findUsedWords(userEssay: string): Word[] {
    // Filter the bucket words to only those that appear in the essay
    return words.filter((word) => {
      // Create regex with escaped word text, word boundaries, and case-insensitive flag
      const wordRegex = new RegExp(`\\b${escapeRegex(word.word)}\\b`, 'i')

      // Test if this word appears anywhere in the essay text
      return wordRegex.test(userEssay)
    })
  }

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault()
    post(route('student.store-essay'))
  }

  return (
    <AuthenticatedLayout header={<h2 className="text-2xl font-semibold text-gray-800">Write Your Essay</h2>}>
      <div className="flex items-center justify-center max-w-[1200px]">
        <div className="w-full flex flex-col items-center gap-2  max-w-2xl p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Bucket: {bucket.title}</h3>

          <WordBank words={words} wordButtons={wordButtons} />

          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 w-full">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Essay Title"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <textarea
              onChange={handleTextChange}
              rows={10}
              placeholder="Start writing your essay here..."
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>

            <div className="w-full">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes for Tutor (Optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={handleNotesChange}
                rows={3}
                placeholder="Add any questions, context, or notes for your tutor..."
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">
                Your tutor will see these notes when grading your essay.
              </p>
            </div>

            <button className="w-1/2 p-2 bg-green-500 text-white rounded-md hover:bg-green-600" type="submit" disabled={processing}>
              {processing ? 'Submitting...' : 'Submit Essay'}
            </button>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
