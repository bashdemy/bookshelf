export interface Book {
  id: number;
  title: string;
  author: string;
  status: 'reading' | 'completed' | 'to-read';
  notes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NewBook {
  title: string;
  author: string;
  status?: 'reading' | 'completed' | 'to-read';
  notes?: string | null;
}
