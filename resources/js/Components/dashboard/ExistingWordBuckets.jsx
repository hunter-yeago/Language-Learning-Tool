export default function ExistingWordBuckets({ buckets, currentBucketId, setCurrentBucket, setData }) {

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

    return (
        <div>

        <h2 className="text-xl font-semibold text-center mb-6">Existing Word Buckets</h2>

            <label htmlFor="bucket" className="block text-sm font-medium mb-2">Select a Word Bucket:</label>
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
        </div>
    );
}