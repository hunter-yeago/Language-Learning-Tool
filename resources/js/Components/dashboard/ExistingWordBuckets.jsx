import ActionButton from "./ActionButton";

export default function ExistingWordBuckets({ buckets, currentBucketId, setCurrentBucket, setData, data, post, processing }) {

    function handleChange(event) {
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

    return (
        <section className="flex flex-col gap-4">
            <label htmlFor="bucket" className="text-xl font-semibold text-center">Existing Word Buckets</label>
            <select
                id="bucket"
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                value={currentBucketId || ''}
            >
                <option value="">-- Select a Word Bucket --</option>
                {buckets.map((bucket) => (
                    <option key={bucket.id} value={bucket.id}>{bucket.title}</option>
                ))}
            </select>

            <div className="flex justify-center gap-4">
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
        </section>
    );
}