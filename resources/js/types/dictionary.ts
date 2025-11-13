export interface Sense {
  definition: string;
  usageExamples?: string[];
}

export interface Lexeme {
  partOfSpeech: string;
  senses: Sense[];
}

export interface DictionaryEntry {
  id: string;
  headword: string;
  lexemes: Lexeme[];
}
