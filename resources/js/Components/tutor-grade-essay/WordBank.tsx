import { cycleGrade } from '@/Utilities/tutor_utils/grades'
import { TutorWord } from '@/types/tutor'
import Instructions from './Instructions'
import WordBankItem from './WordBankItem'
import { Essay } from '@/types/essay';

interface WordBankProps {
  essay: Essay;
  setData: (key: string, value: TutorWord[]) => void;
}

export default function WordBank({ essay, setData }: WordBankProps) {
  const words = essay.words;

  const hasWords = Array.isArray(words) && words.length > 0

  if (!hasWords) {
    return (
      <section aria-label={`word bank for the ${essay.title} essay`}>
        <h2 className="text-lg font-semibold mb-2">Word Bank</h2>
        <p className="text-gray-500 italic">No words in this essay.</p>
      </section>
    )
  }

  function handleWordClick(wordId: number) {
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
      <Instructions />
      
      <div>
        <h2 className="text-lg font-semibold">Word Bank</h2>
        <ul className="border items-center rounded-lg p-4 flex flex-wrap gap-2">
          {words.map((word) => (
            <WordBankItem key={word.id} word={word} handleWordClick={handleWordClick} />
          ))}
        </ul>
      </div>
    </section>
  )
}
