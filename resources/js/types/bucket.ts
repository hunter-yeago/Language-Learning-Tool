import { Word } from './word';

export interface Bucket<T = Word> {
  id: number;
  title: string;
  description: string;
  words: T[];
  created_at?: string;
  updated_at?: string;
}

export interface BucketData<T = Word> {
  id?: number;
  title: string;
  description: string;
  words?: T[];
}
