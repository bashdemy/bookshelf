'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
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
  r1c1: { id: 'r1c1', x: 4.5, y: 7.5, width: 22.5, height: 43.5, zoomOrigin: '15% 30%', roman: 'I' },
  r1c2: { id: 'r1c2', x: 27.5, y: 7.5, width: 22.5, height: 43.5, zoomOrigin: '38% 30%', roman: 'II' },
  r1c3: { id: 'r1c3', x: 50.5, y: 7.5, width: 22.5, height: 43.5, zoomOrigin: '61% 30%', roman: 'III' },
  r1c4: { id: 'r1c4', x: 73.5, y: 7.5, width: 22.5, height: 43.5, zoomOrigin: '84% 30%', roman: 'IV' },
  r2c1: { id: 'r2c1', x: 4.5, y: 51.5, width: 22.5, height: 43.5, zoomOrigin: '15% 73%', roman: 'V' },
  r2c2: { id: 'r2c2', x: 27.5, y: 51.5, width: 22.5, height: 43.5, zoomOrigin: '38% 73%', roman: 'VI' },
  r2c3: { id: 'r2c3', x: 50.5, y: 51.5, width: 22.5, height: 43.5, zoomOrigin: '61% 73%', roman: 'VII' },
  r2c4: { id: 'r2c4', x: 73.5, y: 51.5, width: 22.5, height: 43.5, zoomOrigin: '84% 73%', roman: 'VIII' },
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
  const [hoveredBook, setHoveredBook] = useState<PhysicalBook | null>(null);
  const [selectedBook, setSelectedBook] = useState<PhysicalBook | null>(null);
  const [hoveredCubbyHotspot, setHoveredCubbyHotspot] = useState<string | null>(null);
  const [spotlightPos, setSpotlightPos] = useState<{ x: number; y: number } | null>(null);
  const [copiedTitle, setCopiedTitle] = useState(false);
  const photoContainerRef = useRef<HTMLDivElement>(null);

  const cubbiesList: ShelfCubbyInfo[] = useMemo(() => [
    SHELF_CUBBIES.r1c1,
    SHELF_CUBBIES.r1c2,
    SHELF_CUBBIES.r1c3,
    SHELF_CUBBIES.r1c4,
    SHELF_CUBBIES.r2c1,
    SHELF_CUBBIES.r2c2,
    SHELF_CUBBIES.r2c3,
    SHELF_CUBBIES.r2c4,
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
      setHoveredBook(matched);
    }
  }, [searchQuery]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!photoContainerRef.current) return;
    const rect = photoContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotlightPos({ x, y });
  };

  const handleMouseLeave = () => {
    setSpotlightPos(null);
    setHoveredCubbyHotspot(null);
  };

  const currentCubby = zoomedCubby || (activeCubby !== 'all' ? activeCubby : hoveredCubbyHotspot);

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

  const activeBook = hoveredBook || selectedBook;

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

  const handleCopyTitle = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTitle(true);
    setTimeout(() => setCopiedTitle(false), 1800);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border ${className}`}
      style={{
        background: '#141210',
        borderColor: '#292524',
        boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.06)',
      }}
    >
      {/* Ambient Gallery Light Overhead Wash */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-36 bg-amber-500/12 blur-[90px] pointer-events-none" />

      {/* Top Gallery Header Bar */}
      <div className="relative z-10 flex flex-col gap-4 p-5 sm:p-7 md:flex-row md:items-center md:justify-between border-b border-stone-800/80">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)] animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-stone-100 font-serif">
              Physical Bookshelf Camera
            </h2>
            <span className="rounded-full bg-amber-950/80 border border-amber-700/60 px-2.5 py-0.5 text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest">
              Live Lens 2.4×
            </span>
          </div>
          <p className="mt-1.5 text-xs sm:text-sm text-stone-400 max-w-xl">
            Directly mapped to your 2×4 white bookcase • Click any cubby to zoom in up close • Hover book spines to pull out
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {zoomedCubby && (
            <button
              type="button"
              onClick={() => {
                setZoomedCubby(null);
                setActiveCubby('all');
              }}
              className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold text-stone-900 bg-amber-400 hover:bg-amber-300 transition-all shadow-md shadow-amber-400/25 active:translate-y-[1px]"
            >
              <span>🔍</span>
              <span>Overview</span>
            </button>
          )}

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find volume on shelf..."
              className="w-48 sm:w-60 rounded-full border border-stone-700/80 bg-stone-900/90 px-3.5 py-1.5 text-xs text-stone-100 placeholder:text-stone-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-200"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cubby Selector Bar (Brass Roman Numerals) */}
      <div className="relative z-10 flex items-center gap-1.5 overflow-x-auto px-5 py-2.5 bg-stone-950/90 border-b border-stone-800/60 text-xs">
        <button
          type="button"
          onClick={() => {
            setActiveCubby('all');
            setZoomedCubby(null);
          }}
          className={`rounded-full px-3 py-1 font-bold whitespace-nowrap transition-all ${
            activeCubby === 'all' && !zoomedCubby
              ? 'bg-amber-400 text-stone-950 shadow-sm'
              : 'bg-stone-900/80 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
          }`}
        >
          Entire Shelf (84)
        </button>
        {cubbiesList.map((c) => {
          const isSelected = activeCubby === c.id || zoomedCubby === c.id;
          const count = booksByCubby[c.id]?.length || 0;
          const roman = CUBBY_HOTSPOTS[c.id]?.roman || 'I';
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => handleCubbyClick(c.id)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-amber-400/20 text-amber-300 border-amber-500/80 shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                  : 'bg-stone-900/60 text-stone-400 border-stone-800 hover:border-stone-700 hover:text-stone-200'
              }`}
            >
              <span className="font-serif text-[11px] font-bold text-amber-400/90">{roman}</span>
              <span>{c.title.split(' ')[0]}</span>
              <span className="rounded-full bg-stone-800/90 px-1.5 py-0.2 text-[10px] text-stone-300">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Photographic Canvas */}
      <div className="relative p-4 sm:p-7">
        <div
          ref={photoContainerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-stone-800 bg-stone-950 cursor-crosshair select-none"
          style={{
            boxShadow: 'inset 0 0 50px rgba(0,0,0,0.85), 0 12px 35px rgba(0,0,0,0.6)',
          }}
        >
          {/* Zoomable Photographic Plane */}
          <div
            className="absolute inset-0 transition-transform duration-700 ease-out will-change-transform"
            style={{
              transformOrigin: zoomedCubby ? CUBBY_HOTSPOTS[zoomedCubby]?.zoomOrigin : '50% 50%',
              transform: zoomedCubby ? 'scale(2.38)' : 'scale(1)',
            }}
          >
            <Image
              src="/bookshelf_web.jpg"
              alt="Physical bookshelf"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1400px) 100vw, 1400px"
            />

            {/* Dynamic Ambient Spotlight */}
            {spotlightPos && !zoomedCubby && (
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-150"
                style={{
                  background: `radial-gradient(circle 240px at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(255,245,210,0.28) 0%, rgba(0,0,0,0) 70%)`,
                  mixBlendMode: 'screen',
                }}
              />
            )}

            {/* Interactive Hotspot Frames */}
            {Object.entries(CUBBY_HOTSPOTS).map(([key, spot]) => {
              const isHovered = hoveredCubbyHotspot === key;
              const isZoomed = zoomedCubby === key;
              const isFiltered = activeCubby === key;
              const books = booksByCubby[key] || [];

              return (
                <div
                  key={key}
                  onClick={() => handleCubbyClick(key)}
                  onMouseEnter={() => setHoveredCubbyHotspot(key)}
                  onMouseLeave={() => setHoveredCubbyHotspot(null)}
                  className={`absolute rounded-xl transition-all duration-300 ${
                    isZoomed
                      ? 'border-2 border-amber-400 bg-amber-400/5 shadow-[0_0_35px_rgba(251,191,36,0.35)]'
                      : isHovered || isFiltered
                      ? 'border-2 border-amber-400/95 bg-amber-500/15 backdrop-brightness-110 shadow-[0_0_25px_rgba(251,191,36,0.3)]'
                      : 'border border-white/20 bg-black/10 hover:border-amber-400/70 hover:bg-black/25'
                  }`}
                  style={{
                    left: `${spot.x}%`,
                    top: `${spot.y}%`,
                    width: `${spot.width}%`,
                    height: `${spot.height}%`,
                  }}
                >
                  {/* Brass Engraved Tag */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 pointer-events-none">
                    <span className="flex items-center gap-1.5 rounded-md bg-stone-950/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-stone-700/80 shadow-md">
                      <span className="font-serif font-black">{spot.roman}</span>
                      <span className="text-stone-400 font-normal font-mono">• {books.length}</span>
                    </span>
                  </div>

                  {/* Zoom prompt badge */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="rounded bg-black/85 px-2 py-0.5 text-[9px] font-bold text-stone-200 border border-stone-700 shadow-sm">
                      {isZoomed ? 'Zoom out' : 'Inspect 🔍'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Minimap HUD Radar */}
          <div className="absolute bottom-3 left-3 z-20 hidden sm:flex items-center gap-2.5 rounded-xl bg-stone-950/90 backdrop-blur-md p-2.5 border border-stone-800 shadow-2xl">
            <div className="grid grid-cols-4 grid-rows-2 gap-1 w-20 h-10">
              {Object.keys(CUBBY_HOTSPOTS).map((k) => (
                <div
                  key={k}
                  className={`rounded-xs transition-all ${
                    zoomedCubby === k || activeCubby === k
                      ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                      : 'bg-stone-800'
                  }`}
                />
              ))}
            </div>
            <div className="text-[10px] text-stone-300 font-medium pr-1">
              {zoomedCubby
                ? `Cubby ${CUBBY_HOTSPOTS[zoomedCubby]?.roman}`
                : 'Overview'}
            </div>
          </div>
        </div>
      </div>

      {/* Archival Specimen / Inspection Card */}
      {activeBook && (
        <div className="mx-4 mb-5 sm:mx-7 rounded-2xl border border-amber-500/50 bg-gradient-to-r from-stone-900 via-stone-900 to-stone-950 p-5 sm:p-6 shadow-2xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-sm"
                  style={{ background: activeBook.spineColor === '#F5F5F3' ? '#333' : activeBook.spineColor }}
                >
                  {activeBook.cubbyLabel}
                </span>
                <span className="rounded-full bg-amber-400/15 border border-amber-400/40 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                  {activeBook.genre}
                </span>
                <span className="text-xs text-stone-400 font-mono">
                  {activeBook.year > 0 ? activeBook.year : `${Math.abs(activeBook.year)} BC`} • {activeBook.pages} pages
                </span>
              </div>

              <h3 className="mt-2 text-lg sm:text-xl font-bold text-stone-100 font-serif leading-tight">
                {activeBook.title}
              </h3>
              <p className="mt-0.5 text-xs font-semibold text-stone-400">
                by <span className="text-amber-200 font-bold">{activeBook.author}</span>
              </p>
              <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed max-w-3xl">
                {activeBook.description}
              </p>
            </div>

            {/* Actions: Pin / Copy */}
            <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-start shrink-0">
              <div className="flex items-center text-amber-400 text-base">
                {'★'.repeat(activeBook.rating)}
                <span className="text-stone-400 text-xs ml-1.5 font-bold font-mono">
                  {activeBook.rating}/5
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCopyTitle(activeBook.title)}
                className="rounded-full px-3 py-1.5 text-xs font-medium text-stone-300 bg-stone-800 hover:bg-stone-700 border border-stone-700 transition-colors"
              >
                {copiedTitle ? '✓ Copied' : 'Copy'}
              </button>

              {selectedBook?.id === activeBook.id ? (
                <button
                  type="button"
                  onClick={() => setSelectedBook(null)}
                  className="rounded-full px-3.5 py-1.5 text-xs font-bold text-stone-300 bg-stone-800 hover:bg-stone-700 border border-stone-700"
                >
                  Unpin
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedBook(activeBook)}
                  className="rounded-full px-3.5 py-1.5 text-xs font-bold text-stone-900 bg-amber-400 hover:bg-amber-300 shadow-md shadow-amber-400/25"
                >
                  Pin Volume
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tactile Book Spines Drawer */}
      <div className="border-t border-stone-800 bg-stone-950/95 p-5 sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-stone-200 font-serif flex items-center gap-2">
              <span>📚</span>
              <span>
                {currentCubby && currentCubby !== 'all'
                  ? SHELF_CUBBIES[currentCubby]?.title
                  : 'Active Shelf Selection'}
              </span>
            </h4>
            <p className="text-xs text-stone-400 mt-0.5">
              {currentCubby && currentCubby !== 'all'
                ? SHELF_CUBBIES[currentCubby]?.description
                : 'Hover any book spine below to pull it out and reveal its archival record'}
            </p>
          </div>

          {/* Quick Drawer Genre Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <button
              type="button"
              onClick={() => setSelectedGenre('all')}
              className={`rounded-full px-2.5 py-1 font-semibold transition-colors ${
                selectedGenre === 'all'
                  ? 'bg-amber-400 text-stone-950'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200'
              }`}
            >
              All Genres ({activeBooks.length})
            </button>
            {availableGenres.slice(0, 5).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGenre(selectedGenre === g ? 'all' : g)}
                className={`rounded-full px-2.5 py-1 font-semibold transition-colors border ${
                  selectedGenre === g
                    ? 'bg-amber-400 text-stone-950 border-amber-400'
                    : 'bg-stone-900/60 text-stone-400 border-stone-800 hover:text-stone-200'
                }`}
              >
                {g.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Spines Grid with Authentic Foil Stamping and Shadows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[380px] overflow-y-auto pr-1">
          {activeBooks.map((book) => {
            const isHovered = hoveredBook?.id === book.id;
            const isSelected = selectedBook?.id === book.id;

            return (
              <div
                key={book.id}
                onMouseEnter={() => setHoveredBook(book)}
                onMouseLeave={() => setHoveredBook(null)}
                onClick={() => handleBookClick(book)}
                className={`group relative flex cursor-pointer items-center justify-between rounded-xl p-3 transition-all duration-200 border ${
                  isHovered || isSelected
                    ? '-translate-y-1.5 scale-[1.02] border-amber-400 bg-stone-850 shadow-xl shadow-amber-500/15'
                    : 'border-stone-800 bg-stone-900/80 hover:border-stone-700 hover:bg-stone-850'
                }`}
                style={{
                  borderLeftWidth: '5px',
                  borderLeftColor: book.spineColor === '#F5F5F3' ? '#D4D4D8' : book.spineColor,
                }}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="truncate">
                    <p className="truncate text-xs font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                      {book.title}
                    </p>
                    <p className="truncate text-[11px] text-stone-400">
                      {book.author}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-[10px] font-mono text-stone-400">
                    {book.year > 0 ? book.year : `${Math.abs(book.year)} BC`}
                  </span>
                  <span className="text-amber-400 text-xs">
                    {'★'.repeat(book.rating)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
