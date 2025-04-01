export default function TutorReviewButton({ onReview }) {
    return (
        <div className="mt-6 flex justify-center">
            <button 
                onClick={onReview} 
                className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
                Start Tutor Essay Review
            </button>
        </div>
    );
}