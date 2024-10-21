import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

export default function StartEssay({ bucket, words = [] }) {
    const [essayText, setEssayText] = useState('');

    const handleTextChange = (event) => {
        setEssayText(event.target.value);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-semibold text-gray-800">
                    Write Your Essay
                </h2>
            }
        >
            <div className="flex items-center justify-center mt-12">
                <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Bucket: {bucket}</h3>
                    <h4 className="font-medium mb-2">Word Bank:</h4>
                    <ul className="pl-6 mb-4 flex gap-3">
                        {words.length > 0 ? (
                            words.map((word, index) => (
                                <li key={index} className="text-gray-700">
                                    {word.word}
                                </li>
                            ))
                        ) : (
                            <li className="text-gray-500">No words available.</li>
                        )}
                    </ul>

                    <textarea
                        value={essayText}
                        onChange={handleTextChange}
                        rows="10"
                        placeholder="Start writing your essay here..."
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    ></textarea>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
