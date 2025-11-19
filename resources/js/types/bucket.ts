import { Word } from './word';

export interface Bucket<T = Word> {
  id: number;
  title: string;
  description: string;
  words: T[];
}

export interface BucketData<T = Word> {
  id?: number;
  title: string;
  description: string;
  words?: T[];
}
