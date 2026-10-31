'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  PHYSICAL_SHELF_BOOKS,
  SHELF_CUBBIES,
  PhysicalBook,
  ShelfCubbyInfo,
} from '@/lib/shelf-data';

interface InteractiveBookshelfProps {
  onSelectBook?: (book: PhysicalBook) => void;
  className?: string;
  initialCubby?: string;
}

export default function InteractiveBookshelf({
  onSelectBook,
  className = '',
  initialCubby = 'all',
}: InteractiveBookshelfProps) {
  const [viewMode, setViewMode] = useState<'shelf' | 'photo'>('shelf');
  const [activeCubby, setActiveCubby] = useState<string>(initialCubby);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredBook, setHoveredBook] = useState<PhysicalBook | null>(null);
  const [selectedBook, setSelectedBook] = useState<PhysicalBook | null>(null);
  const [photoHoveredCubby, setPhotoHoveredCubby] = useState<string | null>(null);

  // Filter books by cubby and search
  const filteredBooks = useMemo(() => {
    return PHYSICAL_SHELF_BOOKS.filter((b) => {
      const matchesCubby = activeCubby === 'all' || b.cubby === activeCubby;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.genre.toLowerCase().includes(q);
      return matchesCubby && matchesSearch;
    });
  }, [activeCubby, searchQuery]);

  // Group books by cubby
  const cubbiesList: ShelfCubbyInfo[] = useMemo(() => {
    return [
      SHELF_CUBBIES.r1c1,
      SHELF_CUBBIES.r1c2,
      SHELF_CUBBIES.r1c3,
      SHELF_CUBBIES.r1c4,
      SHELF_CUBBIES.r2c1,
      SHELF_CUBBIES.r2c2,
      SHELF_CUBBIES.r2c3,
      SHELF_CUBBIES.r2c4,
    ];
  }, []);

  const booksByCubby = useMemo(() => {
    const map: Record<string, PhysicalBook[]> = {};
    for (const c of cubbiesList) {
      map[c.id] = PHYSICAL_SHELF_BOOKS.filter((b) => b.cubby === c.id);
    }
    return map;
  }, [cubbiesList]);

  const activeBook = hoveredBook || selectedBook;

  const handleBookClick = (book: PhysicalBook) => {
    setSelectedBook((prev) => (prev?.id === book.id ? null : book));
    if (onSelectBook) {
      onSelectBook(book);
    }
  };

  return (
    <div
      className={`w-full rounded-2xl border p-5 sm:p-7 ${className}`}
      style={{
        background: 'var(--paper)',
        borderColor: 'var(--color-border)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: 'var(--color-foreground)' }}>
              Physical Bookshelf
            </h2>
          </div>
          <p className="mt-1 text-xs sm:text-sm" style={{ color: 'var(--color-foreground-secondary)' }}>
            84 physical volumes across 8 cubbies • Hover over any book spine to inspect details
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center self-start sm:self-auto rounded-full p-1 border" style={{ background: '#EFEBE2', borderColor: 'var(--color-border)' }}>
          <button
            type="button"
            onClick={() => setViewMode('shelf')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              viewMode === 'shelf'
                ? 'bg-white shadow-sm text-stone-900'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>📚</span>
            <span>Interactive Shelf</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('photo')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              viewMode === 'photo'
                ? 'bg-white shadow-sm text-stone-900'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>📷</span>
            <span>Actual Photo</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Cubby Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveCubby('all')}
            className={`rounded-full px-3 py-1 font-semibold whitespace-nowrap transition-colors border ${
              activeCubby === 'all'
                ? 'bg-stone-900 text-stone-50 border-stone-900'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
            }`}
          >
            All Shelf (84)
          </button>
          {cubbiesList.map((c, idx) => {
            const count = booksByCubby[c.id]?.length || 0;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCubby(c.id)}
                className={`rounded-full px-2.5 py-1 font-medium whitespace-nowrap transition-colors border ${
                  activeCubby === c.id
                    ? 'bg-stone-900 text-stone-50 border-stone-900'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-600 border-stone-200'
                }`}
                title={c.title}
              >
                C{idx + 1}: {c.title.split(' ')[0]} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search shelf books..."
            className="w-full rounded-full border px-3.5 py-1.5 text-xs placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-500"
            style={{
              background: '#FAF8F5',
              borderColor: 'var(--color-border)',
              color: 'var(--color-foreground)',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Active / Inspected Book Card Popover (Floating or Sticky) */}
      {activeBook && (
        <div
          className="mt-5 flex flex-col gap-3 rounded-xl border p-4 transition-all duration-200 sm:flex-row sm:items-center sm:justify-between animate-fadeIn"
          style={{
            background: '#FFFFFF',
            borderColor: activeBook.accentColor || 'var(--color-border)',
            borderLeftWidth: '5px',
            borderLeftColor: activeBook.accentColor || 'var(--color-primary)',
            boxShadow: 'var(--shadow-card-hover)',
          }}
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span
                className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                style={{ background: activeBook.spineColor === '#F5F5F3' ? '#444' : activeBook.spineColor }}
              >
                {activeBook.cubbyLabel}
              </span>
              <span className="text-xs font-medium text-stone-500">
                {activeBook.genre} • {activeBook.year} • {activeBook.pages} pages
              </span>
            </div>
            <h3 className="mt-1 text-base sm:text-lg font-bold" style={{ color: 'var(--color-foreground)' }}>
              {activeBook.title}
            </h3>
            <p className="text-xs font-semibold text-stone-600">
              by <span className="text-stone-900">{activeBook.author}</span>
            </p>
            <p className="mt-1 text-xs text-stone-500 line-clamp-2">
              {activeBook.description}
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="flex items-center text-amber-500 text-xs">
              {'★'.repeat(activeBook.rating)}
              <span className="text-stone-400 ml-1 font-semibold">{activeBook.rating}/5</span>
            </div>
            {selectedBook?.id === activeBook.id ? (
              <button
                type="button"
                onClick={() => setSelectedBook(null)}
                className="rounded-full px-3 py-1 text-xs font-medium text-stone-600 hover:bg-stone-100 border border-stone-200"
              >
                Clear Pin
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setSelectedBook(activeBook)}
                className="rounded-full px-3 py-1 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-200"
              >
                Pin Book
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main View Area */}
      {viewMode === 'shelf' ? (
        /* ================= VIRTUAL 2x4 CUBBY SHELF ================= */
        <div className="mt-6">
          <div
            className="rounded-xl p-3 sm:p-5"
            style={{
              background: '#EAE6DC',
              border: '8px solid #FAF8F5',
              boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)',
            }}
          >
            {/* Shelf Frame: 2 Rows x 4 Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {cubbiesList.map((cubby, cubbyIdx) => {
                const books = booksByCubby[cubby.id] || [];
                const isCubbyFiltered = activeCubby !== 'all' && activeCubby !== cubby.id;
                const verticalBooks = books.filter((b) => b.orientation === 'vertical');
                const horizontalBooks = books.filter((b) => b.orientation === 'horizontal');
                const tiltedBooks = books.filter((b) => b.orientation === 'tilted');

                return (
                  <div
                    key={cubby.id}
                    className={`relative flex flex-col justify-end rounded-lg p-3 sm:p-4 transition-all duration-200 min-h-[300px] sm:min-h-[340px] ${
                      isCubbyFiltered ? 'opacity-40 grayscale-[40%]' : 'opacity-100'
                    }`}
                    style={{
                      background: '#F5F2EB',
                      border: '4px solid #DFD9CE',
                      boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.08), inset 0 -4px 6px rgba(0,0,0,0.05)',
                    }}
                  >
                    {/* Cubby Label Badge */}
                    <div className="absolute top-2 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 bg-stone-200/90 rounded px-1.5 py-0.5">
                        C{cubbyIdx + 1}
                      </span>
                      <span className="text-[10px] font-medium text-stone-600 bg-stone-200/80 rounded px-1.5 py-0.5">
                        {books.length} books
                      </span>
                    </div>

                    {/* Cubby Interior: Books Arrangement */}
                    <div className="flex w-full items-end justify-between gap-1.5 pt-7">
                      {/* Left: Vertical Books (if any, like Louridas / Chivers or Peterson Maps) */}
                      {verticalBooks.length > 0 && (
                        <div className="flex items-end gap-1 shrink-0 pb-0.5">
                          {verticalBooks.map((book) => {
                            const isHovered = hoveredBook?.id === book.id;
                            const isSelected = selectedBook?.id === book.id;
                            const isMatchedBySearch =
                              !searchQuery ||
                              book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              book.author.toLowerCase().includes(searchQuery.toLowerCase());

                            return (
                              <div
                                key={book.id}
                                onMouseEnter={() => setHoveredBook(book)}
                                onMouseLeave={() => setHoveredBook(null)}
                                onClick={() => handleBookClick(book)}
                                className={`group relative cursor-pointer select-none rounded-t-sm transition-all duration-200 ${
                                  isHovered || isSelected ? '-translate-y-3 z-30 scale-[1.03]' : 'hover:-translate-y-1.5 z-10'
                                } ${!isMatchedBySearch ? 'opacity-30' : 'opacity-100'}`}
                                style={{
                                  width: `${Math.max(22, (book.thickness || 24))}px`,
                                  height: '220px',
                                  background: book.spineColor,
                                  color: book.textColor,
                                  boxShadow: isHovered || isSelected
                                    ? '0 12px 20px -3px rgba(0,0,0,0.35), 0 4px 6px -2px rgba(0,0,0,0.2)'
                                    : 'inset -2px 0 4px rgba(0,0,0,0.2), inset 2px 0 3px rgba(255,255,255,0.15), 0 2px 4px rgba(0,0,0,0.15)',
                                  borderLeft: '1px solid rgba(255,255,255,0.2)',
                                  borderRight: '1px solid rgba(0,0,0,0.25)',
                                }}
                              >
                                {/* Spine Vertical Text */}
                                <div className="absolute inset-0 flex flex-col justify-between p-1.5 overflow-hidden">
                                  <span className="text-[9px] font-bold uppercase tracking-tight opacity-75 truncate">
                                    {book.author.split(' ')[book.author.split(' ').length - 1]}
                                  </span>
                                  <div className="flex-1 flex items-center justify-center">
                                    <span
                                      className="text-[10px] font-bold tracking-tight whitespace-nowrap"
                                      style={{
                                        writingMode: 'vertical-rl',
                                        transform: 'rotate(180deg)',
                                      }}
                                    >
                                      {book.title}
                                    </span>
                                  </div>
                                  <div className="h-1.5 w-full rounded-full opacity-60" style={{ background: book.accentColor || '#FFFFFF' }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Right / Center: Horizontal Stack */}
                      <div className="flex flex-1 flex-col-reverse justify-end w-full">
                        {/* Top Tilted Book (if any, like Spiegelhalter, Pushkin, Max Allen) */}
                        {tiltedBooks.map((book) => {
                          const isHovered = hoveredBook?.id === book.id;
                          const isSelected = selectedBook?.id === book.id;
                          const isMatchedBySearch =
                            !searchQuery ||
                            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            book.author.toLowerCase().includes(searchQuery.toLowerCase());

                          return (
                            <div
                              key={book.id}
                              onMouseEnter={() => setHoveredBook(book)}
                              onMouseLeave={() => setHoveredBook(null)}
                              onClick={() => handleBookClick(book)}
                              className={`group relative mb-1 cursor-pointer select-none rounded-sm transition-all duration-200 ${
                                isHovered || isSelected ? '-translate-y-2.5 z-30 scale-[1.02]' : 'hover:-translate-y-1 z-10'
                              } ${!isMatchedBySearch ? 'opacity-30' : 'opacity-100'}`}
                              style={{
                                transform: isHovered || isSelected ? 'rotate(-6deg) translateY(-8px)' : 'rotate(-6deg)',
                                height: `${Math.max(18, (book.thickness || 22))}px`,
                                background: book.spineColor,
                                color: book.textColor,
                                boxShadow: isHovered || isSelected
                                  ? '0 10px 18px -2px rgba(0,0,0,0.35)'
                                  : '0 2px 5px rgba(0,0,0,0.2)',
                                borderTop: '1px solid rgba(255,255,255,0.2)',
                                borderBottom: '1px solid rgba(0,0,0,0.3)',
                              }}
                            >
                              <div className="flex h-full items-center justify-between px-2 text-[10px] font-bold truncate">
                                <span className="truncate">{book.title}</span>
                                <span className="opacity-70 text-[9px] ml-1 shrink-0">
                                  {book.author.split(' ')[0]}
                                </span>
                              </div>
                            </div>
                          );
                        })}

                        {/* Horizontal Stack of Books */}
                        {horizontalBooks.map((book) => {
                          const isHovered = hoveredBook?.id === book.id;
                          const isSelected = selectedBook?.id === book.id;
                          const isMatchedBySearch =
                            !searchQuery ||
                            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            book.author.toLowerCase().includes(searchQuery.toLowerCase());

                          return (
                            <div
                              key={book.id}
                              onMouseEnter={() => setHoveredBook(book)}
                              onMouseLeave={() => setHoveredBook(null)}
                              onClick={() => handleBookClick(book)}
                              className={`group relative cursor-pointer select-none rounded-sm transition-all duration-200 ${
                                isHovered || isSelected
                                  ? '-translate-y-1.5 z-30 scale-[1.02]'
                                  : 'hover:-translate-y-0.5 z-10'
                              } ${!isMatchedBySearch ? 'opacity-30' : 'opacity-100'}`}
                              style={{
                                height: `${Math.max(16, Math.min(28, (book.thickness || 20) * 0.85))}px`,
                                background: book.spineColor,
                                color: book.textColor,
                                marginTop: '1.5px',
                                boxShadow: isHovered || isSelected
                                  ? '0 8px 16px -2px rgba(0,0,0,0.32), 0 2px 4px rgba(0,0,0,0.15)'
                                  : 'inset 0 1px 2px rgba(255,255,255,0.15), inset 0 -1px 2px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.1)',
                                borderTop: '1px solid rgba(255,255,255,0.18)',
                                borderBottom: '1px solid rgba(0,0,0,0.28)',
                              }}
                            >
                              <div className="flex h-full items-center justify-between px-2 text-[10px] font-bold">
                                <span className="truncate tracking-tight">{book.title}</span>
                                <span className="opacity-65 text-[9px] ml-1 shrink-0 font-normal">
                                  {book.author.split(' ')[book.author.split(' ').length - 1]}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bottom Shelf Plank Accent */}
                    <div
                      className="mt-1 h-2.5 w-full rounded-sm"
                      style={{
                        background: '#D4CDC0',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.12)',
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* ================= ACTUAL PHYSICAL PHOTO VIEW ================= */
        <div className="mt-6 flex flex-col gap-4">
          <div
            className="relative overflow-hidden rounded-xl border"
            style={{
              borderColor: 'var(--color-border)',
              boxShadow: 'var(--shadow-card)',
              background: '#000000',
            }}
          >
            {/* The Actual Real Bookshelf Photo */}
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/bookshelf_web.jpg"
                alt="Actual physical bookshelf of bashdemy"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />

              {/* Interactive 2x4 Grid Overlays */}
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-2 p-2 sm:p-4 gap-2">
                {cubbiesList.map((cubby, idx) => {
                  const isHovered = photoHoveredCubby === cubby.id;
                  const isSelected = activeCubby === cubby.id;
                  const books = booksByCubby[cubby.id] || [];

                  return (
                    <div
                      key={cubby.id}
                      onMouseEnter={() => setPhotoHoveredCubby(cubby.id)}
                      onMouseLeave={() => setPhotoHoveredCubby(null)}
                      onClick={() => setActiveCubby(cubby.id)}
                      className={`group relative flex cursor-pointer flex-col justify-between rounded-lg p-2 transition-all duration-200 border-2 ${
                        isHovered || isSelected
                          ? 'border-amber-400 bg-amber-500/20 backdrop-blur-[1px] shadow-lg shadow-amber-500/30'
                          : 'border-white/30 bg-black/10 hover:border-white/70 hover:bg-black/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-extrabold text-amber-300">
                          Cubby {idx + 1}
                        </span>
                        <span className="rounded bg-black/60 px-1 text-[9px] font-semibold text-white">
                          {books.length}
                        </span>
                      </div>

                      <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="block truncate rounded bg-black/80 px-1.5 py-0.5 text-[9px] font-bold text-white">
                          {cubby.title}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Photo Explainer & Selected Cubby Book List */}
          <div
            className="rounded-xl border p-4"
            style={{
              background: '#FAF8F5',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <h4 className="text-sm font-bold text-stone-900">
                  {photoHoveredCubby
                    ? SHELF_CUBBIES[photoHoveredCubby]?.title
                    : activeCubby !== 'all'
                    ? SHELF_CUBBIES[activeCubby]?.title
                    : 'All Bookshelf Volumes'}
                </h4>
                <p className="text-xs text-stone-600">
                  {photoHoveredCubby
                    ? SHELF_CUBBIES[photoHoveredCubby]?.description
                    : 'Click any cubby in the photo above to isolate and view its books'}
                </p>
              </div>
              <span className="text-xs font-semibold text-stone-500">
                {filteredBooks.length} titles visible
              </span>
            </div>

            {/* Book Spine Chips in this Cubby */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  onMouseEnter={() => setHoveredBook(book)}
                  onMouseLeave={() => setHoveredBook(null)}
                  onClick={() => handleBookClick(book)}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-2.5 transition-all ${
                    hoveredBook?.id === book.id || selectedBook?.id === book.id
                      ? 'border-amber-500 bg-amber-50 shadow-sm'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="h-3 w-1.5 rounded-sm shrink-0"
                      style={{ background: book.spineColor === '#F5F5F3' ? '#888' : book.spineColor }}
                    />
                    <div className="truncate">
                      <p className="truncate text-xs font-bold text-stone-900">{book.title}</p>
                      <p className="truncate text-[11px] text-stone-500">{book.author}</p>
                    </div>
                  </div>
                  <span className="text-amber-500 text-xs shrink-0 ml-2">
                    {'★'.repeat(book.rating)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
