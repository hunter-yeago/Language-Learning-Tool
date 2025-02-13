import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState, useEffect } from 'react';
import WordBank from "@/Pages/WordBank.jsx";
export default function StartEssay({ bucket, words = [] }) {

    // Matched words
    const [matchedWords, setMatchedWords] = useState([]);

    // Essay text
    const [essay, setEssay] = useState('');

    // Word list (initialize with words from props)
    const [wordList, setWordList] = useState(words.map(word => word.word.toLowerCase()));

    useEffect(() => {
        setWordList(words.map(word => word.word.toLowerCase())); // Update when words change
    }, [words]);

    const handleTextChange = (event) => {
        const newEssay = event.target.value;
        setEssay(newEssay);
        checkForMatchedWords(newEssay);
    };

    function checkForMatchedWords(userEssay) {
        const lowerCaseEssay = userEssay.toLowerCase();

        console.log('lowerCaseEssay', lowerCaseEssay)

        // Find matching words
        const words = wordList.filter(word =>
            new RegExp(`\\b${word}\\b`).test(lowerCaseEssay)
        );

        console.log('foundWords', words)

        setMatchedWords(words);
    }

    return (
        <AuthenticatedLayout header={<h2 className="text-2xl font-semibold text-gray-800">Write Your Essay</h2>}>
            <div className="flex items-center justify-center mt-12 max-w-[1200px]">
                <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Bucket: {bucket.title}</h3>
                    <WordBank
                        wordBankWords={wordList}
                        matchedWords={matchedWords}
                        wordBankTitle={bucket.title}
                    />

                    <textarea
                        value={essay}
                        onChange={handleTextChange}
                        rows="10"
                        placeholder="Start writing your essay here..."
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    ></textarea>

                    <h4 className="font-medium mt-4">Matched Words:</h4>
                    <ul className="pl-6 mt-2">
                        {matchedWords.length > 0 ? (
                            matchedWords.map((word, index) => (
                                <li key={index} className="text-green-700">{word}</li>
                            ))
                        ) : (
                            <li className="text-gray-500">No matched words yet.</li>
                        )}
                    </ul>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
