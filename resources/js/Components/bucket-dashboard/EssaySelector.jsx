export default function EssaySelector({ essays, currentEssayTitle, onEssayChange }) {
    function handleChange(event) {
        const essayTitle = event.target.value;
        onEssayChange(essayTitle);
    }

    return (
        <div>
            <label htmlFor="essay" className="block text-sm font-medium mb-2">Select an Essay:</label>
            <select
                id="essay"
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                value={currentEssayTitle || ''}
            >
                <option value="">-- Select an Essay --</option>
                {essays.map((essay, index) => (
                    <option key={index} value={essay.title}>{essay.title}</option>
                ))}
            </select>
        </div>
    );
}