import { useState } from "react";
import ActionButton from "./ActionButton";

export default function ExistingEssays({ essays, setData, data, post }) {

    const [currentEssay, setCurrentEssay] = useState(null);

    function handleChange(event) {
        
        // handle switch to default input
        if (!event.target.value) {
            setCurrentEssay(null);
            return
        };

        const selectedEssay = essays.find(e => e.title === event.target.value) || null;
        setCurrentEssay(selectedEssay);
        setData('essay', {
            title: selectedEssay.title,
            content: selectedEssay.content,
            words: selectedEssay.words,
        });
    }

    return (
        <section className="flex flex-col items-center gap-4" aria-label="choose your essay here">
            <label htmlFor="essay" className="text-xl font-semibold text-center">Existing Essays</label>

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
                <ActionButton 
                    onClick={() => post(route('tutor-essay-page'), { essay: data.essay })} 
                    processing={processing} 
                    color="blue"
                    text="Write Essay"
                />
            )}
        </section>
    );
}