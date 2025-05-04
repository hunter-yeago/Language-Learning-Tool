import { useState } from 'react';
import { getGradeColor, cycleGrade } from '@/Utilities/tutor_utils/grades';
import GeneralFeedback from '@/Components/tutor-essay-page/GeneralFeedback';
import WordBank from '@/Components/tutor-essay-page/WordBank';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Instructions from '@/Components/tutor-essay-page/Instructions';
import Comments from '@/Components/tutor-essay-page/Comments';
import WordButton from '@/Components/tutor-essay-page/WordButton';

export default function TutorEssayPage({ essay, used_words, not_used_words }) {
  const [wordData, setWordData] = useState({});
  const [activeWordId, setActiveWordId] = useState(null);

  const handleWordClick = (wordId) => {
    setWordData(prev => {
      const word = prev[wordId] || { grade: undefined, comment: '' };
      return {
        ...prev,
        [wordId]: {
          ...word,
          grade: cycleGrade(word.grade)
        }
      };
    });
  };

 

  const getMatchingWordPositions = (text, words) => {
    const sortedWords = [...words].sort((a, b) => b.word.length - a.word.length);
    const matches = [];

    sortedWords.forEach(wordObj => {
      const word = wordObj.word.toLowerCase();
      const wordRegex = new RegExp(`\\b${word}\\b`, 'gi');
      let match;

      while ((match = wordRegex.exec(text.toLowerCase())) !== null) {
        matches.push({
          word: wordObj,
          startIndex: match.index,
          endIndex: match.index + word.length
        });
      }
    });

    return matches;
  };

  function filterOverlappingMatches (positions) {
    const filtered = [];
    let lastEnd = -1;

    positions.sort((a, b) => a.startIndex - b.startIndex).forEach(pos => {
      if (pos.startIndex >= lastEnd) {
        filtered.push(pos);
        lastEnd = pos.endIndex;
      }
    });

    return filtered;
  };

  function buildHighlightedSegments (text, positions) {
    let lastIndex = 0;
    const segments = [];

    positions.forEach(pos => {
      if (pos.startIndex > lastIndex) {
        segments.push(text.substring(lastIndex, pos.startIndex));
      }

      const originalWord = text.substring(pos.startIndex, pos.endIndex);
      const wordId = pos.word.id;
      const word = wordData[wordId] || {};

      segments.push(
        <WordButton
          key={wordId + '-' + pos.startIndex}
          color={getGradeColor(word.grade)}
          clickHandler={() => handleWordClick(wordId)}
          word={originalWord}
        />
      );

      lastIndex = pos.endIndex;
    });

    if (lastIndex < text.length) {
      segments.push(text.substring(lastIndex));
    }

    return segments;
  };

  function highlightWordButtons (text) {
    if (!text || !essay.words?.length) return <p>{text}</p>;
    const matches = getMatchingWordPositions(text, essay.words);
    const filtered = filterOverlappingMatches(matches);
    const segments = buildHighlightedSegments(text, filtered);
    return <div className="whitespace-pre-wrap text-gray-700">{segments}</div>;
  };

  return (
    <AuthenticatedLayout header={<h1 className="text-2xl font-semibold text-gray-800">Student Essay Review</h1>}>
      <Head title="Student Essay Review" />

      <div className="flex items-center justify-center mt-12 flex-col gap-6 w-full p-6 bg-white shadow-md rounded-lg">
        <div className="w-full">
          <div className="flex flex-col md:flex-row w-full gap-6">
            <div className="flex flex-col gap-4 grow">
              <Instructions />
              <WordBank
                essay={essay}
                handleWordClick={handleWordClick}
                wordComments={Object.fromEntries(
                  Object.entries(wordData).filter(([, v]) => v.comment?.trim()).map(([k, v]) => [k, v.comment])
                )}
                wordgrades={Object.fromEntries(
                  Object.entries(wordData).map(([k, v]) => [k, v.grade])
                )}
              />

              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-semibold mb-2">{essay.title}</h3>
                {highlightWordButtons(essay.content)}
              </div>
            </div>
          </div>
        </div>

        <Comments essay={essay} wordData={wordData} setWordData={setWordData} activeWordId={activeWordId} setActiveWordId={setActiveWordId}/>

        <GeneralFeedback />
      </div>
    </AuthenticatedLayout>
  );
}
