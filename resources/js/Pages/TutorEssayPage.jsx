import React, { useState } from 'react';

export default function TutorEssayPage({ essay, words }) {
  // State to track word assessments (right/wrong/partial)
  const [wordAssessments, setWordAssessments] = useState({});
  
  // Function to highlight used words in the essay
  const highlightUsedWords = (text) => {
    if (!text || !essay.words || essay.words.length === 0) {
      return <div className="whitespace-pre-wrap text-gray-700">{text}</div>;
    }
    
    let lastIndex = 0;
    const segments = [];
    const processedText = text.toLowerCase();
    
    // Sort words by length (descending) to handle overlapping matches correctly
    const sortedWords = [...essay.words].sort((a, b) => 
      b.word.length - a.word.length
    );
    
    // Find all word positions in the text
    const wordPositions = [];
    
    sortedWords.forEach(wordObj => {
      const word = wordObj.word.toLowerCase();
      const wordRegex = new RegExp(`\\b${word}\\b`, 'gi');
      let match;
      
      while ((match = wordRegex.exec(processedText)) !== null) {
        wordPositions.push({
          word: wordObj,
          startIndex: match.index,
          endIndex: match.index + word.length
        });
      }
    });
    
    // Sort positions by start index
    wordPositions.sort((a, b) => a.startIndex - b.startIndex);
    
    // Filter out overlapping matches
    const filteredPositions = [];
    let lastEnd = -1;
    
    wordPositions.forEach(pos => {
      if (pos.startIndex >= lastEnd) {
        filteredPositions.push(pos);
        lastEnd = pos.endIndex;
      }
    });
    
    // Create the highlighted segments
    filteredPositions.forEach(pos => {
      // Add text before the word
      if (pos.startIndex > lastIndex) {
        segments.push(text.substring(lastIndex, pos.startIndex));
      }
      
      // Add the highlighted word as a button
      const originalWord = text.substring(pos.startIndex, pos.endIndex);
      const wordId = pos.word.id;
      const assessment = wordAssessments[wordId];
      
      let buttonClass = "px-1 rounded cursor-pointer font-medium ";
      
      // Styling based on assessment
      if (assessment === 'correct') {
        buttonClass += "bg-green-200 text-green-800";
      } else if (assessment === 'partial') {
        buttonClass += "bg-yellow-200 text-yellow-800";
      } else if (assessment === 'incorrect') {
        buttonClass += "bg-red-200 text-red-800";
      } else {
        buttonClass += "bg-blue-200 text-blue-800";
      }
      
      segments.push(
        <button
          key={`word-${wordId}-${pos.startIndex}`}
          className={buttonClass}
          onClick={() => handleWordClick(wordId, pos.word.word)}
          title={`Click to assess: ${pos.word.word}`}
        >
          {originalWord}
        </button>
      );
      
      lastIndex = pos.endIndex;
    });
    
    // Add remaining text
    if (lastIndex < text.length) {
      segments.push(text.substring(lastIndex));
    }
    
    return <div className="whitespace-pre-wrap text-gray-700">{segments}</div>;
  };
  
  // Handle word assessment when tutor clicks a word
  const handleWordClick = (wordId, wordText) => {
    // Show assessment options in a popover or modal
    const currentAssessment = wordAssessments[wordId];
    let nextAssessment;
    
    // Cycle through assessments: undefined -> correct -> partial -> incorrect -> undefined
    if (!currentAssessment) nextAssessment = 'correct';
    else if (currentAssessment === 'correct') nextAssessment = 'partial';
    else if (currentAssessment === 'partial') nextAssessment = 'incorrect';
    else nextAssessment = undefined;
    
    setWordAssessments({
      ...wordAssessments,
      [wordId]: nextAssessment
    });
  };
  
  return (
    <div className="flex items-center justify-center mt-12 max-w-[1200px]">
      <div className="flex flex-col items-center gap-6 w-full p-6 bg-white shadow-md rounded-lg">
        <div className="w-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Student Essay Review</h2>
          <div className="flex flex-col md:flex-row w-full gap-6">
            {/* Essay content section with highlighted words */}
            <div className="flex-1">
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-semibold mb-2">{essay.title}</h3>
                {highlightUsedWords(essay.content)}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <p>Click on highlighted words to assess them: <span className="inline-block px-2 mx-1 bg-green-200 text-green-800 rounded">correct</span> &rarr; <span className="inline-block px-2 mx-1 bg-yellow-200 text-yellow-800 rounded">partial</span> &rarr; <span className="inline-block px-2 mx-1 bg-red-200 text-red-800 rounded">incorrect</span></p>
              </div>
            </div>
            
            {/* Word bank and used words section */}
            <div className="w-full md:w-64">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Word Bank</h3>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex flex-wrap gap-2">
                    {essay.words && essay.words.map((word) => {
                      const isUsed = essay.words && essay.words.some(w => w.id === word.id);
                      const assessment = wordAssessments[word.id];
                      
                      let className = "px-2 py-1 text-sm rounded-full ";
                      
                      if (isUsed) {
                        if (assessment === 'correct') {
                          className += "bg-green-100 text-green-800 border border-green-300";
                        } else if (assessment === 'partial') {
                          className += "bg-yellow-100 text-yellow-800 border border-yellow-300";
                        } else if (assessment === 'incorrect') {
                          className += "bg-red-100 text-red-800 border border-red-300";
                        } else {
                          className += "bg-blue-100 text-blue-800 border border-blue-300";
                        }
                      } else {
                        className += "bg-gray-100 text-gray-800";
                      }
                      
                      return (
                        <span key={word.id} className={className}>
                          {word.word}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Feedback section */}
        <div className="w-full mt-4">
          <h3 className="text-lg font-semibold mb-2">Tutor Feedback</h3>
          <div className="border rounded-lg p-4 bg-gray-50">
            <textarea
              rows="4"
              placeholder="Enter feedback for the student..."
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
            <div className="flex justify-end mt-2">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Send Feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}