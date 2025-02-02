import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {capitalizeFirstLetter} from "@/Utilities/capitalize_first_letter.js";
export default function Dictionary() {
    const [wordToSearch, setWordToSearch] = useState('');
    const { data, setData, post, processing, errors } = useForm({
        word: ''
    });

    // to do - after a word is submitted, capitilizeFirstLetter is firing each time you type in the input / it re-renders
    const [words, setWords] = useState([]);
    const [pluralForm, setPluralForm] = useState('');
    const [error, setError] = useState(null);

    function findPluralForm(lexemes) {
        for (const lexeme of lexemes) {
            if (lexeme.partOfSpeech === 'noun' && lexeme.forms) {
                const plural = lexeme.forms.find(form => form.grammar?.some(grammar => grammar.number?.includes('plural')));
                return plural ? capitalizeFirstLetter(plural.form) : null;
            }
        }
        return null;
    }

    const searchDictionary = async (event) => {
        event.preventDefault();
        if (!wordToSearch.trim()) return;

        try {
            const response = await fetch(`/lookup-word/${wordToSearch.toLowerCase()}`);

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            const entries = data.response.entries;

            setWords(entries);
            setPluralForm(entries.length > 0 ? findPluralForm(entries[0].lexemes) : '');
            setError(null);
        } catch (err) {
            console.error('Error fetching dictionary data:', err);
            setError('Failed to fetch data. Please try again.');
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
                <form className="space-y-4" onSubmit={searchDictionary}>
                    <label className="block text-lg font-medium text-gray-700">Search Dictionary:</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={wordToSearch}
                            onChange={(e) => setWordToSearch(e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            disabled={processing}
                        >
                            {processing ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </form>
            </div>

            {words.length > 0 && (
                <div className="max-w-2xl mx-auto mt-6 p-6 bg-white shadow-md rounded-md">
                    <h2 className="text-xl font-bold">{capitalizeFirstLetter(words[0].entry)}</h2>
                    <div className="mt-4 space-y-4">
                        {words.map((entry, entryIndex) => (
                            entry.lexemes.map((lexeme, lexemeIndex) => (
                                <div key={`entry-${entryIndex}-lexeme-${lexemeIndex}`} className="p-4 border border-gray-300 rounded-md">
                                    <div className="text-lg font-medium text-gray-800">
                                        {capitalizeFirstLetter(lexeme.partOfSpeech)}
                                        {pluralForm && lexeme.partOfSpeech === 'noun' && <span> Plural: {pluralForm}</span>}
                                            </div>
                                            <p className="mt-1 text-gray-600">1. {lexeme.senses[0]?.definition || 'Definition not available'}</p>
                                    {Array.isArray(lexeme.senses[0]?.usageExamples) ? (
                                        <ul className="mt-2 text-gray-500 list-disc list-inside">
                                            {lexeme.senses[0].usageExamples.map((example, exampleIndex) => (
                                                <li key={`example-${exampleIndex}`}>{example}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="mt-2 text-gray-500 italic">No examples available</p>
                                    )}
                                </div>
                            ))
                        ))}
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
