import { useState } from 'react'

export default function CreateBucketForm({ bucketData, setData, post, data, onCancel, processing }) {
  function handleCreateNewBucket(e) {
    e.preventDefault()
    post(route('student.store-bucket'), {
      title: data.bucket.title,
      description: data.bucket.description,
    })
  }

  const [isCreatingNew, setIsCreatingNew] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setData('bucket', { ...bucketData, [name]: value })
  }

  if (!isCreatingNew) {
    return (
      <div className="bg-neutral-50 p-12 rounded-lg border-2 border-dashed border-neutral-300 flex justify-center">
        <button onClick={() => setIsCreatingNew(true)} className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
          Create New Word Bucket
        </button>
      </div>
    )
  }

  return (
    <div className="bg-neutral-50 p-8 rounded-lg border border-neutral-300">
      <h2 className="text-2xl font-semibold text-center text-neutral-900 mb-6">Create Word Bucket</h2>
      <form className="max-w-md mx-auto" onSubmit={handleCreateNewBucket}>
        <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
          Bucket Title
        </label>
        <input type="text" id="title" name="title" className="w-full px-4 py-2.5 border border-neutral-300 rounded-md mb-6 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition" value={bucketData.title} onChange={handleChange} required />
        <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
          Description (Optional)
        </label>
        <textarea id="description" name="description" rows="3" className="w-full px-4 py-2.5 border border-neutral-300 rounded-md mb-6 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition" value={bucketData.description} onChange={handleChange} />
        <div className="flex gap-3 mt-6 justify-center">
          <button type="submit" disabled={processing} className="px-6 py-2.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
            Create Bucket
          </button>
          <button type="button" onClick={onCancel} className="px-6 py-2.5 border border-neutral-300 bg-white text-neutral-700 rounded-md hover:bg-neutral-50 font-medium transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
