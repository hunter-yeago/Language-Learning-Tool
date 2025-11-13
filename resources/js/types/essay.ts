import { Word } from './word';

export interface Essay {
  title: string;
  content: string;
  words: Word[];
}

export interface EssayData {
  title: string;
  content: string;
  words: Word[];
}
