import Link from 'next/link';
import {
  IconFlower,
  IconBooks,
  IconFileText,
  IconLayoutGrid,
  IconChartBar,
  IconUser,
  IconArrowRight,
} from '@tabler/icons-react';
import { getReadingItemStats, getReadingItemsByUser } from '@/lib/reading-items';
import ReadingItemCard from '@/components/ReadingItemCard';
import InteractiveBookshelf from '@/components/InteractiveBookshelf';
import { getCurrentUser } from '@/lib/auth-helpers';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const user = await getCurrentUser();
  const userId = user?.id || 'bashdemy';
  const [stats, allItems] = await Promise.all([
    getReadingItemStats(userId),
    getReadingItemsByUser(userId),
  ]);
  const totalPages = stats.totalPages;
  const totalItems = stats.bookCount + stats.articleCount;
  const recentItems = allItems.slice(0, 6);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Editorial Header Banner */}
      <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b pb-6" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center justify-center h-7 w-7 rounded-full bg-pink-100 text-pink-600 border border-pink-200">
              <IconFlower size={16} />
            </span>
            <span className="rounded-md bg-pink-100/90 border border-pink-300/80 px-3 py-1 text-xs font-serif font-bold uppercase tracking-wider text-pink-900 shadow-2xs">
              Personal Archive & Physical Shelf
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-serif" style={{ color: 'var(--color-foreground)' }}>
            bashdemy&apos;s Bookshelf
          </h1>
          <p className="mt-2 text-sm sm:text-base text-pink-950/70 max-w-2xl leading-relaxed">
            A tactile chronicle of <span className="font-bold text-pink-700">{stats.bookCount} physical volumes</span> and articles read from 2017 to the present. Explore the real bookcase camera below, zoom into any cubby, and inspect individual book spines.
          </p>
        </div>

        {/* Quick Stat Badges */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="rounded-2xl border border-pink-200/80 px-4 py-2.5 text-center bg-white shadow-xs">
            <p className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-pink-600">
              <IconBooks size={13} />
              <span>Physical Books</span>
            </p>
            <p className="text-xl font-black text-pink-950 font-mono">{stats.bookCount}</p>
          </div>
          <div className="rounded-2xl border border-pink-200/80 px-4 py-2.5 text-center bg-white shadow-xs">
            <p className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-pink-600">
              <IconFileText size={13} />
              <span>Pages Indexed</span>
            </p>
            <p className="text-xl font-black text-pink-600 font-mono">{totalPages.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-pink-200/80 px-4 py-2.5 text-center bg-white shadow-xs">
            <p className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-pink-600">
              <IconLayoutGrid size={13} />
              <span>Shelf Cubbies</span>
            </p>
            <p className="text-xl font-black text-rose-600 font-mono">8 / 8</p>
          </div>
        </div>
      </section>

      {/* The Hero Centerpiece: Interactive Physical Bookshelf */}
      <section className="w-full">
        <InteractiveBookshelf />
      </section>

      {/* Quick Navigation Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/books"
          className="group flex items-center justify-between rounded-2xl border border-pink-200/80 p-5 transition-all hover:-translate-y-1 hover:border-pink-400 hover:shadow-lg hover:shadow-pink-500/10 bg-white"
        >
          <div>
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-pink-100 text-pink-700 border border-pink-200/60 mb-3 group-hover:scale-105 transition-transform">
              <IconBooks size={22} />
            </div>
            <h3 className="font-bold text-base text-stone-900 group-hover:text-pink-600 transition-colors">
              Full Book Catalog
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Browse, filter by genre, and sort all {stats.bookCount} books
            </p>
          </div>
          <IconArrowRight size={18} className="text-pink-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/stats"
          className="group flex items-center justify-between rounded-2xl border border-pink-200/80 p-5 transition-all hover:-translate-y-1 hover:border-pink-400 hover:shadow-lg hover:shadow-pink-500/10 bg-white"
        >
          <div>
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-pink-100 text-pink-700 border border-pink-200/60 mb-3 group-hover:scale-105 transition-transform">
              <IconChartBar size={22} />
            </div>
            <h3 className="font-bold text-base text-stone-900 group-hover:text-pink-600 transition-colors">
              Reading Analytics
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Annual velocity, genre distributions & page counts
            </p>
          </div>
          <IconArrowRight size={18} className="text-pink-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href={user?.username ? `/u/${user.username}` : '/login'}
          className="group flex items-center justify-between rounded-2xl border border-pink-200/80 p-5 transition-all hover:-translate-y-1 hover:border-pink-400 hover:shadow-lg hover:shadow-pink-500/10 bg-white"
        >
          <div>
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-pink-100 text-pink-700 border border-pink-200/60 mb-3 group-hover:scale-105 transition-transform">
              <IconUser size={22} />
            </div>
            <h3 className="font-bold text-base text-stone-900 group-hover:text-pink-600 transition-colors">
              {user ? 'My Profile' : 'Curator Login'}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {user ? `Logged in as @${user.username}` : 'Sign in to add & manage shelf items'}
            </p>
          </div>
          <IconArrowRight size={18} className="text-pink-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>

      {/* Recent Acquisitions & Timeline */}
      {recentItems.length > 0 && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-serif text-stone-900">
                Latest Additions to Archive
              </h2>
              <p className="text-xs text-stone-500">
                Recently completed works and additions
              </p>
            </div>
            <Link
              href="/books"
              className="inline-flex items-center gap-1 text-xs font-bold text-pink-600 hover:text-pink-800 group"
            >
              <span>View complete archive</span>
              <IconArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {recentItems.map((item) => (
              <ReadingItemCard key={item.id} item={item} canEdit={!!user} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
