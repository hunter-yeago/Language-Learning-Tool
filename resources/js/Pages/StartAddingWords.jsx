import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function StartAddingWords({ id, bucket }) {
    console.log('hereisbucet', bucket);
    const { data, setData, post, processing, errors } = useForm({
        words: [],
    });

    const [currentWord, setCurrentWord] = useState('');
    const [wordList, setWordList] = useState([]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addWord();
        }
    };

    const addWord = () => {
        const trimmedWord = currentWord.trim();
        if (trimmedWord !== '') {
            // Prevent duplicate words
            if (!wordList.includes(trimmedWord)) {
                const updatedWordList = [...wordList, trimmedWord];
                setWordList(updatedWordList);
                setData('words', updatedWordList);
                setCurrentWord('');
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/word_buckets/${bucket}/add-words`, {
            onSuccess: () => {
                alert('Words added successfully!');
                // Optionally, you might want to clear the word list after successful submission
                setWordList([]);
                setData('words', []);
            },
        });
    };

    const removeWord = (wordToRemove) => {
        const updatedWordList = wordList.filter(word => word !== wordToRemove);
        setWordList(updatedWordList);
        setData('words', updatedWordList);
    };

    return (
            <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-semibold text-gray-800">
                    Write an Essay
                </h2>
            }
        >
        <div className="flex w-4/5 mx-auto gap-3 mt-40">
            <div className="flex-1">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="wordInput"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Add a Word
                        </label>
                        <div className="flex">
                            <input
                                type="text"
                                id="wordInput"
                                value={currentWord}
                                onChange={(e) => setCurrentWord(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                            <button
                                type="button"
                                onClick={addWord}
                                className="mt-1 ml-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Add
                            </button>
                        </div>
                        {errors.words && (
                            <div className="text-red-500 text-sm">{errors.words}</div>
                        )}
                    </div>

                    <div className="mt-4">
                        <button
                            type="submit"
                            disabled={processing || wordList.length === 0}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save Words'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="w-1/3 max-h-80 overflow-y-auto border border-gray-300 rounded-md p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Word Bank Preview:</h3>
                {wordList.length > 0 ? (
                    <ul className="space-y-1">
                        {wordList.map((word, index) => (
                            <li 
                                key={index} 
                                className="flex justify-between items-center text-gray-900 bg-gray-100 px-2 py-1 rounded"
                            >
                                {word}
                                <button
                                    onClick={() => removeWord(word)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    ×
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 italic">No words added yet</p>
                )}
            </div>
        </div>
    </AuthenticatedLayout>
    );
}