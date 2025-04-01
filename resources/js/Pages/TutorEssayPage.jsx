import { useState } from 'react';
import { getAssesmentColor, cycleAssessmentStatus} from '@/Utilities/tutor_utils/assessment_utils';

export default function TutorEssayPage({ essay, used_words, not_used_words }) {
  
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
    if (!text || !essay.words || essay.words.length === 0) return <p>{text}</p>;
    
    let lastIndex = 0;
    const segments = [];
    
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
      
      while ((match = wordRegex.exec(text.toLowerCase())) !== null) {
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
    filteredPositions.forEach((pos) => {
      // Add text before the word
      if (pos.startIndex > lastIndex) {
        segments.push(text.substring(lastIndex, pos.startIndex));
      }
      
      // Add the highlighted word as a button
      const originalWord = text.substring(pos.startIndex, pos.endIndex);
      const wordId = pos.word.id;
      const assessment = wordAssessments[wordId];
      const hasComment = wordComments[wordId] && wordComments[wordId].trim() !== '';
      
      segments.push(
        <button
          key={`word-${wordId}-${pos.startIndex}`}
          className={`px-1 rounded ${getAssesmentColor(assessment)}`}
          onClick={() => handleWordClick(wordId)}
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
  function handleWordClick (wordId) {
    
    setActiveCommentWordId(wordId);
    setCurrentComment(wordComments[wordId] || '');
    setWordAssessments({
      ...wordAssessments,
      [wordId]: cycleAssessmentStatus(wordAssessments[wordId])
    });
  };
  

  function handleCommentChange (e) {
    setCurrentComment(e.target.value);
  };
  
  function saveComment () {
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
  
  function deleteComment (wordId) {
    const newComments = { ...wordComments };
    delete newComments[wordId];
    setWordComments(newComments);
  };
  
  function AssessmentBadge ({ type }) {
    return (
      <span className={`inline-block px-2 py-1 rounded ${getAssesmentColor(type)}`}>
        {type === 'correct' ? 'Correct' : type === 'partiallyCorrect' ? 'PartiallyCorrect' : type === 'incorrect' ? 'Incorrect' : 'Assessed'}
      </span>
    );
  };
  
  function getActiveWord () {
    if (!activeCommentWordId) return null;
    return essay.words.find(word => word.id === activeCommentWordId);
  };
  
  // Get comments count
  const commentsCount = Object.values(wordComments).filter(comment => comment && comment.trim() !== '').length;
  
  return (
    <div className="flex items-center justify-center mt-12 max-w-[1200px] flex-col gap-6 w-full p-6 bg-white shadow-md rounded-lg">
        <div className="w-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Student Essay Review</h2>
          <div className="flex flex-col md:flex-row w-full gap-6">
            
            {/* Essay content section with highlighted words */}
            <div className='flex flex-col gap-4 grow'>

              <div>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Click on highlighted words to assess them: <span className="inline-block px-2 mx-1 bg-green-200 text-green-800 rounded">Correct</span> &rarr; <span className="inline-block px-2 mx-1 bg-yellow-200 text-yellow-800 rounded">Partially Correct</span> &rarr; <span className="inline-block px-2 mx-1 bg-red-200 text-red-800 rounded">Incorrect</span></p>
                  <p>Words with comments are marked with 💬</p>
                </div>

              {/* Word bank */}
                <h3 className="text-lg font-semibold mb-2">Word Bank</h3>
                
                {/* Word Outer Container */}
                <div className="border rounded-lg p-4 bg-gray-50">

                  {/* Word inner container */}
                  <div className="flex flex-wrap gap-2">
                    {essay.words && essay.words.map((word) => {
                      const assessment = wordAssessments[word.id];
                      const hasComment = wordComments[word.id] && wordComments[word.id].trim() !== '';
                      
                      if (word.pivot.used) {

                        return (
                          <span 
                            key={word.id} 
                            className={`border px-2 py-1 text-sm rounded-full cursor-pointer ${getAssesmentColor(assessment)}`}
                            onClick={() => {handleWordClick(word.id)}}
                            >
                            {word.word}
                            {hasComment && <span className="ml-1">💬</span>}
                          </span>
                        );
                      } 
                      
                      else {
                        return (
                          <span 
                            key={word.id} 
                            className="bg-gray-100 text-gray-800 line-through px-2 py-1 text-sm rounded-full "
                          >{word.word}</span>
                        );
                      }
                      
                    })}
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-semibold mb-2">{essay.title}</h3>
                {highlightUsedWords(essay.content)}
              </div>
            </div>
          </div>
        </div>

        {activeCommentWordId && (
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-2">Word Comment</h3>
            <div className="border rounded-lg p-4 bg-gray-50">
              <div>
                <span className='font-bold'>Word: </span>
                {getActiveWord().word}
              </div>
              <div>
                <span className='font-bold'>Assessment: </span>
                <AssessmentBadge type={wordAssessments[activeCommentWordId]} />
              </div>  
              <textarea
                value={currentComment}
                onChange={handleCommentChange}
                rows="3"
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
                >Cancel</button>
                <button 
                  onClick={saveComment}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                  disabled={currentComment.trim() === ''}
                > Save Comment</button>
              </div>
            </div>
          </div>
        )}
        
        {/* All word comments summary section */}
        <div className="w-full">

          {/* Comment Summary */}
          <div className='flex items-center gap-2'>
            <h3 className="text-lg font-semibold">Word Comments Summary </h3>
              {commentsCount > 0 && 
                <span className="text-sm font-normal text-gray-500">
                  ({commentsCount} comment{commentsCount > 1 && "s"}) 
                </span>
              }
          </div>


          <div className="border rounded-lg p-4 bg-gray-50">
            {commentsCount > 0 ? (
              <>
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
              </>
            ) : (
              <p className="text-gray-500 italic">No word comments yet. Click on words in the essay to add comments.</p>
            )}
          </div>
        </div>
        
        {/* General feedback section */}
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-2">General Feedback</h3>
          <div className="border rounded-lg p-4 bg-gray-50">
            <textarea
              rows="3"
              placeholder="Enter general feedback for the student..."
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
              <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Send Feedback
              </button>
          </div>
        </div>
    </div>
  );
}