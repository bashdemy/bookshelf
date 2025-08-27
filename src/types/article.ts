export interface Article {
  id: number;
  title: string;
  url?: string;
  author?: string;
  publication?: string;
  summary?: string;
  notes?: string;
  tags?: string;
  status: 'to-read' | 'reading' | 'completed';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NewArticle {
  title: string;
  url?: string;
  author?: string;
  publication?: string;
  summary?: string;
  notes?: string;
  tags?: string;
  status?: 'to-read' | 'reading' | 'completed';
  adminKey: string;
}
