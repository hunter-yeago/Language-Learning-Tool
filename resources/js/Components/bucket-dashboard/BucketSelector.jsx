export default function BucketSelector({ buckets, currentBucketId, onBucketChange }) {
    function handleChange(event) {
        const bucketId = parseInt(event.target.value);
        onBucketChange(bucketId);
    }

    return (
        <div>
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