import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function WordBuckets() {
    // Initialize the form with Inertia's useForm hook
    const { data, setData, post, processing, errors } = useForm({
        title: '',  // Word Bank title
        words: [],  // List of words
    });

    const [wordList, setWordList] = useState(['']); // Initialize with one empty word input

    // Update both wordList state and Inertia form data when a word input changes
    const handleWordChange = (index, value) => {
        const updatedWords = [...wordList];
        updatedWords[index] = value;
        setWordList(updatedWords);
        setData('words', updatedWords); // Sync form data
    };

    // Add a new empty word input field
    const addWordInput = () => {
        setWordList([...wordList, '']);
    };

    // Handle form submission using Inertia's post method
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page reload

        console.log('thedata', data);
        post('/word_buckets', { // Send the data to your backend route
            onSuccess: () => alert('Word Bank created successfully!'), // Optional: Success feedback
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create New Word Bank
                </h2>
            }
        >
            <Head title="Word Buckets" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-yellow-500 text-gray-900">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Word Bank Title */}
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

                                {/* Word List Inputs */}
                                <div>
                                    <label
                                        htmlFor="words"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Words
                                    </label>
                                    {wordList.map((word, index) => (
                                        <div key={index} className="flex space-x-2 mt-2">
                                            <input
                                                type="text"
                                                value={word}
                                                onChange={(e) =>
                                                    handleWordChange(index, e.target.value)
                                                }
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                required
                                            />
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addWordInput}
                                        className="mt-2 inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        + Add Word
                                    </button>
                                </div>

                                {/* Dynamic Word List Preview */}
                                <div className="mt-4">
                                    <h3 className="text-lg font-medium text-gray-800">Word Bank Preview:</h3>
                                    <ul className="list-disc list-inside mt-2 text-gray-900">
                                        {wordList.map((word, index) => (
                                            <li key={index}>{word}</li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Submit Button */}
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
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
