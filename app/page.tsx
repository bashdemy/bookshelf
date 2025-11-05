import { getReadingItemStats } from '@/lib/reading-items';
import Link from 'next/link';

export default async function Home() {
  const stats = await getReadingItemStats('bashdemy');
  const totalPages = stats.totalPages;
  const totalItems = stats.bookCount + stats.articleCount;

  return (
    <main className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl text-center">
        <p className="mb-8 text-xl text-pink-600">
          Track your reading journey, discover new books and articles, and explore your reading statistics.
        </p>
        
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Link
            href="/books"
            className="group rounded-2xl border border-pink-200/70 bg-pink-100/90 p-6 text-center transition-all hover:border-pink-300/80 hover:bg-pink-200 hover:shadow-lg hover:shadow-pink-200/40"
          >
            <div className="mb-2 text-4xl">📖</div>
            <h3 className="mb-1 text-lg font-semibold text-pink-700">Books</h3>
            <p className="text-sm text-pink-600">{stats.bookCount} books</p>
          </Link>
          
          <Link
            href="/articles"
            className="group rounded-2xl border border-pink-200/70 bg-pink-100/90 p-6 text-center transition-all hover:border-pink-300/80 hover:bg-pink-200 hover:shadow-lg hover:shadow-pink-200/40"
          >
            <div className="mb-2 text-4xl">✨</div>
            <h3 className="mb-1 text-lg font-semibold text-pink-700">Articles</h3>
            <p className="text-sm text-pink-600">{stats.articleCount} articles</p>
          </Link>
          
          <Link
            href="/stats"
            className="group rounded-2xl border border-pink-200/70 bg-pink-100/90 p-6 text-center transition-all hover:border-pink-300/80 hover:bg-pink-200 hover:shadow-lg hover:shadow-pink-200/40"
          >
            <div className="mb-2 text-4xl">📊</div>
            <h3 className="mb-1 text-lg font-semibold text-pink-700">Statistics</h3>
            <p className="text-sm text-pink-600">{totalPages.toLocaleString()} pages</p>
          </Link>
        </div>
        
        <div className="rounded-2xl border border-pink-200/70 bg-pink-100/90 p-8">
          <p className="text-lg text-pink-700">
            <span className="font-semibold">{totalItems}</span> items tracked •{' '}
            <span className="font-semibold">{totalPages.toLocaleString()}</span> pages read
          </p>
        </div>
      </div>
    </main>
  );
}
