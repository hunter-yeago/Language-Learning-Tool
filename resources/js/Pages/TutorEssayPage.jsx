import React from 'react';

export default function TutorEssayPage({ essay, words, usedWords }) {

    console.log('essay from tutor page', essay)
  return (
    <div className="flex items-center justify-center mt-12 max-w-[1200px]">
      <div className="flex flex-col items-center gap-6 w-full p-6 bg-white shadow-md rounded-lg">
        <div className="w-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Student Essay Review</h2>
          <div className="flex flex-col md:flex-row w-full gap-6">
            {/* Essay content section */}
            <div className="flex-1">
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-semibold mb-2">{essay.title}</h3>
                <div className="whitespace-pre-wrap text-gray-700">
                  {essay.content} 
                </div>
              </div>
            </div>

            {/* Word bank and used words section */}
            <div className="w-full md:w-64">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Word Bank</h3>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="text-md font-medium mb-2">words in here maybe</h4>
                  <div className="flex flex-wrap gap-2">
                    {/* {words.map((word, index) => (
                      <span 
                        key={index} 
                        className={`px-2 py-1 text-sm rounded-full ${
                          usedWords.some(w => w.id === word.id) 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {word.word}
                      </span>
                    ))} */}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Usage Stats</h3>
                <div className="border rounded-lg p-4 bg-gray-50">
                  {/* <p className="mb-2">Words used: <span className="font-medium">{usedWords.length}/{words.length}</span></p> */}
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    {/* <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: `${(usedWords.length / words.length) * 100}%` }}
                    ></div> */}
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