'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import {
  IconSearch,
  IconZoomIn,
  IconZoomOut,
  IconX,
  IconCheck,
  IconCopy,
  IconStarFilled,
  IconStar,
  IconBooks,
  IconSparkles,
  IconCards,
  IconHeart,
} from '@tabler/icons-react';
import {
  PHYSICAL_SHELF_BOOKS,
  SHELF_CUBBIES,
  PhysicalBook,
  ShelfCubbyInfo,
} from '@/lib/shelf-data';
import BookSpine, { BookCover } from '@/components/BookSpine';

interface InteractiveBookshelfProps {
  onSelectBook?: (book: PhysicalBook) => void;
  className?: string;
  initialCubby?: string;
}

interface CubbyHotspot {
  id: 'r1c1' | 'r1c2' | 'r1c3' | 'r1c4' | 'r2c1' | 'r2c2' | 'r2c3' | 'r2c4';
  x: number;
  y: number;
  width: number;
  height: number;
  zoomOrigin: string;
  roman: string;
}

const CUBBY_HOTSPOTS: Record<string, CubbyHotspot> = {
  // Tier 1 (Top)
  r2c1: { id: 'r2c1', x: 13.7, y: 3.1, width: 33.0, height: 24.7, zoomOrigin: '30% 15%', roman: 'I' },
  r1c1: { id: 'r1c1', x: 47.8, y: 3.1, width: 33.0, height: 24.7, zoomOrigin: '65% 15%', roman: 'II' },
  // Tier 2 (Upper Middle)
  r2c2: { id: 'r2c2', x: 13.7, y: 29.2, width: 33.0, height: 24.4, zoomOrigin: '30% 41%', roman: 'III' },
  r1c2: { id: 'r1c2', x: 47.8, y: 29.2, width: 33.0, height: 24.4, zoomOrigin: '65% 41%', roman: 'IV' },
  // Tier 3 (Lower Middle)
  r2c3: { id: 'r2c3', x: 13.7, y: 54.4, width: 33.8, height: 20.8, zoomOrigin: '30% 65%', roman: 'V' },
  r1c3: { id: 'r1c3', x: 47.8, y: 54.4, width: 33.0, height: 20.8, zoomOrigin: '65% 65%', roman: 'VI' },
  // Tier 4 (Bottom)
  r2c4: { id: 'r2c4', x: 13.7, y: 76.4, width: 33.0, height: 19.4, zoomOrigin: '30% 86%', roman: 'VII' },
  r1c4: { id: 'r1c4', x: 47.8, y: 76.4, width: 33.0, height: 19.4, zoomOrigin: '65% 86%', roman: 'VIII' },
};

export default function InteractiveBookshelf({
  onSelectBook,
  className = '',
  initialCubby = 'all',
}: InteractiveBookshelfProps) {
  const [activeCubby, setActiveCubby] = useState<string>(initialCubby);
  const [zoomedCubby, setZoomedCubby] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<PhysicalBook | null>(null);
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'shelf' | 'cards'>('shelf');

  const cubbiesList: ShelfCubbyInfo[] = useMemo(() => [
    SHELF_CUBBIES.r2c1, // I: Tier 1 Left
    SHELF_CUBBIES.r1c1, // II: Tier 1 Right
    SHELF_CUBBIES.r2c2, // III: Tier 2 Left
    SHELF_CUBBIES.r1c2, // IV: Tier 2 Right
    SHELF_CUBBIES.r2c3, // V: Tier 3 Left
    SHELF_CUBBIES.r1c3, // VI: Tier 3 Right
    SHELF_CUBBIES.r2c4, // VII: Tier 4 Left
    SHELF_CUBBIES.r1c4, // VIII: Tier 4 Right
  ], []);

  const booksByCubby = useMemo(() => {
    const map: Record<string, PhysicalBook[]> = {};
    for (const c of cubbiesList) {
      map[c.id] = PHYSICAL_SHELF_BOOKS.filter((b) => b.cubby === c.id);
    }
    return map;
  }, [cubbiesList]);

  // Unique genres across physical shelf
  const availableGenres = useMemo(() => {
    const set = new Set<string>();
    for (const b of PHYSICAL_SHELF_BOOKS) {
      if (b.genre) set.add(b.genre);
    }
    return Array.from(set).sort();
  }, []);

  // Handle book search focus
  useEffect(() => {
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase().trim();
    const matched = PHYSICAL_SHELF_BOOKS.find(
      (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    );
    if (matched) {
      setActiveCubby(matched.cubby);
      setSelectedBook(matched);
    }
  }, [searchQuery]);

  const currentCubby = zoomedCubby || (activeCubby !== 'all' ? activeCubby : null);

  const activeBooks = useMemo(() => {
    let list = PHYSICAL_SHELF_BOOKS;
    if (currentCubby && currentCubby !== 'all') {
      list = booksByCubby[currentCubby] || [];
    }
    if (selectedGenre !== 'all') {
      list = list.filter((b) => b.genre === selectedGenre);
    }
    return list;
  }, [currentCubby, booksByCubby, selectedGenre]);

  // Rows of the physical shelf to render (one per cubby, in bookcase order)
  const shelfRows = useMemo(
    () =>
      cubbiesList
        .filter((c) => !currentCubby || c.id === currentCubby)
        .map((c) => ({ cubby: c, books: activeBooks.filter((b) => b.cubby === c.id) }))
        .filter((r) => r.books.length > 0),
    [cubbiesList, currentCubby, activeBooks]
  );

  const activeBook = selectedBook;

  const handleBookClick = (book: PhysicalBook) => {
    setSelectedBook((prev) => (prev?.id === book.id ? null : book));
    if (onSelectBook) onSelectBook(book);
  };

  const handleCubbyClick = (cubbyKey: string) => {
    if (zoomedCubby === cubbyKey) {
      setZoomedCubby(null);
      setActiveCubby('all');
    } else {
      setZoomedCubby(cubbyKey);
      setActiveCubby(cubbyKey);
    }
  };

  const showAll = () => {
    setZoomedCubby(null);
    setActiveCubby('all');
  };

  const handleCopyTitle = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTitle(true);
    setTimeout(() => setCopiedTitle(false), 1800);
  };

  return (
    <div
      className={`relative rounded-3xl overflow-hidden bg-white/80 backdrop-blur-xl border border-pink-200/80 shadow-xl shadow-pink-500/5 ${className}`}
    >
      {/* ---------- Header / Controls ---------- */}
      <div className="relative flex flex-col gap-4 px-6 pt-8 pb-5 sm:px-8 md:flex-row md:items-end md:justify-between border-b border-pink-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/80 text-pink-700 text-xs font-semibold mb-2 shadow-2xs">
            <IconSparkles size={13} className="text-pink-500" />
            <span>Physical Bookshelf · 84 Volumes</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-pink-950">
            The Living Shelf
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {zoomedCubby && (
            <button
              type="button"
              onClick={showAll}
              className="whimsical-btn-secondary text-xs py-2 px-3.5"
            >
              <IconZoomOut size={14} />
              <span>Full View</span>
            </button>
          )}
          <div className="relative flex items-center">
            <IconSearch size={14} className="absolute left-3.5 text-pink-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author…"
              className="w-56 sm:w-64 rounded-full border border-pink-200 bg-white/95 pl-9 pr-8 py-2 text-xs font-sans text-pink-950 placeholder:text-pink-300 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200/60 shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-pink-400 hover:text-pink-700"
                aria-label="Clear search"
              >
                <IconX size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ---------- Cubby Quick-Picker ---------- */}
      <div className="flex items-center gap-1.5 overflow-x-auto px-6 sm:px-8 py-3.5 text-xs bg-pink-50/50 border-b border-pink-100 scrollbar-none">
        <button
          type="button"
          onClick={showAll}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-sans font-semibold whitespace-nowrap transition-all ${
            activeCubby === 'all' && !zoomedCubby
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
              : 'bg-white/90 text-pink-800 border border-pink-200/70 hover:bg-pink-100/60'
          }`}
        >
          <IconBooks size={14} />
          <span>All Cubbies ({PHYSICAL_SHELF_BOOKS.length})</span>
        </button>
        {cubbiesList.map((c) => {
          const isSelected = activeCubby === c.id || zoomedCubby === c.id;
          const roman = CUBBY_HOTSPOTS[c.id]?.roman || 'I';
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => handleCubbyClick(c.id)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-sans whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold shadow-xs'
                  : 'bg-white/90 text-pink-800 border border-pink-200/70 hover:bg-pink-100/60 font-medium'
              }`}
            >
              <span className={`text-[10px] font-bold ${isSelected ? 'text-white' : 'text-pink-500'}`}>{roman}</span>
              <span>{c.title.split(' ')[0].replace(',', '')}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-pink-100 text-pink-700'}`}>
                {booksByCubby[c.id]?.length || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* ---------- Visual Showcase: Photo & Shelf ---------- */}
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,390px)_minmax(0,1fr)]">
        {/* Bookshelf Framed Photo */}
        <div className="lg:sticky lg:top-24 self-start">
          <div className="relative p-2.5 rounded-3xl bg-gradient-to-tr from-pink-200 via-rose-100 to-amber-100 shadow-xl border border-white">
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden select-none bg-pink-100 shadow-inner">
              <div
                className="absolute inset-0 transition-transform duration-700 ease-out will-change-transform"
                style={{
                  transformOrigin: zoomedCubby ? CUBBY_HOTSPOTS[zoomedCubby]?.zoomOrigin : '50% 50%',
                  transform: zoomedCubby ? 'scale(2.35)' : 'scale(1)',
                }}
              >
                <Image
                  src="/bookshelf_web.jpg"
                  alt="Maria's physical bookcase"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 390px"
                />
                
                {/* Soft natural tint */}
                <div className="pointer-events-none absolute inset-0 bg-pink-500/5 mix-blend-overlay" />

                {Object.entries(CUBBY_HOTSPOTS).map(([key, spot]) => {
                  const isActive = zoomedCubby === key || activeCubby === key;
                  return (
                    <div
                      key={key}
                      onClick={() => handleCubbyClick(key)}
                      className={`group absolute cursor-pointer rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-pink-500/25 ring-2 ring-pink-400 ring-offset-1 ring-offset-white'
                          : 'hover:bg-pink-400/20 hover:ring-1 hover:ring-pink-300'
                      }`}
                      style={{
                        left: `${spot.x}%`,
                        top: `${spot.y}%`,
                        width: `${spot.width}%`,
                        height: `${spot.height}%`,
                      }}
                    >
                      <span className="pointer-events-none absolute top-1.5 left-1.5 rounded-full px-2 py-0.5 text-[9px] font-sans font-bold bg-white/95 text-pink-700 shadow-xs border border-pink-200">
                        {spot.roman}
                      </span>
                      <span className="pointer-events-none absolute bottom-1.5 right-1.5 flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-sans font-semibold text-pink-800 opacity-0 group-hover:opacity-100 shadow-xs transition-opacity border border-pink-200">
                        {zoomedCubby === key ? <IconZoomOut size={10} /> : <IconZoomIn size={10} />}
                        {zoomedCubby === key ? 'Zoom out' : 'Peek in'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Pulled book inspection & tactile shelves */}
        <div className="min-w-0 space-y-6">
          {activeBook && (
            <div className="whimsical-card p-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row gap-6">
                <BookCover book={activeBook} size="md" className="self-center sm:self-start" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-pink-600 mb-1">
                    <IconHeart size={13} className="text-pink-500 fill-pink-500" />
                    <span>Cubby {CUBBY_HOTSPOTS[activeBook.cubby]?.roman} · {activeBook.genre}</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold leading-tight text-pink-950">
                    {activeBook.title}
                  </h3>
                  <p className="mt-1 font-sans text-sm text-pink-700 font-medium">by {activeBook.author}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-sans text-pink-800/80">
                    <span>{activeBook.year > 0 ? activeBook.year : `${Math.abs(activeBook.year)} BC`}</span>
                    <span className="text-pink-300">•</span>
                    <span>{activeBook.pages} pages</span>
                    <span className="text-pink-300">•</span>
                    <span className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) =>
                        i < activeBook.rating ? (
                          <IconStarFilled key={i} size={13} />
                        ) : (
                          <IconStar key={i} size={13} className="opacity-30 text-amber-400" />
                        )
                      )}
                    </span>
                  </div>

                  <p className="mt-4 text-xs font-sans leading-relaxed text-pink-950/80 bg-white/70 p-3.5 rounded-xl border border-pink-100">
                    {activeBook.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleCopyTitle(activeBook.title)}
                      className="whimsical-btn-secondary text-xs py-2 px-3.5"
                    >
                      {copiedTitle ? <IconCheck size={13} className="text-emerald-500" /> : <IconCopy size={13} />}
                      <span>{copiedTitle ? 'Copied!' : 'Copy title'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedBook(null)}
                      className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-sans font-medium text-pink-600 hover:text-pink-950 hover:bg-pink-100/60 transition-all"
                    >
                      <IconX size={13} />
                      <span>Put back</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Shelf View Controls */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-pink-100 pb-3">
            <div>
              <h4 className="flex items-center gap-2 font-serif text-lg font-bold text-pink-950">
                <IconSparkles size={16} className="text-pink-500" />
                <span>{currentCubby ? SHELF_CUBBIES[currentCubby]?.title : 'All Shelves'}</span>
              </h4>
              <p className="text-xs font-sans text-pink-700/80">
                {currentCubby
                  ? SHELF_CUBBIES[currentCubby]?.description
                  : 'Tap or hover any book spine to pull it from the shelf'}
              </p>
            </div>
            <div className="flex shrink-0 items-center rounded-full border border-pink-200 bg-white p-0.5 text-xs shadow-2xs">
              {(
                [
                  { id: 'shelf', label: 'Spine View', Icon: IconBooks },
                  { id: 'cards', label: 'Index Cards', Icon: IconCards },
                ] as const
              ).map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setDrawerMode(id)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-sans font-medium transition-all ${
                    drawerMode === id
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold shadow-xs'
                      : 'text-pink-700 hover:text-pink-950'
                  }`}
                >
                  <Icon size={13} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Genre Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-sans">
            <span className="mr-1 font-semibold text-pink-700 text-[11px]">Filter:</span>
            {['all', ...availableGenres].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGenre(selectedGenre === g ? 'all' : g)}
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-sans transition-all ${
                  selectedGenre === g
                    ? 'bg-pink-600 text-white font-semibold shadow-2xs'
                    : 'bg-white/80 text-pink-700 border border-pink-200/80 hover:bg-pink-100/60'
                }`}
              >
                {g === 'all' ? 'All' : g}
              </button>
            ))}
          </div>

          {shelfRows.length === 0 && (
            <div className="py-12 text-center font-sans text-xs text-pink-600/70">
              No volumes found matching this filter.
            </div>
          )}

          {drawerMode === 'shelf' ? (
            <div className="space-y-8">
              {shelfRows.map(({ cubby, books }) => (
                <div key={cubby.id} className="group">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => handleCubbyClick(cubby.id)}
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-sans font-semibold text-pink-900 bg-pink-100/80 hover:bg-pink-200 border border-pink-200 shadow-2xs transition-all"
                    >
                      <span className="text-pink-500 font-bold">{CUBBY_HOTSPOTS[cubby.id]?.roman}</span>
                      <span>·</span>
                      <span>{cubby.title}</span>
                    </button>
                    <span className="font-sans text-xs text-pink-400 font-medium">
                      {books.length} {books.length === 1 ? 'book' : 'books'}
                    </span>
                  </div>
                  
                  {/* Whimsical Shelf Cubby */}
                  <div className="cubby-back overflow-x-auto rounded-t-2xl px-5 pt-8 shadow-inner border-t border-x border-pink-200/60">
                    <div className="flex min-w-max items-end gap-1 pb-1">
                      {books.map((book) => (
                        <BookSpine
                          key={book.id}
                          book={book}
                          selected={selectedBook?.id === book.id}
                          onClick={() => handleBookClick(book)}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="shelf-plank rounded-b-md" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
              {shelfRows.flatMap(({ books }) => books).map((book, idx) => {
                const isSelected = selectedBook?.id === book.id;
                return (
                  <button
                    key={book.id}
                    type="button"
                    onClick={() => handleBookClick(book)}
                    className={`group relative text-left rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-1 bg-white/90 ${
                      isSelected
                        ? 'border-pink-500 shadow-lg shadow-pink-500/15 ring-2 ring-pink-300'
                        : 'border-pink-200/80 hover:border-pink-300 shadow-xs hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-sans font-bold text-pink-500">
                      <span>{CUBBY_HOTSPOTS[book.cubby]?.roman} · #{idx + 1}</span>
                      <span
                        className="h-2.5 w-2.5 rounded-full shadow-2xs"
                        style={{ backgroundColor: book.spineColor || '#F472B6' }}
                      />
                    </div>
                    <p className="mt-1 font-serif text-sm font-bold text-pink-950 line-clamp-2 group-hover:text-pink-600 transition-colors">
                      {book.title}
                    </p>
                    <p className="font-sans text-xs text-pink-700/80 truncate mt-0.5">{book.author}</p>
                    <div className="mt-2.5 flex items-center justify-between text-[11px] font-sans text-pink-400">
                      <span>
                        {book.year > 0 ? book.year : `${Math.abs(book.year)} BC`} · {book.pages} pp
                      </span>
                      <span className="flex text-amber-400">
                        {Array.from({ length: book.rating }).map((_, i) => (
                          <IconStarFilled key={i} size={11} />
                        ))}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
