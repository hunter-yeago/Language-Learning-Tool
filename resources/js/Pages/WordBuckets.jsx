import { useState, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function WordBuckets() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        words: [],
    });

    const [currentWord, setCurrentWord] = useState('');
    const [wordList, setWordList] = useState([]);
    const inputRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (currentWord.trim() !== '') {
                setWordList((prevList) => [...prevList, currentWord.trim()]);
                setData('words', [...wordList, currentWord.trim()]);
                setCurrentWord('');
                setTimeout(() => {
                    inputRef.current.focus();
                }, 0);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/word_buckets', {
            onSuccess: () => alert('Word Bank created successfully!'),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-semibold text-gray-800">
                    Create New Word Bank
                </h2>
            }
        >
            <Head title="Word Buckets" />

            <div className="flex items-center justify-center mt-12">
                <div className="w-full max-w-2xl p-6 bg-white shadow-md rounded-lg flex space-x-4">
                    <div className="flex-1">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Word Bank Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                                {errors.title && (
                                    <div className="text-red-500 text-sm">
                                        {errors.title}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="wordInput"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Add a Word
                                </label>
                                <input
                                    type="text"
                                    id="wordInput"
                                    value={currentWord}
                                    onChange={(e) => setCurrentWord(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    ref={inputRef}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>

                            <div className="mt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    {processing ? 'Saving...' : 'Save Word Bank'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="w-1/3 max-h-80 overflow-y-auto border border-gray-300 rounded-md p-4">
                        <h3 className="text-lg font-medium text-gray-800">Word Bank Preview:</h3>
                        <ul className="list-disc list-inside mt-2 text-gray-900">
                            {wordList.map((word, index) => (
                                <li key={index}>{word}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
