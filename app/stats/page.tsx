import { bashdemyBooks, bashdemyArticles } from '@/data/bashdemy';
import StatsSection from '@/components/StatsSection';

export default function StatsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-pink-700">
          Statistics and Analytics
        </h1>
        <p className="mt-2 text-pink-600">
          View your reading statistics & insights
        </p>
      </div>
      <StatsSection books={bashdemyBooks} articles={bashdemyArticles} />
    </main>
  );
}

