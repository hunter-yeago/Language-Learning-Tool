export default function ActionButton({ onClick, processing, color, text }) {
    return (
        <button
            onClick={onClick}
            disabled={processing}
            className={`w-full max-w-[150px] p-2 bg-${color}-500 text-white rounded-md hover:bg-${color}-600`}
        >
            {processing ? 'Loading...' : text}
        </button>
    );
}