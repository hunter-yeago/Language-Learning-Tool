import ActionButton from './ActionButton'

export default function ExistingWordBuckets({ buckets, currentBucketId, setCurrentBucket, setData, data, post, processing }) {
  function handleChange(event) {
    const bucketId = parseInt(event.target.value)
    const selectedBucket = buckets.find((b) => b.id === bucketId) || null

    setCurrentBucket(selectedBucket)

    if (selectedBucket) {
      setData('bucket', {
        id: selectedBucket.id,
        title: selectedBucket.title,
        description: selectedBucket.description,
        words: selectedBucket.words,
      })
    }
  }

  return (
    <section className="flex items-center justify-between gap-4">
      <label htmlFor="bucket" className="text-xl font-semibold text-center">
        Buckets
      </label>
      <select
        id="bucket"
        onChange={handleChange}
        className="pl-4 pr-10 w-fit border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
        value={currentBucketId || ''}
      >
        <option value="">-- Select a Word Bucket --</option>
        {buckets.map((bucket) => (
          <option key={bucket.id} value={bucket.id}>
            {bucket.title}
          </option>
        ))}
      </select>
    </section>
  )
}
