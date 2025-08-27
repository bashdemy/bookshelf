export interface Book {
  id: number;
  title: string;
  author: string;
  status: 'to-read' | 'reading' | 'completed';
  notes?: string;
  rating?: number;
  pages?: number;
  genre?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NewBook {
  title: string;
  author: string;
  status?: 'to-read' | 'reading' | 'completed';
  notes?: string;
  rating?: number;
  pages?: number;
  genre?: string;
  adminKey: string;
}
