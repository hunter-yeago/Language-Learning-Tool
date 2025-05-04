import { getGradeColor } from "@/Utilities/tutor_utils/grades";

export default function CommentEditor( { essay, currentComment, setCurrentComment, tempData, setTempData, wordData, setWordData } ) {

  function saveComment() {
    if (currentComment != null) {
      setWordData(prev => ({
        ...prev,
        [currentComment]: {
          ...prev[currentComment],
          comment: tempData 
        }
      }));
    }
    setTempData(""); 
    setCurrentComment(null); 
  }

  function cancelEdit() {
    setTempData(""); 
    setCurrentComment(null); 
  }

  if (currentComment)
  return(
    <article className="border rounded-lg p-4 bg-gray-50 mb-4">
      
      {/* Title */}
      <h4 className="font-medium mb-2">
        Comment on:{" "}
        <span className={`px-2 py-1 rounded-full ${getGradeColor(wordData[currentComment]?.grade)}`}>
          {essay.words.find(w => w.id === currentComment)?.word}
        </span>
      </h4>

      {/* Comment Area */}
      <textarea
        value={tempData}
        onChange={(event) => setTempData(event.target.value)}
        rows="3"
        placeholder="Add a comment about this word..."
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Save / Cance */}
      <div className="mt-2 flex justify-end gap-2">
        <button onClick={cancelEdit} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400" >Cancel</button>
        <button onClick={saveComment} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save</button>
      </div>
    </article>
  )
}