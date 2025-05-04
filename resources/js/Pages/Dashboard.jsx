import { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import ExistingWordBuckets from '@/Components/dashboard/ExistingWordBuckets';
import ExistingEssays from '@/Components/dashboard/ExistingEssays';
import ActionButton from '@/Components/dashboard/ActionButton';
import BucketDisplay from '@/Components/dashboard/BucketDisplay';
import CreateBucketForm from '@/Components/dashboard/CreateBucketForm';

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

    const [currentBucket, setCurrentBucket] = useState(null);

    // Set the bucket when the component mounts
    useEffect(() => {
        const previousBucket = buckets.find(b => b.id === parseInt(bucketID));
        if (bucketID && previousBucket) {
            setCurrentBucket(previousBucket);
            setData('bucket', {
                id: previousBucket.id,
                title: previousBucket.title,
                description: previousBucket.description,
                words: previousBucket.words,
            });
        }
    }, [bucketID, buckets]);

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

    function handleStartTutorReview() {
        post(route('tutor-essay-page'), { essay: data.essay });
    }

    return (
        <AuthenticatedLayout
            header={<h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>}
        >
        <Head title="Dashboard"/>

            <section className="min-h-[500px] py-12 mx-auto max-w-7xl sm:px-6 lg:px-8 grid grid-cols-1 gap-6 md:grid-cols-2">

                {/* Left Box - Bucket & Essay Selectors */}
                <article className="p-6 min-h-full bg-white shadow-sm sm:rounded-lg flex flex-col justify-between">
                    <ExistingWordBuckets 
                        buckets={buckets} 
                        currentBucketId={currentBucket?.id} 
                        setCurrentBucket={setCurrentBucket}
                        setData={setData}
                    />

                    <div className="flex gap-4">
                        <ActionButton 
                            onClick={handleAddWords} 
                            processing={processing} 
                            color="green"
                            text="Add Words"
                        />

                        <ActionButton 
                            onClick={handleWriteEssayPage} 
                            processing={processing} 
                            color="blue"
                            text="Write Essay"
                        />
                    </div>

                    <ExistingEssays 
                        essays={essays} 
                        setData={setData} 
                        processing={processing}
                        handleStartTutorReview={handleStartTutorReview}
                    />
                </article>

                <aside className="bg-gray-50 p-6 rounded-md border border-gray-300">
                    {currentBucket && <BucketDisplay bucket={currentBucket} />} 
                    {!currentBucket && <CreateBucketForm 
                        bucketData={data.bucket} 
                        setData={setData} 
                        onSubmit={handleCreateNewBucket} 
                        onCancel={() => setIsCreatingNew(false)} 
                        processing={processing} 
                    />} 
                </aside>

            </section>
        </AuthenticatedLayout>
    );
}