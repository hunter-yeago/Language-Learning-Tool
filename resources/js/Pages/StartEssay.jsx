import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState, useEffect } from 'react';
import WordBank from "@/Pages/WordBank.jsx";
export default function StartEssay({ bucket, words = [] }) {

    // Matched words
    const [usedWords, setUsedWords] = useState([]);

    // Essay text
    const [essay, setEssay] = useState('');

    // Word list (initialize with words from props)
    const [wordList, setWordList] = useState(words.map(word => word.word.toLowerCase()));

    useEffect(() => {
        setWordList(words.map(word => word.word.toLowerCase())); // Update when words change
    }, [words]);

    const handleSubmit = (e) => {

        // -- not necessarily in this function but create whatever setting is necessary for keeping track
        // of the words that are used
        // --attempted
        // --used

        e.preventDefault();

        // console.log('api route', `/word_buckets/${bucket.id}/add-new-words`)
        post(`/word_buckets/${bucket.id}/add-new-words`, {
            data: { words: wordList },
            onSuccess: () => {
                setWordList([]);
                setData('words', []);
            },
            onError: (error) => console.error('Error adding words:', error),
        });
    };

    const handleTextChange = (event) => {
        const newEssay = event.target.value;
        setEssay(newEssay);
        checkForUsedWords(newEssay);
    };

    function checkForUsedWords(userEssay) {
        const lowerCaseEssay = userEssay.toLowerCase();

        console.log('lowerCaseEssay', lowerCaseEssay)

        // Find matching words
        const words = wordList.filter(word =>
            new RegExp(`\\b${word}\\b`).test(lowerCaseEssay)
        );

        console.log('foundWords', words)

        setUsedWords(words);
    }

    return (
        <AuthenticatedLayout header={<h2 className="text-2xl font-semibold text-gray-800">Write Your Essay</h2>}>
            <div className="flex items-center justify-center mt-12 max-w-[1200px]">
                <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Bucket: {bucket.title}</h3>
                    <WordBank
                        wordBankWords={wordList}
                        usedWords={usedWords}
                        wordBankTitle={bucket.title}
                    />

                    <textarea
                        value={essay}
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
