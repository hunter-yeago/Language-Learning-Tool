import { Bucket } from '@/types/bucket'

interface BucketDisplayProps {
  bucket: Bucket;
}

export default function BucketDisplay({ bucket }: BucketDisplayProps) {
  return (
    <>
      <h2 className="text-lg font-semibold text-center">You selected: {bucket.title}</h2>
      <h3 className="text-md mt-4 font-medium">Words in this Bucket:</h3>
      <ul className="flex flex-wrap gap-5 mt-2 list-disc">
        {Array.isArray(bucket.words) && bucket.words.length > 0 ? (
          bucket.words.map((word, index) => (
            <li key={index} className="text-gray-700">
              {word.word}
            </li>
          ))
        ) : (
          <li className="text-gray-500">No words available.</li>
        )}
      </ul>
    </>
  )
}
