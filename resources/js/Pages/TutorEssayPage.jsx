import { useState } from 'react';
import GeneralFeedback from '@/Components/tutor-essay-page/GeneralFeedback';
import WordBank from '@/Components/tutor-essay-page/WordBank';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import Comments from '@/Components/tutor-essay-page/Comments';
import StudentEssay from '@/Components/tutor-essay-page/StudentEssay';

export default function TutorEssayPage({ essay, used_words, not_used_words }) {

    const { data, setData, post, processing } = useForm({
        bucket: {
            id: null,
            title: '',
            description: '',
            words: [],
        },
        essay: {
            title: '',
            content: '',
            words: [],
        },
    });
  
  const [wordData, setWordData] = useState(essay.words);
  const [activeWordId, setActiveWordId] = useState(null);


  function handleSubmit(e) {
    e.preventDefault();
    post(route('update-bucket'), {
        title: data.bucket.title,
        description: data.bucket.description,
    });
}


  return (
    <AuthenticatedLayout header={<h1 className="text-2xl font-semibold text-gray-800">Student Essay Review</h1>}>
      <Head title="Student Essay Review" />

      <div className="flex flex-col gap-6 p-6 bg-white shadow-md rounded-lg">
        
        <WordBank
          essay={essay}
          setWordData={setWordData}
          wordData={wordData}
        />

        <StudentEssay essay={essay} wordData={wordData} setActiveWordId={setActiveWordId} />

        <Comments
          essay={essay}
          wordData={wordData}
          setWordData={setWordData}
          activeWordId={activeWordId}
          setActiveWordId={setActiveWordId}
        />

        <GeneralFeedback />
      </div>
    </AuthenticatedLayout>
  );
}
