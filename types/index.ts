export type ReadingItemType = 'book' | 'article';

export interface ReadingItem {
  id: string;
  type: ReadingItemType;
  title: string;
  author?: string;
  publication?: string;
  year?: number;
  pages?: number;
  readDate: string;
  rating?: number;
  genre?: string;
  tags?: string[];
  description?: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  isRoot: boolean;
}

