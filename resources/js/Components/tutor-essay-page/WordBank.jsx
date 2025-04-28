import { getAssesmentColor } from "@/Utilities/tutor_utils/assessment_utils";
import UsedWord from "./Usedword";
import UnusedWord from "./UnusedWord";

export default function WordBank({essay, handleWordClick, wordComments, wordAssessments}) {

  // TODO to do - test with no words / bad word data

  return(
    <>
      <h3 className="text-lg font-semibold mb-2">Word Bank</h3>

        {(Array.isArray(essay.words) && essay.words.length > 0) 

        ? <ul className="border rounded-lg p-4 bg-gray-50 flex flex-wrap gap-2">
          {essay.words.map((word, index) => {
            
            if (word.pivot.used) {
              return (
                <UsedWord 
                  number={index} 
                  className={getAssesmentColor(wordAssessments[word.id])} 
                  clickHandler={() => handleWordClick(word.id)} 
                  hasComment={wordComments[word.id] && wordComments[word.id].trim() !== ''} 
                  word={word}
                />
              );
            } 
            
            else return <UnusedWord number={index} word={word.word} />;
          })} 
        </ul> : <> no words in this essay</>}
          
    </>
  )
}