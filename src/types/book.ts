export interface Book {
  id: string; // UUID
  title: string;
  author: string;
  status: 'to-read' | 'reading' | 'completed' | 'abandoned';
  notes?: string;
  rating?: number;
  pages?: number;
  genre?: string;
  isbn?: string;
  publisher?: string;
  publication_year?: number;
  language?: 'en' | 'ru';
  format?: 'physical' | 'ebook' | 'audiobook' | 'pdf';
  source?: string;
  purchase_price_cents?: number;
  purchase_date?: string;
  start_date?: string;
  finish_date?: string;
  reading_time_hours?: number;
  re_read_count?: number;
  is_favorite?: boolean;
  is_recommended?: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface NewBook {
  title: string;
  author: string;
  status?: 'to-read' | 'reading' | 'completed' | 'abandoned';
  notes?: string;
  rating?: number;
  pages?: number;
  genre?: string;
  isbn?: string;
  publisher?: string;
  publication_year?: number;
  language?: 'en' | 'ru';
  format?: 'physical' | 'ebook' | 'audiobook' | 'pdf';
  source?: string;
  purchase_price_cents?: number;
  purchase_date?: string;
  start_date?: string;
  finish_date?: string;
  reading_time_hours?: number;
  re_read_count?: number;
  is_favorite?: boolean;
  is_recommended?: boolean;
  adminKey: string;
}
