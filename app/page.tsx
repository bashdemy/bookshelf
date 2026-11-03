import Link from 'next/link';
import {
  IconBooks,
  IconChartBar,
  IconUser,
  IconArrowRight,
  IconSparkles,
  IconHeart,
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
  const recentItems = allItems.slice(0, 6);

  const navCards = [
    {
      href: '/books',
      Icon: IconBooks,
      eyebrow: 'Chapter I',
      title: 'The Book Stacks',
      body: `Explore and search all ${stats.bookCount} volumes`,
      gradient: 'from-pink-500/15 to-rose-400/10',
    },
    {
      href: '/stats',
      Icon: IconChartBar,
      eyebrow: 'Chapter II',
      title: 'Reading Habits',
      body: 'Pace, leaf counts, and favorite genres',
      gradient: 'from-purple-500/15 to-pink-400/10',
    },
    {
      href: user?.username ? `/u/${user.username}` : '/login',
      Icon: IconUser,
      eyebrow: 'Chapter III',
      title: user ? 'Reader Profile' : 'Reader Login',
      body: user ? `Signed in as @${user.username}` : 'Sign in to add books and log reads',
      gradient: 'from-amber-500/15 to-pink-400/10',
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-16">
      {/* Whimsical Hero Header */}
      <section className="mx-auto max-w-3xl pt-8 pb-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/90 text-pink-700 text-xs font-semibold mb-4 shadow-2xs border border-pink-200/60 animate-fadeIn">
          <IconSparkles size={14} className="text-pink-500 animate-pulse" />
          <span>Welcome to my personal reading nook</span>
          <span className="text-pink-400">✦</span>
        </div>

        <h1 className="font-serif italic font-normal text-5xl sm:text-7xl leading-[1.08] tracking-tight text-pink-950">
          bashdemy&apos;s Bookshelf
        </h1>

        {/* Floating Stat Pills */}
        <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-3 font-sans">
          {[
            { value: stats.bookCount, label: 'volumes' },
            { value: totalPages.toLocaleString(), label: 'pages read' },
            { value: '8 cubbies', label: 'on the shelf' },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-pink-200/80 shadow-xs"
            >
              <span className="font-serif font-bold text-lg text-pink-950">{s.value}</span>
              <span className="text-xs text-pink-500 font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* The Interactive Bookshelf */}
      <section className="w-full">
        <InteractiveBookshelf />
      </section>

      {/* Chapter Cards */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {navCards.map(({ href, Icon, eyebrow, title, body, gradient }) => (
          <Link
            key={title}
            href={href}
            className="whimsical-card group flex items-center justify-between p-6 sm:p-7"
          >
            <div>
              <p className="flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider text-pink-500 mb-1">
                <Icon size={14} />
                <span>{eyebrow}</span>
              </p>
              <h3 className="font-serif text-xl font-bold text-pink-950 group-hover:text-pink-600 transition-colors">
                {title}
              </h3>
              <p className="mt-1 font-sans text-xs text-pink-700/80">{body}</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 text-pink-600 group-hover:bg-pink-500 group-hover:text-white transition-all shadow-xs shrink-0 group-hover:translate-x-1">
              <IconArrowRight size={16} />
            </span>
          </Link>
        ))}
      </section>

      {/* Recent Reads Section */}
      {recentItems.length > 0 && (
        <section className="space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-pink-600 mb-1">
              <IconHeart size={14} className="text-pink-500 fill-pink-500" />
              <span>Just Cataloged</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-pink-950">
              Fresh Off the Shelf
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {recentItems.map((item) => (
              <ReadingItemCard key={item.id} item={item} canEdit={!!user} />
            ))}
          </div>

          <div className="text-center pt-2">
            <Link
              href="/books"
              className="whimsical-btn-secondary text-xs py-2.5 px-6"
            >
              <span>Explore all {stats.bookCount} books</span>
              <IconArrowRight size={14} />
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
