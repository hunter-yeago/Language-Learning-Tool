import { Word } from './word';

export interface Bucket {
  id: number;
  title: string;
  description: string;
  words: Word[];
}

export interface BucketData {
  id?: number;
  title: string;
  description: string;
  words?: Word[];
}
