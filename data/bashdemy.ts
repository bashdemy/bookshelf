import { ReadingItem } from '@/types';

export const bashdemyBooks: ReadingItem[] = [
  {
    id: '1',
    type: 'book',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    year: 2008,
    pages: 464,
    readDate: '2024-01-15',
    rating: 5,
    genre: 'Programming',
    tags: ['software-engineering', 'best-practices'],
    description: 'A handbook of agile software craftsmanship.',
  },
  {
    id: '2',
    type: 'book',
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt, David Thomas',
    year: 1999,
    pages: 352,
    readDate: '2024-02-20',
    rating: 5,
    genre: 'Programming',
    tags: ['software-engineering', 'career'],
  },
  {
    id: '3',
    type: 'book',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    year: 2017,
    pages: 616,
    readDate: '2024-03-10',
    rating: 5,
    genre: 'Programming',
    tags: ['databases', 'distributed-systems'],
  },
];

export const bashdemyArticles: ReadingItem[] = [
  {
    id: 'a1',
    type: 'article',
    title: 'Understanding React Server Components',
    author: 'Dan Abramov',
    publication: 'React Blog',
    year: 2023,
    readDate: '2024-04-05',
    rating: 5,
    tags: ['react', 'web-development'],
  },
  {
    id: 'a2',
    type: 'article',
    title: 'The Future of Web Development',
    author: 'Various',
    publication: 'TechCrunch',
    year: 2024,
    readDate: '2024-04-12',
    rating: 4,
    tags: ['web-development', 'trends'],
  },
];

