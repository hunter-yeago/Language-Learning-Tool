import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {capitalizeFirstLetter} from "@/Utilities/capitalize_first_letter.js";
import LexemeCard from '@/Components/tutor/dictionary/LexemeCard';
import { findPluralForm } from '@/Utilities/dictionary/dictionary';
import DictionarySearchForm from '@/Components/tutor/dictionary/DictionarySearchForm';
export default function DictionaryPage() {
    
    // TODO - after a word is submitted, capitilizeFirstLetter is firing each time you type in the input / it re-renders
    const [wordToSearch, setWordToSearch] = useState('');
    const [words, setWords] = useState([]);
    const [pluralForm, setPluralForm] = useState('');
    const [error, setError] = useState(null);

    async function searchDictionary (event) {
        event.preventDefault();

        try {
            const response = await fetch(`/lookup-word/${wordToSearch.toLowerCase()}`);

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            const entries = data.response.entries;

            setWords(entries);
            if (entries.length > 0) setPluralForm(findPluralForm(entries[0].lexemes) ?? '');
            setError(null);
        } catch (err) {
            console.error('Error fetching dictionary data:', err);
            setError('Failed to fetch data. Please try again.');
        }
    };

    return (
        <AuthenticatedLayout>

            <DictionarySearchForm 
                searchDictionary={searchDictionary}
                wordToSearch={wordToSearch}
                setWordToSearch={setWordToSearch} 
                error={error}
            />
            
            {words.length > 0 && (
                <section className="max-w-2xl mx-auto mt-6 p-6 bg-white shadow-md rounded-md" aria-label={`dictionary results for ${words[0].entry}`} >
                    
                    <h2 className="text-xl mb-4 font-bold">{capitalizeFirstLetter(words[0].entry)}</h2>
                    
                    <div className="flex flex-col gap-4">
                        {words.map((entry) =>
                            entry.lexemes.map((lexeme, index) => (
                                <LexemeCard key={index} lexeme={lexeme} pluralForm={pluralForm} />
                            ))
                        )}
                    </div>
                </section>
            )}
        </AuthenticatedLayout>
    );
}
