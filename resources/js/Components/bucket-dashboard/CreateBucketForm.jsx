export default function CreateBucketForm({ bucketData, onUpdateBucketData, onSubmit, onCancel, processing }) {
    function handleTitleChange(e) {
        onUpdateBucketData({ ...bucketData, title: e.target.value });
    }
    
    function handleDescriptionChange(e) {
        onUpdateBucketData({ ...bucketData, description: e.target.value });
    }

    return (
        <div className="bg-gray-50 p-6 rounded-md border border-gray-300">
            <h2 className="text-lg font-semibold text-center">New Word Bucket</h2>
            <form onSubmit={onSubmit}>
                <label htmlFor="title" className="block text-sm font-medium mb-2">Title:</label>
                <input
                    type="text"
                    id="title"
                    className="w-full p-2 border rounded-md mb-4"
                    value={bucketData.title}
                    onChange={handleTitleChange}
                    required
                />
                <label htmlFor="description" className="block text-sm font-medium mb-2">Description (Optional):</label>
                <textarea
                    id="description"
                    className="w-full p-2 border rounded-md"
                    value={bucketData.description}
                    onChange={handleDescriptionChange}
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