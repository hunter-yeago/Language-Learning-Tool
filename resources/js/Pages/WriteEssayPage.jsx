import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import WordBank from "@/Components/word-bank/WordBank.jsx";

export default function WriteEssayPage({ bucket, words }) {
    const [title, setTitle] = useState('');
    const [essay, setEssay] = useState('');
    const [wordList, setWordList] = useState(words);
    const [usedWords, setUsedWords] = useState([words]);
    const [notUsedWords, setNotUsedWords] = useState([]);

    const { data, setData, post, processing } = useForm({
        title: '', 
        content: '', 
        bucket_id: bucket.id, 
        used_words: [],
        not_used_words: [], 
    });
    
    useEffect(() => {
        setWordList(words);
    }, [words]);

    function handleTitleChange(e) {
        setData('title', e.target.value);
        setTitle(e.target.value); 
    }
    
    function handleTextChange(e) {
        
        setEssay(e.target.value);
        setData('content', e.target.value);
        const wordsInEssay = checkForUsedWords(e.target.value);
        setUsedWords(wordsInEssay);
        setNotUsedWords(
            words.filter(word => !usedWords.includes(word))
        )
        
        setData(prevData => {
            const newData = {
                ...prevData,
                content: e.target.value,
                used_words: wordsInEssay,
                not_used_words: notUsedWords
            };
            return newData;
        });
    }

    function checkForUsedWords(userEssay) {
        return wordList.filter(word => {
            const wordRegex = new RegExp(`\\b${word.word}\\b`, 'i'); 
            return wordRegex.test(userEssay); 
        });
    }
    
    function handleSubmit(e) {
        e.preventDefault();
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
                            onChange={handleTitleChange} 
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
