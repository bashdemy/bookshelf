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
  IconBook2,
  IconCards,
} from '@tabler/icons-react';
import {
  PHYSICAL_SHELF_BOOKS,
  SHELF_CUBBIES,
  PhysicalBook,
  ShelfCubbyInfo,
} from '@/lib/shelf-data';
import BookSpine, { BookCover, vintageTone } from '@/components/BookSpine';

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
    <div className={`bookplate relative rounded-sm ${className}`}>
      {/* ---------- Title block ---------- */}
      <div className="relative flex flex-col gap-5 px-6 pt-8 pb-6 sm:px-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <p className="mb-2 text-[10px] uppercase tracking-[0.35em] font-serif text-gold">
            Ex Libris · bashdemy
          </p>
          <h2 className="font-serif italic text-3xl sm:text-4xl font-normal tracking-tight text-pink-900">
            The Real Bookshelf
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {zoomedCubby && (
            <button
              type="button"
              onClick={showAll}
              className="flex items-center gap-1.5 rounded-sm px-3.5 py-2 text-xs font-serif font-semibold text-white bg-pink-700 hover:bg-pink-800 border border-pink-900/40 shadow-xs active:translate-y-[1px]"
            >
              <IconZoomOut size={14} />
              <span>Whole bookcase</span>
            </button>
          )}
          <div className="relative flex items-center">
            <IconSearch size={14} className="absolute left-3 text-gold pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find a book (Vonnegut, ADHD…)"
              className="w-56 sm:w-64 rounded-sm border border-gold/40 bg-white/80 pl-8 pr-7 py-2 text-xs font-serif italic text-pink-900 placeholder:text-pink-800/45 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/50 shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-pink-700 hover:text-pink-900"
                aria-label="Clear search"
              >
                <IconX size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-6 sm:mx-10 ornament text-xs">❦</div>

      {/* ---------- Cubby index ---------- */}
      <div className="flex items-center gap-1.5 overflow-x-auto px-6 sm:px-10 py-4 text-xs">
        <button
          type="button"
          onClick={showAll}
          className={`flex items-center gap-1.5 rounded-sm px-3 py-1.5 font-serif whitespace-nowrap border ${
            activeCubby === 'all' && !zoomedCubby
              ? 'brass-plate font-semibold'
              : 'bg-white/70 text-pink-900 border-gold/30 hover:border-gold/70'
          }`}
        >
          <IconBooks size={13} />
          <span>Every shelf ({PHYSICAL_SHELF_BOOKS.length})</span>
        </button>
        {cubbiesList.map((c) => {
          const isSelected = activeCubby === c.id || zoomedCubby === c.id;
          const roman = CUBBY_HOTSPOTS[c.id]?.roman || 'I';
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => handleCubbyClick(c.id)}
              className={`flex items-center gap-1.5 rounded-sm px-3 py-1.5 font-serif whitespace-nowrap border ${
                isSelected
                  ? 'brass-plate font-semibold'
                  : 'bg-white/70 text-pink-900 border-gold/30 hover:border-gold/70'
              }`}
            >
              <span className={`text-[11px] font-semibold ${isSelected ? '' : 'text-gold-dark'}`}>{roman}</span>
              <span>{c.title.split(' ')[0].replace(',', '')}</span>
              <span className="text-[10px] opacity-60 font-mono">{booksByCubby[c.id]?.length || 0}</span>
            </button>
          );
        })}
      </div>

      {/* ---------- Photograph + shelf ---------- */}
      <div className="grid gap-8 px-6 pb-10 sm:px-10 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        {/* Gilt-framed photograph */}
        <div className="lg:sticky lg:top-24 self-start">
          <div className="gilt-frame">
            <div className="frame-mat">
              <div className="relative w-full aspect-[3/4] overflow-hidden select-none bg-pink-100">
                <div
                  className="absolute inset-0 transition-transform duration-700 ease-out will-change-transform"
                  style={{
                    transformOrigin: zoomedCubby ? CUBBY_HOTSPOTS[zoomedCubby]?.zoomOrigin : '50% 50%',
                    transform: zoomedCubby ? 'scale(2.35)' : 'scale(1)',
                  }}
                >
                  <Image
                    src="/bookshelf_web.jpg"
                    alt="Maria's 2x4 physical bookshelf"
                    fill
                    priority
                    className="object-cover"
                    style={{ filter: 'sepia(0.18) saturate(0.92) contrast(1.02)' }}
                    sizes="(max-width: 1024px) 100vw, 420px"
                  />
                  {/* warm print tone */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#f6d9cf]/10 via-transparent to-[#5a2232]/15 mix-blend-multiply" />

                  {Object.entries(CUBBY_HOTSPOTS).map(([key, spot]) => {
                    const isActive = zoomedCubby === key || activeCubby === key;
                    return (
                      <div
                        key={key}
                        onClick={() => handleCubbyClick(key)}
                        className={`group absolute cursor-pointer transition-colors duration-200 ${
                          isActive
                            ? 'bg-[#E9CD86]/15 outline outline-2 outline-[#E9CD86]'
                            : 'outline outline-1 outline-white/0 hover:outline-[#E9CD86]/90 hover:bg-[#E9CD86]/10'
                        }`}
                        style={{
                          left: `${spot.x}%`,
                          top: `${spot.y}%`,
                          width: `${spot.width}%`,
                          height: `${spot.height}%`,
                        }}
                      >
                        <span className="brass-plate pointer-events-none absolute top-1.5 left-1.5 rounded-[2px] px-1.5 py-px text-[9px] font-serif font-semibold">
                          {spot.roman}
                        </span>
                        <span className="pointer-events-none absolute bottom-1.5 right-1.5 flex items-center gap-1 rounded-[2px] bg-[#FFFAF5]/95 px-1.5 py-0.5 text-[9px] font-serif text-pink-900 opacity-0 group-hover:opacity-100 transition-opacity">
                          {zoomedCubby === key ? <IconZoomOut size={10} /> : <IconZoomIn size={10} />}
                          {zoomedCubby === key ? 'Step back' : 'Lean in'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <p className="mt-3 text-center font-serif italic text-[11px] text-pink-800/70">
            The real photograph · {zoomedCubby ? `Cubby ${CUBBY_HOTSPOTS[zoomedCubby]?.roman}` : 'the whole case'}
          </p>
        </div>

        {/* Right column: pulled book + shelves */}
        <div className="min-w-0 space-y-6">
          {activeBook && (
            <div className="bookplate rounded-sm p-5 sm:p-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row gap-6">
                <BookCover book={activeBook} className="self-center sm:self-start" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.3em] font-serif text-gold">
                    Pulled from cubby {CUBBY_HOTSPOTS[activeBook.cubby]?.roman}
                  </p>
                  <h3 className="mt-1.5 font-serif text-2xl font-medium leading-tight text-pink-900">
                    {activeBook.title}
                  </h3>
                  <p className="mt-1 font-serif italic text-sm text-pink-800">by {activeBook.author}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-serif text-pink-800/80">
                    <span>{activeBook.year > 0 ? activeBook.year : `${Math.abs(activeBook.year)} BC`}</span>
                    <span className="text-gold">·</span>
                    <span>{activeBook.pages} pages</span>
                    <span className="text-gold">·</span>
                    <span className="italic">{activeBook.genre}</span>
                    <span className="text-gold">·</span>
                    <span className="flex items-center gap-0.5 text-gold">
                      {Array.from({ length: 5 }).map((_, i) =>
                        i < activeBook.rating ? (
                          <IconStarFilled key={i} size={11} />
                        ) : (
                          <IconStar key={i} size={11} className="opacity-40" />
                        )
                      )}
                    </span>
                  </div>

                  <div className="gilt-rule my-4" />

                  <p className="text-sm leading-relaxed text-pink-900/85">{activeBook.description}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyTitle(activeBook.title)}
                      className="flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-serif text-pink-900 bg-white/80 border border-gold/40 hover:border-gold active:translate-y-[1px]"
                    >
                      {copiedTitle ? <IconCheck size={13} className="text-gold-dark" /> : <IconCopy size={13} className="text-gold-dark" />}
                      <span>{copiedTitle ? 'Copied' : 'Copy title'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedBook(null)}
                      className="flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-serif font-semibold text-white bg-pink-700 hover:bg-pink-800 border border-pink-900/40 active:translate-y-[1px]"
                    >
                      <IconX size={13} />
                      <span>Put it back</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="flex items-center gap-2 font-serif text-lg font-medium text-pink-900">
                <IconBook2 size={17} className="text-gold" />
                {currentCubby ? SHELF_CUBBIES[currentCubby]?.title : 'Every shelf, top to bottom'}
              </h4>
              <p className="mt-0.5 text-xs italic font-serif text-pink-800/75">
                {currentCubby
                  ? SHELF_CUBBIES[currentCubby]?.description
                  : 'Hover a spine to slide it out, click to take it off the shelf.'}
              </p>
            </div>
            <div className="flex shrink-0 items-center rounded-sm border border-gold/40 bg-white/70 p-0.5 text-xs">
              {(
                [
                  { id: 'shelf', label: 'On the shelf', Icon: IconBooks },
                  { id: 'cards', label: 'Card catalogue', Icon: IconCards },
                ] as const
              ).map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setDrawerMode(id)}
                  className={`flex items-center gap-1.5 rounded-[2px] px-3 py-1.5 font-serif ${
                    drawerMode === id ? 'brass-plate font-semibold' : 'text-pink-800 hover:text-pink-950'
                  }`}
                >
                  <Icon size={13} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Genre filter */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-serif">
            <span className="mr-1 italic text-pink-800/70">Subject:</span>
            {['all', ...availableGenres].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGenre(selectedGenre === g ? 'all' : g)}
                className={`rounded-sm px-2 py-0.5 border ${
                  selectedGenre === g
                    ? 'bg-pink-700 text-white border-pink-800'
                    : 'bg-white/60 text-pink-900 border-gold/25 hover:border-gold/60'
                }`}
              >
                {g === 'all' ? 'Everything' : g}
              </button>
            ))}
          </div>

          {shelfRows.length === 0 && (
            <p className="py-10 text-center font-serif italic text-sm text-pink-800/70">
              Nothing on this shelf matches that subject.
            </p>
          )}

          {drawerMode === 'shelf' ? (
            <div className="space-y-7">
              {shelfRows.map(({ cubby, books }) => (
                <div key={cubby.id}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => handleCubbyClick(cubby.id)}
                      className="brass-plate rounded-[2px] px-2.5 py-0.5 text-[10px] font-serif font-semibold tracking-wide"
                    >
                      {CUBBY_HOTSPOTS[cubby.id]?.roman} · {cubby.title}
                    </button>
                    <span className="font-serif italic text-[11px] text-pink-800/60">
                      {books.length} {books.length === 1 ? 'volume' : 'volumes'}
                    </span>
                  </div>
                  <div className="cubby-back overflow-x-auto rounded-t-[3px] px-4 pt-7">
                    <div className="flex min-w-max items-end gap-[3px]">
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
                  <div className="shelf-plank rounded-b-[2px]" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {shelfRows.flatMap(({ books }) => books).map((book, idx) => {
                const isSelected = selectedBook?.id === book.id;
                return (
                  <button
                    key={book.id}
                    type="button"
                    onClick={() => handleBookClick(book)}
                    className={`group relative text-left rounded-[2px] border bg-[#FFFCF7] px-4 pt-3 pb-3.5 transition-transform duration-200 hover:-translate-y-0.5 ${
                      isSelected ? 'border-gold shadow-[0_0_0_1px_#E9CD86]' : 'border-[#E8D9C8]'
                    }`}
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(180deg, transparent 0 21px, rgba(166,69,91,0.12) 21px 22px)',
                      backgroundPosition: '0 30px',
                    }}
                  >
                    {/* catalogue card punch hole */}
                    <span className="absolute bottom-1.5 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#E8D9C8]" />
                    <div className="flex items-center justify-between font-mono text-[9px] text-pink-700/80">
                      <span>{CUBBY_HOTSPOTS[book.cubby]?.roman}.{String(idx + 1).padStart(2, '0')}</span>
                      <span
                        className="h-2.5 w-2.5 rounded-[1px]"
                        style={{ background: vintageTone(book.spineColor), boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.15)' }}
                      />
                    </div>
                    <p className="mt-1.5 font-serif text-sm font-medium leading-snug text-pink-900 line-clamp-2 group-hover:text-pink-700">
                      {book.title}
                    </p>
                    <p className="font-serif italic text-xs text-pink-800/75 truncate">{book.author}</p>
                    <div className="mt-2 flex items-center justify-between text-[10px] font-serif text-pink-800/70">
                      <span>
                        {book.year > 0 ? book.year : `${Math.abs(book.year)} BC`} · {book.pages} pp
                      </span>
                      <span className="flex text-gold">
                        {Array.from({ length: book.rating }).map((_, i) => (
                          <IconStarFilled key={i} size={9} />
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
