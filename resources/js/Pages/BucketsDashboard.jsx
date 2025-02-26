import { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function BucketsDashboard({ essays, buckets, bucketID }) {
    const { data, setData, post, processing } = useForm({
        bucket: {
            id: null,
            title: '',
            description: '',
            words: [],
        },
        essay: {
            title: '',
            content: '',
            words: [],
        },
    });

    const [currentBucket, setCurrentBucket] = useState(null);
    const [currentEssay, setCurrentEssay] = useState(null);
    const [isCreatingNew, setIsCreatingNew] = useState(false);

    // Set the bucket when the component mounts
    useEffect(() => {
        if (bucketID && buckets) {
            const selectedBucket = buckets.find(b => b.id === parseInt(bucketID));
            if (selectedBucket) {
                setCurrentBucket(selectedBucket);
                setData('bucket', {
                    id: selectedBucket.id,
                    title: selectedBucket.title,
                    description: selectedBucket.description,
                    words: selectedBucket.words,
                });
            }
        }
    }, [bucketID, buckets]);

    function handleBucketChange(event) {
        const bucketId = parseInt(event.target.value);
        const selectedBucket = buckets.find(b => b.id === bucketId) || null;
        
        setCurrentBucket(selectedBucket);

        if (selectedBucket) {
            setData('bucket', {
                id: selectedBucket.id,
                title: selectedBucket.title,
                description: selectedBucket.description,
                words: selectedBucket.words,
            });
        }
    }

    function handleEssayChange(event) {
        const essayTitle = event.target.value;
        const selectedEssay = essays.find(e => e.title === essayTitle) || null;

        setCurrentEssay(selectedEssay);

        if (selectedEssay) {
            setData('essay', {
                title: selectedEssay.title,
                content: selectedEssay.content,
                words: selectedEssay.words,
            });
        }
    }

    function handleStartEssay(e) {
        e.preventDefault();
        if (data.bucket) {
            post(route('start-essay'), {
                bucket: data.bucket,
            });
        }
    }

    function handleAddWords(e) {
        e.preventDefault();
        if (data.bucket.id) {
            post(route('start-adding-words'), {
                bucket_id: data.bucket.id,
                words: data.bucket.words,
            });
        }
    }

    function handleCreateNewBucket(e) {
        console.log('firing');
        console.log('data', data.bucket)
        e.preventDefault();
        post(route('store-bucket'), {
            title: data.bucket.title,
            description: data.bucket.description,
        });
    }

    function handleStartTutorReview(e){
        post(route('tutor-essay-page'), { essay: data.essay });

    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>}
        >
            <Head title="Word Buckets Dashboard" />

            <section className="min-h-[500px] py-12 mx-auto max-w-7xl sm:px-6 lg:px-8 grid grid-cols-1 gap-6 md:grid-cols-2">

                {/* Left Box - Bucket & Essay Selectors */}
                <article className="p-6 min-h-full bg-white shadow-sm sm:rounded-lg flex flex-col justify-between">

                    {/* Word Bucket Selector */}
                    <div>
                        <h2 className="text-xl font-semibold text-center mb-6">Existing Word Buckets</h2>
                        <label htmlFor="bucket" className="block text-sm font-medium mb-2">Select a Word Bucket:</label>
                        <select
                            id="bucket"
                            onChange={handleBucketChange}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                            value={currentBucket?.id || ''}
                        >
                            <option value="">-- Select a Word Bucket --</option>
                            {buckets.map((bucket) => (
                                <option key={bucket.id} value={bucket.id}>{bucket.title}</option>
                            ))}
                        </select>

                        {/* Essay Selector */}
                        <h2 className="text-xl font-semibold text-center mt-6 mb-2">Existing Essays</h2>
                        <label htmlFor="essay" className="block text-sm font-medium mb-2">Select an Essay:</label>
                        <select
                            id="essay"
                            onChange={handleEssayChange}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                            value={currentEssay?.title || ''}
                        >
                            <option value="">-- Select an Essay --</option>
                            {essays.map((essay, index) => (
                                <option key={index} value={essay.title}>{essay.title}</option>
                            ))}
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={handleAddWords}
                            disabled={processing}
                            className="w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                            {processing ? 'Loading...' : 'Add Words'}
                        </button>

                        <button
                            onClick={handleStartEssay}
                            disabled={processing}
                            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            {processing ? 'Loading...' : 'Start Essay'}
                        </button>
                    </div>
                </article>

                {/* Right Box - Bucket Info / Create New Bucket */}
                <div className="bg-gray-50 p-6 rounded-md border border-gray-300">
                    {currentBucket ? (
                        <>
                            <h2 className="text-lg font-semibold text-center">You selected: {currentBucket.title}</h2>
                            <h3 className="text-md mt-4 font-medium">Words in this Bucket:</h3>
                            <ul className="flex flex-wrap gap-5 mt-2 list-disc">
                                {Array.isArray(currentBucket.words) && currentBucket.words.length > 0 ? (
                                    currentBucket.words.map((word, index) => (
                                        <li key={index} className="text-gray-700">{word.word}</li>
                                    ))
                                ) : (
                                    <li className="text-gray-500">No words available.</li>
                                )}
                            </ul>
                        </>
                    ) : (
                        isCreatingNew ? (
                            <div className="bg-gray-50 p-6 rounded-md border border-gray-300">
                                <h2 className="text-lg font-semibold text-center">New Word Bucket</h2>
                                <form onSubmit={handleCreateNewBucket}>
                                    <label htmlFor="title" className="block text-sm font-medium mb-2">Title:</label>
                                    <input
                                        type="text"
                                        id="title"
                                        className="w-full p-2 border rounded-md mb-4"
                                        value={data.bucket.title}
                                        onChange={e => setData('bucket', { ...data.bucket, title: e.target.value })}
                                        required
                                    />
                                    <label htmlFor="description" className="block text-sm font-medium mb-2">Description (Optional):</label>
                                    <textarea
                                        id="description"
                                        className="w-full p-2 border rounded-md"
                                        value={data.bucket.description}
                                        onChange={e => setData('bucket', { ...data.bucket, description: e.target.value })}
                                    />
                                    <div className="flex gap-4 mt-6 justify-center">
                                        <button type="submit" disabled={processing} className="w-48 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Create</button>
                                        <button type="button" onClick={() => setIsCreatingNew(false)} className="w-48 p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-6 rounded-md border border-gray-300 flex justify-center">
                                <button onClick={() => setIsCreatingNew(true)} className="min-w-48 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Create New Bucket</button>
                            </div>
                                
                        )
                    )}
                </div>

                {currentEssay && 
                    <div className="bg-gray-50 p-6 rounded-md border border-gray-300">
                        <button onClick={() => handleStartTutorReview()} className="min-w-48 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Start Tutor Essay Review</button>
                    </div>
                }
            </section>
        </AuthenticatedLayout>
    );
}
