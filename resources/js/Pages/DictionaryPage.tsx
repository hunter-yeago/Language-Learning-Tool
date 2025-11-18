import { useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { capitalizeFirstLetter } from '@/Utilities/strings/capitalize_first_letter.js'
import LexemeCard from '@/Components/dictionary/LexemeCard'
import { findPluralForm } from '@/Utilities/dictionary/dictionary'
import DictionarySearchForm from '@/Components/dictionary/DictionarySearchForm'
import { Head } from '@inertiajs/react'
import { DictionaryEntry } from '@/types/dictionary'

export default function DictionaryPage() {
  const [words, setWords] = useState<DictionaryEntry[]>([])

  return (
    <AuthenticatedLayout header={<h1 className="text-2xl font-semibold text-gray-800">Dictionary</h1>}>
      <Head title="Dictionary" />

      <DictionarySearchForm setWords={setWords} />

      {words.length > 0 && (
        <section className="max-w-2xl mx-auto mt-6 p-6 bg-white shadow-md rounded-md" aria-label={`dictionary results for ${words[0].entry}`}>
          <h2 className="text-xl mb-4 font-bold">{capitalizeFirstLetter(words[0].entry)}</h2>
          <div className="flex flex-col gap-4">
            {words.map((entry) =>
              entry.lexemes.map((lexeme, index) => <LexemeCard key={index} lexeme={lexeme} pluralForm={findPluralForm(words[0].lexemes) ?? ''} />),
            )}
          </div>
        </section>
      )}
    </AuthenticatedLayout>
  )
}
