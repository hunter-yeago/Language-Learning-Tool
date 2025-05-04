import { getGradeColor } from "@/Utilities/tutor_utils/grades";

export default function Comments( { essay, wordData, setWordData, activeWordId, setActiveWordId } ) {

  function handleCommentChange (event) {
    if (activeWordId != null) {
      setWordData(prev => ({
        ...prev,
        [activeWordId]: {
          ...prev[activeWordId],
          comment: event.target.value
        }
      }));
    }
  };

  function deleteComment (wordId) {
    setWordData(prev => {
      const updated = { ...prev };
      if (updated[wordId]) {
        updated[wordId].comment = '';
      }
      return updated;
    });
    if (activeWordId === wordId) setActiveWordId(null);
  };

  return(
    <section className="w-full" aria-label={`comments for the ${essay.title} essay`}>
    <h3 className="text-lg font-semibold">Comments</h3>

    <article className="border rounded-lg p-4 bg-gray-50 flex flex-col gap-2" aria-label="update comments here">
      {essay.words.map(word => {
        const wordId = word.id;
        const data = wordData[wordId] || {};
        const isActive = activeWordId === wordId;

        return (
          <div key={wordId} className="p-3 border rounded bg-white">
            <div className="flex items-center justify-between">
              
              <div className="font-medium">
                
                <span className={`px-2 py-1 rounded-full ${getGradeColor(data.grade)}`}>{word.word}</span>
                 <span> - </span>
                {data.grade === 'correct' ? 'Correct' : data.grade === 'partiallyCorrect' ? 'Partially Correct' : data.grade === 'incorrect' ? 'Incorrect' : 'Waiting for Grade'}

                
                {!isActive && data.comment && <p className="text-sm mt-1">{data.comment}</p>}
              </div>

              <div className="flex gap-2">
                {isActive ? (
                  <button
                    onClick={() => setActiveWordId(null)}
                    className="text-xs text-gray-600 hover:underline"
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveWordId(wordId)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    {data.comment ? 'Edit' : 'Add'}
                  </button>
                )}
                {data.comment?.trim() && (
                  <button
                    onClick={() => deleteComment(wordId)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>

            {isActive && (
              <div className="mt-4 flex flex-col gap-2">
                <textarea
                  value={data.comment || ''}
                  onChange={handleCommentChange}
                  rows="3"
                  placeholder="Add a comment about this word..."
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={() => setActiveWordId(null)}
                  className="ml-auto px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        );
      })}
    </article>
  </section>
  )
}