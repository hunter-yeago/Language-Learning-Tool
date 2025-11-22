import { Bucket, BucketData } from '@/types/bucket'

interface ExistingWordBucketsProps<T = any> {
  buckets: Bucket<T>[];
  currentBucketId: number | null;
  setCurrentBucket: (bucket: Bucket<T> | null) => void;
  setData: (key: string, value: BucketData) => void;
  data: {
    bucket: BucketData;
  };
  post: (url: string, data: any) => void;
  processing: boolean;
}

export default function ExistingWordBuckets<T = any>({ buckets, currentBucketId, setCurrentBucket, setData }: ExistingWordBucketsProps<T>) {
  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
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
