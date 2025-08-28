export interface Article {
  id: string; // UUID
  title: string;
  url: string; // URL is now required
  author?: string;
  publication?: string;
  summary?: string;
  notes?: string;
  status: 'to-read' | 'reading' | 'completed' | 'archived';
  word_count?: number;
  reading_time_minutes?: number;
  source?: string;
  category?: string;
  importance_level?: number;
  is_bookmarked?: boolean;
  is_shared?: boolean;
  share_date?: string;
  start_date?: string;
  finish_date?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface NewArticle {
  title: string;
  url: string; // URL is now required
  author?: string;
  publication?: string;
  summary?: string;
  notes?: string;
  status?: 'to-read' | 'reading' | 'completed' | 'archived';
  word_count?: number;
  reading_time_minutes?: number;
  source?: string;
  category?: string;
  importance_level?: number;
  is_bookmarked?: boolean;
  is_shared?: boolean;
  share_date?: string;
  start_date?: string;
  finish_date?: string;
  adminKey: string;
}
