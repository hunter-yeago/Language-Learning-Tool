import { useState } from 'react'
import { TutorWord } from '@/types/tutor'
import CommentEditor from './CommentEditor'
import CommentList from './CommentList'
import CommentWords from './CommentWords'
import { Essay } from '@/types/essay'

interface CommentsProps {
  essay: Essay;
  setData: (key: string, value: TutorWord[]) => void;
}

export default function Comments({ essay, setData }: CommentsProps) {
  const words = essay.words;
  const [tempData, setTempData] = useState('')
  const [currentComment, setCurrentComment] = useState<number | null>(null)

  return (
    <section className="w-full flex flex-col gap-3" aria-label={`comments for the ${essay.title} essay`}>
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">Comments</h3>
        <p className="text-sm text-gray-600">- Click on a word to leave a comment</p>
      </div>

      <CommentWords words={words} setCurrentComment={setCurrentComment} />

      <CommentEditor
        currentComment={currentComment}
        setCurrentComment={setCurrentComment}
        tempData={tempData}
        setTempData={setTempData}
        words={words}
        setData={setData}
      />

      <CommentList words={words} currentComment={currentComment} setCurrentComment={setCurrentComment} setData={setData} setTempData={setTempData} />
    </section>
  )
}
