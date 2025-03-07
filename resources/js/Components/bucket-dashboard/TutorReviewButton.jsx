export default function TutorReviewButton({ onReview }) {
    return (
        <div className="bg-gray-50 p-6 rounded-md border border-gray-300">
            <button 
                onClick={onReview} 
                className="min-w-48 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
                Start Tutor Essay Review
            </button>
        </div>
    );
}