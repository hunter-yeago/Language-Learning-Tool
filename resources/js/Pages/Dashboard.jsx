// Main component file: BucketsDashboard.jsx
import { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import BucketSelector from '@/components/bucket-dashboard/BucketSelector';
import EssaySelector from '@/components/bucket-dashboard/EssaySelector';
import ActionButtons from '@/components/bucket-dashboard/ActionButtons';
import BucketDisplay from '@/components/bucket-dashboard/BucketDisplay';
import CreateBucketForm from '@/components/bucket-dashboard/CreateBucketForm';
import TutorReviewButton from '@/components/bucket-dashboard/TutorReviewButton';

export default function Dashboard({ essays, buckets, bucketID }) {
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
    // todo: do I really need to set up the inputs like this... could I instead use the name attributes on the html elements?

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

    function handleBucketChange(bucketId) {
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

    function handleEssayChange(title) {
        const selectedEssay = essays.find(e => e.title === title) || null;
        setCurrentEssay(selectedEssay);

        if (selectedEssay) {
            setData('essay', {
                title: selectedEssay.title,
                content: selectedEssay.content,
                words: selectedEssay.words,
            });
        }
    }

    function handleWriteEssayPage(e) {
        e.preventDefault();
        if (data.bucket) {
            post(route('write-essay'), {
                bucket: data.bucket,
            });
        }
    }

    function handleAddWords(e) {
        e.preventDefault();
        if (data.bucket.id) {
            post(route('add-words-page'), {
                bucket_id: data.bucket.id,
                words: data.bucket.words,
            });
        }
    }

    function handleCreateNewBucket(e) {
        e.preventDefault();
        post(route('store-bucket'), {
            title: data.bucket.title,
            description: data.bucket.description,
        });
    }

    function handleStartTutorReview(e) {
        post(route('tutor-essay-page'), { essay: data.essay });
    }

    function updateBucketData(bucketData) {
        setData('bucket', bucketData);
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>}
        >
            <Head title="Word Buckets Dashboard" />

            <section className="min-h-[500px] py-12 mx-auto max-w-7xl sm:px-6 lg:px-8 grid grid-cols-1 gap-6 md:grid-cols-2">

                {/* Left Box - Bucket & Essay Selectors */}
                <article className="p-6 min-h-full bg-white shadow-sm sm:rounded-lg flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-center mb-6">Existing Word Buckets</h2>
                        <BucketSelector 
                            buckets={buckets} 
                            currentBucketId={currentBucket?.id} 
                            onBucketChange={handleBucketChange} 
                        />

                        <ActionButtons 
                            onAddWords={handleAddWords} 
                            onWriteEssayPage={handleWriteEssayPage} 
                            processing={processing} 
                        />

                        <h2 className="text-xl font-semibold text-center mt-6 mb-2">Existing Essays</h2>
                        <EssaySelector 
                            essays={essays} 
                            currentEssayTitle={currentEssay?.title} 
                            onEssayChange={handleEssayChange} 
                        />

                        {currentEssay && (
                            <TutorReviewButton onReview={handleStartTutorReview} />
                        )}
                    </div>

                </article>

                {/* Right Box - Bucket Info / Create New Bucket */}
                <div className="bg-gray-50 p-6 rounded-md border border-gray-300">
                    {currentBucket ? (
                        <BucketDisplay bucket={currentBucket} />
                    ) : (
                        isCreatingNew ? (
                            <CreateBucketForm 
                                bucketData={data.bucket} 
                                onUpdateBucketData={updateBucketData} 
                                onSubmit={handleCreateNewBucket} 
                                onCancel={() => setIsCreatingNew(false)} 
                                processing={processing} 
                            />
                        ) : (
                            <div className="bg-gray-50 p-6 rounded-md border border-gray-300 flex justify-center">
                                <button 
                                    onClick={() => setIsCreatingNew(true)} 
                                    className="min-w-48 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Create New Bucket
                                </button>
                            </div>
                        )
                    )}
                </div>

                
            </section>
        </AuthenticatedLayout>
    );
}