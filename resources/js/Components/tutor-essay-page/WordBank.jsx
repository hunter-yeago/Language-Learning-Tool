import { cycleGrade } from '@/Utilities/tutor_utils/grades'
import Instructions from './Instructions'
import WordBankItem from './WordBankItem'

export default function WordBank({ essay, setData, words }) {
  const hasWords = Array.isArray(essay.words) && essay.words.length > 0

  if (!hasWords) {
    return (
      <section aria-label={`word bank for the ${essay.title} essay`}>
        <h2 className="text-lg font-semibold mb-2">Word Bank</h2>
        <p className="text-gray-500 italic">No words in this essay.</p>
      </section>
    )
  }

  function handleWordClick(wordId) {
    // Update words directly in the form data
    const updatedWords = words.map((word) => {
      if (word?.id === wordId) {
        return {
          ...word,
          pivot: {
            ...word.pivot,
            grade: cycleGrade(word.pivot.grade),
          },
        }
      }
      return word
    })

    setData('words', updatedWords)
  }

  return (
    <section className="w-full" aria-label={`word bank for the ${essay.title} essay`}>
      <div className="flex gap-3 items-center mb-2">
        <h2 className="text-lg font-semibold">Word Bank</h2>
        <Instructions />
      </div>
      <ul className="border items-center rounded-lg p-4 flex flex-wrap gap-2">
        {words.map((word) => (
          <WordBankItem key={word.id} word={word} handleWordClick={handleWordClick} />
        ))}
      </ul>
    </section>
  )
}
