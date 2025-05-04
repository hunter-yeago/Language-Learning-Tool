import React from "react";
import { capitalizeFirstLetter } from "@/Utilities/capitalize_first_letter";

export default function LexemeCard({ lexeme, pluralForm }) {
    return (
        <div className="p-4 border border-gray-300 rounded-md">
            <div className="text-lg font-medium text-gray-800">
                {capitalizeFirstLetter(lexeme.partOfSpeech)}
                {pluralForm && lexeme.partOfSpeech === 'noun' && (
                    <span> ⦁ Plural: {pluralForm}</span>
                )}
            </div>
            <p className="mt-1 text-gray-600">
                1. {lexeme.senses[0]?.definition || "Definition not available"}
            </p>
            {Array.isArray(lexeme.senses[0]?.usageExamples) ? (
                <ul className="mt-2 text-gray-500 list-disc list-inside">
                    {lexeme.senses[0].usageExamples.map((example, exampleIndex) => (
                        <li key={exampleIndex}>{example}</li>
                    ))}
                </ul>
            ) : (
                <p className="mt-2 text-gray-500 italic">No examples available</p>
            )}
        </div>
    );
}
