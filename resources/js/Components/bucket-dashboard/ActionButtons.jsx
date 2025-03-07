export default function ActionButtons({ onAddWords, onWriteEssayPage, processing }) {
    return (
        <div className="flex gap-4 mt-6">
            <button
                onClick={onAddWords}
                disabled={processing}
                className="w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
                {processing ? 'Loading...' : 'Add Words'}
            </button>

            <button
                onClick={onWriteEssayPage}
                disabled={processing}
                className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
                {processing ? 'Loading...' : 'Start Essay'}
            </button>
        </div>
    );
}