import { Word } from './word';

export interface Essay {
  id: number;
  title: string;
  content: string;
  bucket_id: number;
  created_at: string;
  words: Word[];
}

export interface EssayData {
  title: string;
  content: string;
  words: Word[];
}
