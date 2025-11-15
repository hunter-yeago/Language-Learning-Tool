export type GradeType = 'correct' | 'incorrect' | 'partially_correct' | 'not_used' | null;

export interface WordPivot {
  grade: GradeType;
  comment: string;
}

export interface TutorWord {
  id: number;
  word: string;
  pivot: WordPivot;
  created_at?: string;
}

export interface TutorEssay {
  title: string;
  content: string;
}

export interface TutorFormData {
  words: TutorWord[];
  feedback: string;
}

export interface WordMatch {
  start: number;
  end: number;
  wordId: number;
  content: string;
}

export interface TextSegment {
  type: 'text' | 'word';
  content: string;
  wordId?: number;
}
