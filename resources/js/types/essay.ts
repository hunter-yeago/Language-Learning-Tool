import { TutorWord } from './tutor';

export interface Essay {
  id: number;
  title: string;
  content: string;
  bucket_id: number;
  created_at: string;
  words: TutorWord[];
  feedback?: string;
  tutor_id?: number;
  viewed?: boolean;
}

export interface EssayData {
  title: string;
  content: string;
  words: TutorWord[];
}
