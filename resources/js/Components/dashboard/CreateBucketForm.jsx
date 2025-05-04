import { useState } from "react";

export default function CreateBucketForm({ bucketData, setData, post, data, onCancel, processing }) {

    function handleCreateNewBucket(e) {
        e.preventDefault();
        post(route('store-bucket'), {
            title: data.bucket.title,
            description: data.bucket.description,
        });
    }
    
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    
    function handleChange(e) {
        const { name, value } = e.target;
        setData('bucket', { ...bucketData, [name]: value });
    }

    if(!isCreatingNew) {
        return (
            <div className="bg-gray-50 p-6 rounded-md border border-gray-300 flex justify-center">
            <button 
                onClick={() => setIsCreatingNew(true)} 
                className="min-w-48 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
                Create New Bucket
            </button>
        </div>
        )
    }

    return (
        <div className="bg-gray-50 p-6 rounded-md border border-gray-300">
            <h2 className="text-lg font-semibold text-center">New Word Bucket</h2>
            <form onSubmit={handleCreateNewBucket}>
                <label htmlFor="title" className="block text-sm font-medium mb-2">Title:</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    className="w-full p-2 border rounded-md mb-4"
                    value={bucketData.title}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="description" className="block text-sm font-medium mb-2">Description (Optional):</label>
                <textarea
                    id="description"
                    name="description"
                    className="w-full p-2 border rounded-md"
                    value={bucketData.description}
                    onChange={handleChange}
                />
                <div className="flex gap-4 mt-6 justify-center">
                    <button 
                        type="submit" 
                        disabled={processing} 
                        className="w-48 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Create
                    </button>
                    <button 
                        type="button" 
                        onClick={onCancel} 
                        className="w-48 p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}