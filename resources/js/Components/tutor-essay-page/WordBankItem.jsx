import { getGradeColor } from "@/Utilities/tutor_utils/grades";
import WordButton from "./WordButton";

export default function WordBankItem({ word, handleWordClick, wordComments, wordgrades }) {
  if (!word.pivot?.used) return <li key={word.id}><span className="bg-gray-100 text-gray-800 line-through px-2 py-1 rounded-full">{word.word}</span></li>

  return (
    <li key={word.id}>
      <WordButton
        color={getGradeColor(wordgrades[word.id])}
        clickHandler={() => handleWordClick(word.id)}
        word={word.word}
      />
    </li>
  );
}
