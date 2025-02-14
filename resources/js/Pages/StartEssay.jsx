import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState, useEffect } from 'react';
import WordBank from "@/Pages/WordBank.jsx";
export default function StartEssay({ bucket, words }) {

    const [essay, setEssay] = useState('');
    const [wordList, setWordList] = useState(words);
    const [usedWords, setUsedWords] = useState([]);

    // problem ... will increase even when testing around with word banks
    // incremenet attemps by 1 - indicates that its been used in a word bank before
    wordList.forEach(word => { word.attempts += 1; });

    useEffect(() => {
        setWordList(words); // Update when words change
    }, [words]);

    function handleSubmit (e) {
        e.preventDefault();

        // update times_used with used words
        const theUsedWordsOnSubmit = wordList.map((word) => {

            if (usedWords.includes(word)) return {...word, times_used: word.times_used + 1};
            return word;
            
        })

        // console.log('api route', `/word_buckets/${bucket.id}/add-new-words`)
        // post(`/word_buckets/${bucket.id}/add-new-words`, {
        //     data: { words: wordList },
        //     onSuccess: () => {
        //         setWordList([]);
        //         setData('words', []);
        //     },
        //     onError: (error) => console.error('Error adding words:', error),
        // });
    };

    function handleTextChange (e) {
        setEssay(e.target.value);
        const words = checkForUsedWords(e.target.value);
        setUsedWords(words);
    };

    function checkForUsedWords(userEssay) {
        return  wordList.filter(word => new RegExp(`\\b${word.word}\\b`).test(userEssay.toLowerCase()));      
    }

    return (
        <AuthenticatedLayout header={<h2 className="text-2xl font-semibold text-gray-800">Write Your Essay</h2>}>

            {/* External  Container */}
            <div className="flex items-center justify-center mt-12 max-w-[1200px]">

                {/* Internal Container */}
                <div className="flex flex-col items-center gap-2 w-full max-w-md p-6 bg-white shadow-md rounded-lg">
                    
                    {/* Title */}
                    <h3 className="text-lg font-semibold mb-4">Bucket: {bucket.title}</h3>

                    {/* WordBank */}
                    <WordBank
                        words={wordList}
                        usedWords={usedWords}
                        wordBankTitle={bucket.title}
                    />

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2 w-full">
                
                    {/* Text Area */}
                    <textarea
                        value={essay}
                        onChange={handleTextChange}
                        rows="10"
                        placeholder="Start writing your essay here..."
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    ></textarea>

                    {/* Submit Button */}
                    <button className='w-1/2 p-2 bg-green-500 text-white rounded-md hover:bg-green-600' type="submit">Submit Essay</button>
                </form>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
