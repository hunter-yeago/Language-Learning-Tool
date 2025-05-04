import { useState } from "react";
import ActionButton from "./ActionButton";

export default function ExistingEssays({ essays, setData, handleStartTutorReview, processing }) {

    const [currentEssay, setCurrentEssay] = useState(null);

    function handleChange(event) {
        const title = event.target.value;

        const selectedEssay = essays.find(e => e.title === title) || null;
        setCurrentEssay(selectedEssay);

        if (selectedEssay) {
            setData('essay', {
                title: selectedEssay.title,
                content: selectedEssay.content,
                words: selectedEssay.words,
            });
        }
    }

    return (
        <div>

            <h2 className="text-xl font-semibold text-center mt-6 mb-2">Existing Essays</h2>

            <label htmlFor="essay" className="block text-sm font-medium mb-2">Select an Essay:</label>
            <select
                id="essay"
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                value={currentEssay?.title || ''}
            >
                <option value="">-- Select an Essay --</option>
                {essays.map((essay, index) => (
                    <option key={index} value={essay.title}>{essay.title}</option>
                ))}
            </select>

            {currentEssay && (
                <div className="flex justify-center gap-4 mt-6">
                    <ActionButton 
                        onClick={handleStartTutorReview} 
                        processing={processing} 
                        color="blue"
                        title="Write Essay"
                    />
                </div>

            )}
        </div>
    );
}