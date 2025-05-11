import { useState } from 'react'
import CommentEditor from './CommentEditor'
import CommentList from './CommentList'
import CommentWords from './CommentWords'

export default function Comments({ essay, wordData, setWordData }) {
  const [tempData, setTempData] = useState('')
  const [currentComment, setCurrentComment] = useState(null)

  return (
    <section
      className="w-full flex flex-col gap-3"
      aria-label={`comments for the ${essay.title} essay`}
    >
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">Comments</h3>
        <p className="text-sm text-gray-600">
          {' '}
          - Click on a word to leave a comment
        </p>
      </div>

      <CommentWords
        essay={essay}
        wordData={wordData}
        setCurrentComment={setCurrentComment}
      />

      <CommentEditor
        essay={essay}
        currentComment={currentComment}
        setCurrentComment={setCurrentComment}
        tempData={tempData}
        setTempData={setTempData}
        wordData={wordData}
        setWordData={setWordData}
      />

      <CommentList
        essay={essay}
        wordData={wordData}
        currentComment={currentComment}
        setCurrentComment={setCurrentComment}
        setWordData={setWordData}
        setTempData={setTempData}
      />
    </section>
  )
}
