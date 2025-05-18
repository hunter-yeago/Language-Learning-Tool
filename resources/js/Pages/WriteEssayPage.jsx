import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { useState } from 'react'
import { useForm } from '@inertiajs/react'
import WordBank from '@/Components/word-bank/WordBank.jsx'

export default function WriteEssayPage({ bucket, words }) {
  const [title, setTitle] = useState('')
  const [wordButtons, setWordButtons] = useState([])
  const { data, setData, post, processing } = useForm({
    title: '',
    content: '',
    bucket_id: bucket.id,
    words: [],
    tutor_id: 2,
  })

  function handleTitleChange(e) {
    setData('title', e.target.value)
    setTitle(e.target.value)
  }

  function handleTextChange(e) {
    const usedWords = findUsedWords(e.target.value)
    setWordButtons(usedWords)

    setData((prevData) => {
      return {
        ...prevData,
        content: e.target.value,
        words: getUpdatedWords(usedWords),
      }
    })
  }

  // some voodoo magic about having an issue with a smiley likek thi :) in the word bank
  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  function getUpdatedWords(usedWords) {
    // Create a Set of used word IDs for faster lookup
    const usedWordIds = new Set(usedWords.map((word) => word.id))

    // Mark all words with used: true/false
    return words.map((word) => ({
      ...word,
      used: usedWordIds.has(word.id),
    }))
  }

  // 'i' — case-insensitive match
  // \\b — word boundary (ensures "benevolent" matches only as a full word, not inside "benevolently")
  function findUsedWords(userEssay) {
    // start filter
    return words.filter((word) => {
      // use regex to search for word
      const wordRegex = new RegExp(`\\b${escapeRegex(word.word)}\\b`, 'i')

      // callback - add the word to the new array if it matches
      return wordRegex.test(userEssay)
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    post(route('student.store-essay'), data)
  }

  return (
    <AuthenticatedLayout header={<h2 className="text-2xl font-semibold text-gray-800">Write Your Essay</h2>}>
      <div className="flex items-center justify-center max-w-[1200px]">
        <div className="flex flex-col items-center gap-2 w-full max-w-md p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Bucket: {bucket.title}</h3>

          <WordBank words={words} wordButtons={wordButtons} wordBankTitle={bucket.title} />

          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2 w-full">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Essay Title"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <textarea
              onChange={handleTextChange}
              rows="10"
              placeholder="Start writing your essay here..."
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>

            <button className="w-1/2 p-2 bg-green-500 text-white rounded-md hover:bg-green-600" type="submit" disabled={processing}>
              {processing ? 'Submitting...' : 'Submit Essay'}
            </button>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
