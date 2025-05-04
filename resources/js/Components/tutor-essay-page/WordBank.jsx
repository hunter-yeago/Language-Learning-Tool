import WordBankItem from "./WordBankItem";

export default function WordBank({ essay, handleWordClick, wordComments, wordgrades }) {
  const hasWords = Array.isArray(essay.words) && essay.words.length > 0;

  if (!hasWords) {
    return (
      <section aria-label={`word bank for the ${essay.title} essay`}>
        <h3 className="text-lg font-semibold mb-2">Word Bank</h3>
        <p className="text-gray-500 italic">No words in this essay.</p>
      </section>
    );
  }

  return (
    <section aria-label={`word bank for the ${essay.title} essay`}>
      <h3 className="text-lg font-semibold mb-2">Word Bank</h3>
      <ul className="border rounded-lg p-4 bg-gray-50 flex flex-wrap gap-2">
        {essay.words.map(word => (
          <WordBankItem
            key={word.id}
            word={word}
            handleWordClick={handleWordClick}
            wordComments={wordComments}
            wordgrades={wordgrades}
          />
        ))}
      </ul>
    </section>
  );
}
