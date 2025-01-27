import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function AddWords({ wordBuckets }) {
    const { data, setData, post, processing, errors } = useForm({
        bucket: null,
        words: [],
    });

    const [currentBucket, setCurrentBucket] = useState(null);
    const [wordList, setWordList] = useState([]);

    const handleBucketChange = (event) => {
        const bucketId = event.target.value;
        const bucket = wordBuckets.find((b) => b.id === parseInt(bucketId));

        if (bucket) {
            setCurrentBucket(bucket.title); // Save selected bucket title
            setWordList(bucket.words);       // Save the words associated with the bucket
            setData({
                bucket: bucket.title, // Set selected bucket data for submission
                words: bucket.words, // Set selected words data for submission
            });

        } else {
            setCurrentBucket(null);
            setWordList([]);
            setData({
                bucket: null,
                words: [],
            });
        }
    };

    const handleStartEssay = (e) => {
        e.preventDefault(); // Prevent default form submission

        // Check if a bucket is selected
        if (currentBucket) {
            post('/add-words-form', {
                bucket: currentBucket, // Pass the selected bucket title
                words: wordList, // Pass the list of words
            });
        }
    };
    
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-semibold text-gray-800">
                    Add Words to Word Bucket
                </h2>
            }
        >
            <Head title="Write Essay" />

            <div className="flex items-center justify-center mt-12">
                <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
                    <h1 className="text-xl font-semibold mb-4 text-center">
                        Choose a Word Bucket
                    </h1>
                    <form onSubmit={handleStartEssay} className="space-y-4">
                        <div>
                            <label htmlFor="word-bucket" className="block text-sm font-medium mb-2">
                                Select a Word Bucket:
                            </label>
                            <select
                                id="word-bucket"
                                onChange={handleBucketChange}
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            >
                                <option value="">-- Select a Word Bucket --</option>
                                {wordBuckets.map((bucket) => (
                                    <option key={bucket.id} value={bucket.id}>
                                        {bucket.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {currentBucket && (
                            <div className="mt-6">
                                <h2 className="text-lg font-semibold text-center">
                                    You selected: {currentBucket}
                                </h2>
                                <h3 className="text-md mt-4 font-medium">Words in this Bucket:</h3>
                                <ul className="list-disc pl-6 mt-2 space-y-1">
                                    {wordList.length > 0 ? (
                                        wordList.map((word, index) => (
                                            <li key={index} className="text-gray-700">
                                                {word.word}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-gray-500">No words available.</li>
                                    )}
                                </ul>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="mt-4 w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    {processing ? 'Loading...' : 'Start Adding Words'}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
