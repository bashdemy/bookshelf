import Link from 'next/link';
import {
  IconBooks,
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
  const recentItems = allItems.slice(0, 6);

  const navCards = [
    {
      href: '/books',
      Icon: IconBooks,
      eyebrow: 'Chapter I',
      title: 'The Entire Stacks',
      body: `Browse, filter and search all ${stats.bookCount} books`,
    },
    {
      href: '/stats',
      Icon: IconChartBar,
      eyebrow: 'Chapter II',
      title: 'Reading Habits',
      body: 'Pace, page counts and favourite rabbit holes',
    },
    {
      href: user?.username ? `/u/${user.username}` : '/login',
      Icon: IconUser,
      eyebrow: 'Chapter III',
      title: user ? 'My Profile' : 'Curator Login',
      body: user ? `Signed in as @${user.username}` : 'Sign in to add books and log reads',
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-14">
      {/* Title page */}
      <section className="mx-auto max-w-3xl pt-6 text-center">
        <p className="text-[10px] uppercase tracking-[0.45em] font-serif text-gold-dark">
          A Personal Library
        </p>
        <h1 className="mt-4 font-serif italic font-normal text-5xl sm:text-7xl leading-[1.05] tracking-tight text-pink-900">
          bashdemy&apos;s Bookshelf
        </h1>
        <div className="ornament mx-auto mt-6 max-w-xs text-sm">❦</div>

        <dl className="mx-auto mt-9 flex max-w-xl items-center justify-center gap-6 sm:gap-10 font-serif">
          {[
            { value: stats.bookCount, label: 'volumes' },
            { value: totalPages.toLocaleString(), label: 'pages read' },
            { value: 8, label: 'cubbies' },
          ].map((s, i) => (
            <div key={s.label} className="flex items-center gap-6 sm:gap-10">
              {i > 0 && <span className="text-gold text-xs">◆</span>}
              <div>
                <dt className="sr-only">{s.label}</dt>
                <dd className="gold-text text-3xl sm:text-4xl font-semibold leading-none">{s.value}</dd>
                <p className="mt-1.5 text-[11px] italic text-pink-800/70">{s.label}</p>
              </div>
            </div>
          ))}
        </dl>
      </section>

      {/* The real bookshelf */}
      <section className="w-full">
        <InteractiveBookshelf />
      </section>

      {/* Chapters */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {navCards.map(({ href, Icon, eyebrow, title, body }) => (
          <Link
            key={title}
            href={href}
            className="bookplate group flex items-center justify-between rounded-sm p-6 transition-transform duration-200 hover:-translate-y-1"
          >
            <div>
              <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-serif text-gold-dark">
                <Icon size={14} className="text-gold" />
                {eyebrow}
              </p>
              <h3 className="mt-2 font-serif text-xl font-medium text-pink-900 group-hover:text-pink-700">
                {title}
              </h3>
              <p className="mt-1 font-serif italic text-xs text-pink-800/70">{body}</p>
            </div>
            <IconArrowRight size={18} className="shrink-0 text-gold transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </section>

      {/* Recent reads */}
      {recentItems.length > 0 && (
        <section className="space-y-6">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.4em] font-serif text-gold-dark">Recently</p>
            <h2 className="mt-2 font-serif italic font-normal text-3xl sm:text-4xl text-pink-900">
              Fresh off the shelf
            </h2>
            <div className="ornament mx-auto mt-4 max-w-[10rem] text-xs">❦</div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {recentItems.map((item) => (
              <ReadingItemCard key={item.id} item={item} canEdit={!!user} />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/books"
              className="group inline-flex items-center gap-1.5 font-serif italic text-sm text-pink-800 hover:text-pink-950"
            >
              <span className="border-b border-gold/50 group-hover:border-gold">Explore the full catalogue</span>
              <IconArrowRight size={14} className="text-gold transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
