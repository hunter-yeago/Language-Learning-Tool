import { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import ExistingWordBuckets from '@/Components/dashboard/ExistingWordBuckets';
import ExistingEssays from '@/Components/dashboard/ExistingEssays';
import BucketDisplay from '@/Components/dashboard/BucketDisplay';
import CreateBucketForm from '@/Components/dashboard/CreateBucketForm';

export default function TutorReviewPage({ essays, buckets, bucketID }) {
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

    return (
        <AuthenticatedLayout
            header={<h1 className="text-2xl font-semibold text-gray-800">Tutor Review Page</h1>}
        >
        <Head title="Tutor Review Page"/>

            <div className="min-h-[400px]">
                <article className="border p-6 min-h-full bg-white shadow-md rounded-lg flex flex-col gap-10">
                  this is the tutor review page - just threw the dashboard boiler plate in here and will soon cut out the bucket stuff
                    <ExistingWordBuckets 
                        buckets={buckets} 
                        currentBucketId={currentBucket?.id} 
                        setCurrentBucket={setCurrentBucket}
                        data={data}
                        post={post}
                        setData={setData}
                        processing={processing}
                    />           

                    <ExistingEssays 
                        essays={essays} 
                        setData={setData} 
                        data={data}
                        post={post}
                        processing={processing}
                    />
                </article>

                <aside className="bg-white p-6 shadow-md rounded-lg border">
                    {currentBucket && <BucketDisplay bucket={currentBucket} />} 
                    {!currentBucket && <CreateBucketForm 
                        bucketData={data.bucket} 
                        setData={setData} 
                        post={post}
                        data={data}
                        onCancel={() => setIsCreatingNew(false)} 
                        processing={processing} 
                    />} 
                </aside>

            </div>
        </AuthenticatedLayout>
    );
}