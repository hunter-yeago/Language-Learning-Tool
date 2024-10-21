// resources/js/Pages/WriteEssay.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

export default function WriteEssay({ wordBuckets }) {
    const [selectedBucket, setSelectedBucket] = useState(null);
    const [selectedWords, setSelectedWords] = useState([]);

    const handleBucketChange = (event) => {
        const bucketId = event.target.value;
        const bucket = wordBuckets.find((b) => b.id === parseInt(bucketId));

        if (bucket) {
            setSelectedBucket(bucket.title); // Save selected bucket title
            setSelectedWords(bucket.words);  // Save the words associated with the bucket
        } else {
            setSelectedBucket(null);
            setSelectedWords([]);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-semibold text-gray-800">
                    Write an Essay
                </h2>
            }
        >
            <div className="flex items-center justify-center mt-12">
                <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
                    <h1 className="text-xl font-semibold mb-4 text-center">
                        Choose a Word Bucket
                    </h1>
                    <div className="mb-6">
                        <label htmlFor="word-bucket" className="block text-sm font-medium mb-2">
                            Select a Word Bucket:
                        </label>
                        <select
                            id="word-bucket"
                            onChange={handleBucketChange}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">-- Select a Word Bucket --</option>
                            {wordBuckets.map((bucket) => (
                                <option key={bucket.id} value={bucket.id}>
                                    {bucket.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedBucket && (
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold text-center">
                                You selected: {selectedBucket}
                            </h2>
                            <h3 className="text-md mt-4 font-medium">Words in this Bucket:</h3>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                {selectedWords.length > 0 ? (
                                    selectedWords.map((word) => (
                                        <li key={word.id} className="text-gray-700">
                                            {word.word}
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-500">No words available.</li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
