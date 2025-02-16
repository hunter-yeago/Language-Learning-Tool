import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react'; // Make sure you're importing useForm
import WordBank from "@/Pages/WordBank.jsx";

export default function StartEssay({ bucket, words }) {
    const { data, setData, post, processing } = useForm({
        title: '', // Manage essay title
        content: '', // Manage essay content
        bucket_id: bucket.id, // Bucket ID to associate with the essay
    });

    const [essay, setEssay] = useState('');
    const [wordList, setWordList] = useState(words);
    const [usedWords, setUsedWords] = useState([]);

    // Update when words change
    useEffect(() => {
        setWordList(words); 
    }, [words]);

    // Handle essay content change
    function handleTextChange(e) {
        const newEssay = e.target.value;
        setEssay(newEssay);
        const wordsInEssay = checkForUsedWords(newEssay);
        setUsedWords(wordsInEssay);
        setData('content', newEssay); // Update essay content in the form
    }

    // Check for used words in the essay
    function checkForUsedWords(userEssay) {
        return wordList.filter(word => new RegExp(`\\b${word.word}\\b`).test(userEssay.toLowerCase()));
    }

    // Handle form submit (create new essay)
    function handleSubmit(e) {
        e.preventDefault();

        // Update times_used with used words (if necessary)
        const updatedWordList = wordList.map(word => {
            if (usedWords.includes(word)) {
                return { ...word, times_used: word.times_used + 1 }; // Increment the used word count
            }
            return word;
        });

        console.log('the data', data);
        // Send the essay data to the backend
        post(route('store-essay'), {
            title: data.title,
            content: data.content,
            bucket_id: data.bucket_id, // Attach bucket ID to the essay
            used_words: updatedWordList, // Optional: You can update the word list as well if needed
        });
    }

    return (
        <AuthenticatedLayout header={<h2 className="text-2xl font-semibold text-gray-800">Write Your Essay</h2>}>

            {/* External Container */}
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
                        {/* Title Input */}
                        <input
                            type="text"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)} // Update the title in the form
                            placeholder="Essay Title"
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        {/* Text Area */}
                        <textarea
                            value={essay}
                            onChange={handleTextChange}
                            rows="10"
                            placeholder="Start writing your essay here..."
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        ></textarea>

                        {/* Submit Button */}
                        <button className="w-1/2 p-2 bg-green-500 text-white rounded-md hover:bg-green-600" type="submit" disabled={processing}>
                            {processing ? 'Submitting...' : 'Submit Essay'}
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
