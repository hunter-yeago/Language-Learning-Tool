import { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function AddWordsForm({ bucketId }) {
    const { data, setData, post, processing, errors } = useForm({
        words: [],
    });

      // code for adding words to word bank
    const [currentWord, setCurrentWord] = useState('');
    // const inputRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (currentWord.trim() !== '') {
                setData('words', [...data.words, currentWord.trim()]);
                setCurrentWord('');
                setTimeout(() => {
                    // inputRef.current.focus();
                }, 0);
            }
        }
    };

    // const [currentWord, setCurrentWord] = useState('');
    const [wordList, setWordList] = useState([]);

    // const handleKeyDown = (e) => {
    //     if (e.key === 'Enter') {
    //         e.preventDefault();
    //         if (currentWord.trim() !== '') {
    //             setWordList((prevList) => [...prevList, currentWord.trim()]);
    //             setData('words', [...wordList, currentWord.trim()]);
    //             setCurrentWord('');
    //         }
    //     }
    // };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/word_buckets/${bucketId}/add-words`, {
            onSuccess: () => alert('Words added successfully!'),
        });
    };

    return (
        <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-4">
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    {errors.words && (
                        <div className="text-red-500 text-sm">{errors.words}</div>
                    )}
                </div>
                <ul className="list-disc pl-5">
                    {wordList.map((word, index) => (
                        <li key={index}>{word}</li>
                    ))}
                </ul>
                <div className="mt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {processing ? 'Saving...' : 'Save Words'}
                    </button>
                </div>
            </form>
        </div>
    );
}
