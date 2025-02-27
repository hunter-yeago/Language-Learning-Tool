import { useState } from 'react';

export default function TutorEssayPage({ essay, words }) {
  
  // State to track word assessments (right/wrong/partiallyCorrect)
  const [wordAssessments, setWordAssessments] = useState({});

  // State to track comments for words
  const [wordComments, setWordComments] = useState({});

  // State to track which word is currently being commented on
  const [activeCommentWordId, setActiveCommentWordId] = useState(null);

  // Track current comment text before saving
  const [currentComment, setCurrentComment] = useState('');
  
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
      const hasComment = wordComments[wordId] && wordComments[wordId].trim() !== '';
      
      let buttonClass = "px-1 rounded cursor-pointer font-medium ";
      
      // Styling based on assessment
      if (assessment === 'correct') {
        buttonClass += "bg-green-200 text-green-800";
      } else if (assessment === 'partiallyCorrect') {
        buttonClass += "bg-yellow-200 text-yellow-800";
      } else if (assessment === 'incorrect') {
        buttonClass += "bg-red-200 text-red-800";
      } else {
        buttonClass += "bg-blue-200 text-blue-800";
      }
      
      // Add indicator for words with comments
      if (hasComment) {
        buttonClass += " border-b-2 border-dashed border-gray-600";
      }
      
      segments.push(
        <button
          key={`word-${wordId}-${pos.startIndex}`}
          className={buttonClass}
          onClick={() => handleWordClick(wordId, pos.word.word)}
          title={hasComment ? `${assessment || 'Assessed'} - Comment: ${wordComments[wordId]}` : `Click to assess: ${pos.word.word}`}
        >
          {originalWord}
          {hasComment && <span className="text-xs ml-1">💬</span>}
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
    // Set active comment word
    if (activeCommentWordId !== wordId) {
      setActiveCommentWordId(wordId);
      // Load existing comment if any
      setCurrentComment(wordComments[wordId] || '');
    }
    
    // Cycle through assessments: undefined -> correct -> partiallyCorrect -> incorrect -> undefined
    const currentAssessment = wordAssessments[wordId];
    let nextAssessment;
    
    if (!currentAssessment) nextAssessment = 'correct';
    else if (currentAssessment === 'correct') nextAssessment = 'partiallyCorrect';
    else if (currentAssessment === 'partiallyCorrect') nextAssessment = 'incorrect';
    else nextAssessment = undefined;
    
    setWordAssessments({
      ...wordAssessments,
      [wordId]: nextAssessment
    });
  };
  
  // Handle comment changes
  const handleCommentChange = (e) => {
    setCurrentComment(e.target.value);
  };
  
  // Handle comment submission
  const saveComment = () => {
    if (activeCommentWordId) {
      // Only save if there's content or we're explicitly clearing existing content
      if (currentComment.trim() !== '' || wordComments[activeCommentWordId]) {
        setWordComments({
          ...wordComments,
          [activeCommentWordId]: currentComment
        });
      }
      
      // Reset state
      setActiveCommentWordId(null);
      setCurrentComment('');
    }
  };
  
  // Handle comment deletion
  const deleteComment = (wordId) => {
    const newComments = { ...wordComments };
    delete newComments[wordId];
    setWordComments(newComments);
  };
  
  // Word assessment badge component
  const AssessmentBadge = ({ type }) => {
    const classes = {
      correct: "bg-green-200 text-green-800",
      partiallyCorrect: "bg-yellow-200 text-yellow-800",
      incorrect: "bg-red-200 text-red-800",
      undefined: "bg-blue-200 text-blue-800"
    };
    
    return (
      <span className={`inline-block px-2 py-1 rounded ${classes[type] || classes.undefined}`}>
        {type === 'correct' ? 'Correct' : type === 'partiallyCorrect' ? 'PartiallyCorrect' : type === 'incorrect' ? 'Incorrect' : 'Assessed'}
      </span>
    );
  };
  
  // Get the currently active word
  const getActiveWord = () => {
    if (!activeCommentWordId) return null;
    return essay.words.find(word => word.id === activeCommentWordId);
  };
  
  const activeWord = getActiveWord();
  
  // Get comments count
  const commentsCount = Object.values(wordComments).filter(comment => comment && comment.trim() !== '').length;
  
  return (
    <div className="flex items-center justify-center mt-12 max-w-[1200px] flex-col gap-6 w-full p-6 bg-white shadow-md rounded-lg">
        <div className="w-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Student Essay Review</h2>
          <div className="flex flex-col md:flex-row w-full gap-6">
            {/* Essay content section with highlighted words */}
            <div className="flex-1">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Word Bank</h3>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex flex-wrap gap-2">
                    {essay.words && essay.words.map((word) => {
                      const isUsed = essay.words && essay.words.some(w => w.id === word.id);
                      const assessment = wordAssessments[word.id];
                      const hasComment = wordComments[word.id] && wordComments[word.id].trim() !== '';

                      
                      let className = "px-2 py-1 text-sm rounded-full ";
                      
                      if (isUsed) {
                        if (assessment === 'correct') {
                          className += "bg-green-100 text-green-800 border border-green-300";
                        } else if (assessment === 'partiallyCorrect') {
                          className += "bg-yellow-100 text-yellow-800 border border-yellow-300";
                        } else if (assessment === 'incorrect') {
                          className += "bg-red-100 text-red-800 border border-red-300";
                        } else {
                          className += "bg-blue-100 text-blue-800 border border-blue-300";
                        }
                        if (hasComment) {
                          className += " cursor-pointer";
                        }
                      } else {
                        className += "bg-gray-100 text-gray-800";
                      }
                      
                      return (
                        <span 
                          key={word.id} 
                          className={className}
                          onClick={() => {
                            if (hasComment) {
                              setActiveCommentWordId(word.id);
                              setCurrentComment(wordComments[word.id] || '');
                            } else {
                              handleWordClick(word.id, word.word);
                            }
                          }}
                        >
                          {word.word}
                          {hasComment && <span className="ml-1">💬</span>}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-semibold mb-2">{essay.title}</h3>
                {highlightUsedWords(essay.content)}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <p>Click on highlighted words to assess them: <span className="inline-block px-2 mx-1 bg-green-200 text-green-800 rounded">Correct</span> &rarr; <span className="inline-block px-2 mx-1 bg-yellow-200 text-yellow-800 rounded">Partially Correct</span> &rarr; <span className="inline-block px-2 mx-1 bg-red-200 text-red-800 rounded">Incorrect</span></p>
                <p>Words with comments are marked with 💬</p>
              </div>
            </div>
            
            {/* Word bank and active word comment section */}
            <div className="w-full md:w-64">
             
              {/* Active word comment section */}
              {activeCommentWordId && activeWord && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Word Comment</h3>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="mb-2">
                      <strong>Word:</strong> {activeWord.word}
                    </div>
                    <div className="mb-2">
                      <strong>Assessment:</strong>{" "}
                      <AssessmentBadge type={wordAssessments[activeCommentWordId]} />
                    </div>
                    <textarea
                      value={currentComment}
                      onChange={handleCommentChange}
                      rows="10"
                      placeholder="Add a comment about this word..."
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    ></textarea>
                    <div className="flex justify-between mt-2">
                      <button 
                        onClick={() => {
                          setActiveCommentWordId(null);
                          setCurrentComment('');
                        }}
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={saveComment}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                        disabled={currentComment.trim() === ''}
                      >
                        Save Comment
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* All word comments summary section */}
        <div className="w-full mt-4">
          <h3 className="text-lg font-semibold mb-2">
            Word Comments Summary {commentsCount > 0 && <span className="text-sm font-normal text-gray-500">({commentsCount} comments)</span>}
          </h3>
          <div className="border rounded-lg p-4 bg-gray-50">
            {commentsCount > 0 ? (
              <div className="space-y-3">
                {Object.keys(wordComments).map(wordId => {

                  // using 2 equals here because one of htem is a number and the other one is a string
                  const word = essay.words.find(w => w.id == wordId);

                  if (!word) return null;
                  return (
                    <div key={wordId} className="p-3 border rounded bg-white">
                      <div className="flex items-center justify-between">
                        
                        {/* Word and Comment */}
                        <div className="font-medium">
                          {word.word} <AssessmentBadge type={wordAssessments[wordId]} />
                          <p className="text-sm mt-1">{wordComments[wordId]}</p>
                        </div>

                        
                        {/* Edit / Delete Buttons */}
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setActiveCommentWordId(wordId);
                              setCurrentComment(wordComments[wordId]);
                            }}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => deleteComment(wordId)}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>


                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 italic">No word comments yet. Click on words in the essay to add comments.</p>
            )}
          </div>
        </div>
        
        {/* General feedback section */}
        <div className="w-full mt-4">
          <h3 className="text-lg font-semibold mb-2">General Feedback</h3>
          <div className="border rounded-lg p-4 bg-gray-50">
            <textarea
              rows="4"
              placeholder="Enter general feedback for the student..."
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
  );
}