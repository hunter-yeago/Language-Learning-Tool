import { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function BucketsDashboard({ buckets, bucketID }) {
    const { data, setData, post, processing } = useForm({
        bucket: null,
        words: [],
        title: '',
        description: '',
    });

    const [currentBucket, setCurrentBucket] = useState(null);
    const [isCreatingNew, setIsCreatingNew] = useState(false);

    // Set the bucket when the component mounts, using the bucketID from query parameters
    useEffect(() => {
        if (bucketID && buckets) {
            const selectedBucket = buckets.find(b => b.id === parseInt(bucketID));
            if (selectedBucket) {
                console.log(selectedBucket);
                setCurrentBucket(selectedBucket);
                setData({
                    bucket: selectedBucket,
                    words: selectedBucket.words,
                });
            }
        }
    }, [bucketID, buckets]);

    function handleBucketChange(event) {
        const bucketId = event.target.value;
        const bucket = buckets.find(b => b.id === parseInt(bucketId)) || null;
        setCurrentBucket(bucket);

        if (bucket) {
            console.log('bucket: ', bucket);
            setData({
                bucket: bucket,
                title: bucket.title,
                description: bucket.description,
                words: bucket ? bucket.words : [],
            });
        }

    }

    function handleStartEssay(e) {
        e.preventDefault();
        if (currentBucket) {
            post(route('start-essay'), {
                // to do - title and bucket here shouldnt be the same
                title: currentBucket.title,
                description: currentBucket.description,
                bucket: currentBucket.title,
                words: currentBucket.words,
            });
        }
    }

    function handleAddWords(e) {
        e.preventDefault();
        if (currentBucket) {
            post(route('start-adding-words'), {
                // to do - title and bucket here shouldnt be the same
                title: currentBucket.title,
                description: currentBucket.description,
                bucket: currentBucket.title,
                words: currentBucket.words,
            });
        }
    }

    function handleCreateNewBucket(e) {
        e.preventDefault();
        
        post(route('store-bucket'), {
            title: data.title,
            description: data.description,
        });
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>}
        >
            <Head title="Word Buckets Dashboard" />

            <section className="min-h-[500px] py-12 mx-auto max-w-7xl sm:px-6 lg:px-8 grid grid-cols-1 gap-6 md:grid-cols-2" aria-label="choose the word bucket you would like to edit or use to write an essay">

                {/* Left Box - Word Bucket Selector and Buttons */}
                <article className="p-6 min-h-full bg-white shadow-sm sm:rounded-lg flex flex-col justify-between">

                    {/* Word Bucket Selector */}
                    <div>
                        <h1 className="text-xl font-semibold text-center mb-6">Existing Word Buckets</h1>
                        <label htmlFor="bucket" className="block text-sm font-medium mb-2">Select a Word Bucket:</label>
                        <select
                            id="bucket"
                            onChange={handleBucketChange}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                            value={currentBucket?.id || ''} // Reflect the current bucket ID in the selector
                        >
                            <option value="" className="text-center">-- Select a Word Bucket --</option>
                            {buckets.map((bucket) => (
                                <option key={bucket.id} value={bucket.id}>{bucket.title}</option>
                            ))}
                        </select>
                    </div>

                    {/*Button / Choices*/}
                    <div className="flex gap-4 mt-6">

                        {/*Add Words*/}
                        <button
                            onClick={handleAddWords}
                            disabled={processing}
                            className="w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                            {processing ? 'Loading...' : 'Add Words'}
                        </button>

                        {/*Start Essay*/}
                        <button
                            onClick={handleStartEssay}
                            disabled={processing}
                            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            {processing ? 'Loading...' : 'Start Essay'}
                        </button>

                    </div>
                </article>

                {/* Right Box - Bucket Information */}
                <div className="bg-gray-50 p-6 rounded-md border border-gray-300">
                    {currentBucket ? (
                        <>
                            <h2 className="text-lg font-semibold text-center">You selected: {currentBucket.title}</h2>
                            <h3 className="text-md mt-4 font-medium">Words in this Bucket:</h3>
                            <ul className="flex flex-wrap gap-5 mt-2 list-disc">
                                {currentBucket.words.length > 0 ? (
                                    currentBucket.words.map((word, index) => (
                                        <li key={index} className="text-gray-700">{word.word}</li>
                                    ))
                                ) : (
                                    <li className="text-gray-500">No words available.</li>
                                )}
                            </ul>
                        </>
                    ) : (
                        <>
                            {isCreatingNew ? (
                                <div className="bg-gray-50 p-6 rounded-md border border-gray-300">
                                    <h2 className="text-lg font-semibold text-center">New Word Bucket</h2>
                                    <form onSubmit={handleCreateNewBucket}>
                                        <div>
                                            <label htmlFor="title" className="block text-sm font-medium mb-2">Title:</label>
                                            <input
                                                type="text"
                                                id="title"
                                                name="title"
                                                className="w-full p-2 border rounded-md mb-4"
                                                value={data.title ?? ""}
                                                onChange={e => setData('title', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="description" className="block text-sm font-medium mb-2">Description (Optional):</label>
                                            <textarea
                                                id="description"
                                                name="description"
                                                className="w-full p-2 border rounded-md"
                                                value={data.description ?? ""}
                                                onChange={e => setData('description', e.target.value)}
                                            />
                                        </div>
                                        <div className="flex gap-4 mt-6 justify-center">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="w-48 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                            >
                                                Create
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsCreatingNew(false)}
                                                className="w-48 p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div className="flex justify-center gap-6 items-center flex-col bg-gray-50 p-6 rounded-md border border-gray-300">
                                    <h2 className="text-lg font-semibold text-center">New Word Bucket</h2>
                                        <button
                                            onClick={() => setIsCreatingNew(true)}
                                            className="min-w-48 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                        >
                                            Create
                                        </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </AuthenticatedLayout>
    );
}
