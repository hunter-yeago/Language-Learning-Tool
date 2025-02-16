import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import WordBank from "@/Pages/WordBank.jsx";

export default function StartEssay({ bucket, words }) {
    const [title, setTitle] = useState('');
    const [essay, setEssay] = useState('');
    const [wordList, setWordList] = useState(words);
    const [usedWords, setUsedWords] = useState([]);

    const { data, setData, post, processing } = useForm({
        title: '', // Manage essay title
        content: '', // Manage essay content
        bucket_id: bucket.id, // Bucket ID to associate with the essay
        used_words: [], // Initialize as an empty array
    });

    // Update word list when words prop changes
    useEffect(() => {
        setWordList(words);
    }, [words]);

    function handleTitleChange(e) {
        setData('title', e.target.value);
        setTitle(e.target.value); // Local state for title
    }

    // Handle essay content change
    function handleTextChange(e) {
        const newEssay = e.target.value;
        setEssay(newEssay);
        setData('content', newEssay);
        const wordsInEssay = checkForUsedWords(newEssay);
        setUsedWords(wordsInEssay);
        
        setData(prevData => {
            const newData = {
                ...prevData,
                content: e.target.value,
                used_words: wordsInEssay
            };
            console.log('Updated data:', newData);
            return newData;
        });
        
        
        // setData('used_words', wordsInEssay);
    }

    // Check for used words in the essay using word boundaries
    function checkForUsedWords(userEssay) {
        return wordList.filter(word => {
            const wordRegex = new RegExp(`\\b${word.word}\\b`, 'i'); // Case-insensitive word boundary matching
            return wordRegex.test(userEssay); // Match the word anywhere in the essay text
        });
    }

    // Handle form submit (create new essay)
    function handleSubmit(e) {
        e.preventDefault();
    
        console.log('About to submit this data:', {
            title: data.title,
            content: data.content,
            bucket_id: data.bucket_id,
            used_words: data.used_words
        });
    
        post(route('store-essay'), data);
    }

    return (
        <AuthenticatedLayout header={<h2 className="text-2xl font-semibold text-gray-800">Write Your Essay</h2>}>
            <div className="flex items-center justify-center mt-12 max-w-[1200px]">
                <div className="flex flex-col items-center gap-2 w-full max-w-md p-6 bg-white shadow-md rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Bucket: {bucket.title}</h3>

                    <WordBank
                        words={wordList}
                        usedWords={usedWords}
                        wordBankTitle={bucket.title}
                    />

                    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2 w-full">
                        <input
                            type="text"
                            value={title}
                            onChange={handleTitleChange} // Update the title in the form
                            placeholder="Essay Title"
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <textarea
                            value={essay}
                            onChange={handleTextChange}
                            rows="10"
                            placeholder="Start writing your essay here..."
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        ></textarea>

                        <button className="w-1/2 p-2 bg-green-500 text-white rounded-md hover:bg-green-600" type="submit" disabled={processing}>
                            {processing ? 'Submitting...' : 'Submit Essay'}
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
