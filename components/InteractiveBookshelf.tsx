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
  r1c1: { id: 'r1c1', x: 3.6, y: 19.6, width: 22.8, height: 34.1, zoomOrigin: '15.0% 36.6%', roman: 'I' },
  r1c2: { id: 'r1c2', x: 26.9, y: 19.6, width: 22.8, height: 34.1, zoomOrigin: '38.3% 36.6%', roman: 'II' },
  r1c3: { id: 'r1c3', x: 50.3, y: 19.6, width: 22.8, height: 34.1, zoomOrigin: '61.7% 36.6%', roman: 'III' },
  r1c4: { id: 'r1c4', x: 73.6, y: 19.6, width: 22.8, height: 34.1, zoomOrigin: '85.0% 36.6%', roman: 'IV' },
  r2c1: { id: 'r2c1', x: 3.6, y: 55.2, width: 22.8, height: 33.7, zoomOrigin: '15.0% 72.0%', roman: 'V' },
  r2c2: { id: 'r2c2', x: 26.9, y: 55.2, width: 22.8, height: 33.7, zoomOrigin: '38.3% 72.0%', roman: 'VI' },
  r2c3: { id: 'r2c3', x: 50.3, y: 55.2, width: 22.8, height: 33.7, zoomOrigin: '61.7% 72.0%', roman: 'VII' },
  r2c4: { id: 'r2c4', x: 73.6, y: 55.2, width: 22.8, height: 33.7, zoomOrigin: '85.0% 72.0%', roman: 'VIII' },
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
  const [isTallerPhoto, setIsTallerPhoto] = useState<boolean>(true);
  const [drawerMode, setDrawerMode] = useState<'stack' | 'grid'>('stack');
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
        background: '#FFFFFF',
        borderColor: '#FBCFE8',
        boxShadow: '0 20px 50px -10px rgba(225, 29, 72, 0.12), 0 0 0 1px rgba(244, 114, 182, 0.25)',
      }}
    >
      {/* Ambient Cherry Blossom Light Overhead Wash */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-44 bg-pink-100/70 blur-[90px] pointer-events-none" />

      {/* Top Gallery Header Bar */}
      <div className="relative z-10 flex flex-col gap-4 p-5 sm:p-7 md:flex-row md:items-center md:justify-between border-b border-pink-200/80 bg-pink-50/50">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.9)] animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-pink-950 font-serif">
              Physical Bookshelf Camera
            </h2>
            <span className="rounded-full bg-pink-100 border border-pink-300 px-2.5 py-0.5 text-[10px] font-mono font-bold text-pink-700 uppercase tracking-widest shadow-xs">
              Live Lens 2.9× 🌸
            </span>
          </div>
          <p className="mt-1.5 text-xs sm:text-sm text-pink-900/70 max-w-xl">
            Directly mapped to your 4×2 bookcase • Click any horizontal cubby to zoom in up close • Hover book spines to pull out
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
              className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold text-white bg-pink-600 hover:bg-pink-500 transition-all shadow-md shadow-pink-600/30 active:translate-y-[1px]"
            >
              <span>🔍</span>
              <span>Overview</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsTallerPhoto((v) => !v)}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all border ${
              isTallerPhoto
                ? 'bg-pink-100 text-pink-800 border-pink-300 shadow-xs'
                : 'bg-white text-pink-900/80 border-pink-200 hover:bg-pink-50'
            }`}
            title="Toggle taller camera view for immersive shelf inspection"
          >
            <span>{isTallerPhoto ? '⇕ Taller Camera (On)' : '↕ Taller Camera'}</span>
          </button>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find volume on shelf..."
              className="w-48 sm:w-60 rounded-full border border-pink-200 bg-white px-3.5 py-1.5 text-xs text-pink-950 placeholder:text-pink-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-400 transition-colors shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-pink-500 hover:text-pink-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cubby Selector Bar */}
      <div className="relative z-10 flex items-center gap-1.5 overflow-x-auto px-5 py-2.5 bg-pink-50/70 border-b border-pink-200/80 text-xs">
        <button
          type="button"
          onClick={() => {
            setActiveCubby('all');
            setZoomedCubby(null);
          }}
          className={`rounded-full px-3 py-1 font-bold whitespace-nowrap transition-all border ${
            activeCubby === 'all' && !zoomedCubby
              ? 'bg-pink-600 text-white border-pink-600 shadow-sm shadow-pink-600/30'
              : 'bg-white text-pink-900 border-pink-200 hover:bg-pink-100'
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
                  ? 'bg-pink-600 text-white border-pink-600 shadow-sm shadow-pink-600/30'
                  : 'bg-white text-pink-900 border-pink-200 hover:bg-pink-100 hover:border-pink-300'
              }`}
            >
              <span className={`font-serif text-[11px] font-bold ${isSelected ? 'text-white' : 'text-pink-600'}`}>{roman}</span>
              <span>{c.title.split(' ')[0]}</span>
              <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${isSelected ? 'bg-pink-700 text-white' : 'bg-pink-100 text-pink-800'}`}>
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
          className={`relative w-full overflow-hidden rounded-2xl border border-pink-200 bg-pink-50/50 cursor-crosshair select-none transition-all duration-500 ${
            isTallerPhoto
              ? 'h-[480px] sm:h-[620px] lg:h-[720px]'
              : 'aspect-[4/3] min-h-[360px] sm:min-h-[480px]'
          }`}
          style={{
            boxShadow: 'inset 0 0 30px rgba(225, 29, 72, 0.08), 0 8px 25px rgba(225, 29, 72, 0.1)',
          }}
        >
          {/* Zoomable Photographic Plane */}
          <div
            className="absolute inset-0 transition-transform duration-700 ease-out will-change-transform"
            style={{
              transformOrigin: zoomedCubby ? CUBBY_HOTSPOTS[zoomedCubby]?.zoomOrigin : '50% 50%',
              transform: zoomedCubby ? 'scale(2.95)' : isTallerPhoto ? 'scale(1.15)' : 'scale(1)',
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

            {/* Dynamic Ambient Spotlight with Soft Rose Quartz Warmth */}
            {spotlightPos && !zoomedCubby && (
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-150"
                style={{
                  background: `radial-gradient(circle 240px at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(255,200,225,0.35) 0%, rgba(244,63,94,0.1) 40%, rgba(0,0,0,0) 70%)`,
                  mixBlendMode: 'screen',
                }}
              />
            )}

            {/* Interactive Hotspot Frames (Glowing Pink Neon/Rose) */}
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
                      ? 'border-2 border-pink-500 bg-pink-500/15 shadow-[0_0_35px_rgba(236,72,153,0.5)]'
                      : isHovered || isFiltered
                      ? 'border-2 border-pink-500 bg-pink-500/20 backdrop-brightness-105 shadow-[0_0_25px_rgba(236,72,153,0.4)]'
                      : 'border border-pink-300/70 bg-white/10 hover:border-pink-500 hover:bg-pink-500/15'
                  }`}
                  style={{
                    left: `${spot.x}%`,
                    top: `${spot.y}%`,
                    width: `${spot.width}%`,
                    height: `${spot.height}%`,
                  }}
                >
                  {/* Brass & Rose Engraved Tag */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 pointer-events-none">
                    <span className="flex items-center gap-1.5 rounded-md bg-white/95 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-pink-900 border border-pink-300 shadow-xs">
                      <span className="font-serif font-black">{spot.roman}</span>
                      <span className="text-pink-600 font-normal font-mono">• {books.length}</span>
                    </span>
                  </div>

                  {/* Zoom prompt badge */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="rounded bg-white/95 px-2 py-0.5 text-[9px] font-bold text-pink-900 border border-pink-300 shadow-sm">
                      {isZoomed ? 'Zoom out' : 'Inspect 🔍'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Minimap HUD Radar */}
          <div className="absolute bottom-3 left-3 z-20 hidden sm:flex items-center gap-2.5 rounded-xl bg-white/95 backdrop-blur-md p-2.5 border border-pink-200 shadow-lg">
            <div className="grid grid-cols-4 grid-rows-2 gap-1 w-20 h-10">
              {Object.keys(CUBBY_HOTSPOTS).map((k) => (
                <div
                  key={k}
                  className={`rounded-xs transition-all ${
                    zoomedCubby === k || activeCubby === k
                      ? 'bg-pink-600 shadow-[0_0_8px_rgba(236,72,153,0.8)]'
                      : 'bg-pink-100'
                  }`}
                />
              ))}
            </div>
            <div className="text-[10px] text-pink-950 font-semibold pr-1">
              {zoomedCubby
                ? `Cubby ${CUBBY_HOTSPOTS[zoomedCubby]?.roman}`
                : 'Overview'}
            </div>
          </div>
        </div>
      </div>

      {/* Archival Specimen / Inspection Card */}
      {activeBook && (
        <div className="mx-4 mb-5 sm:mx-7 rounded-2xl border border-pink-300 bg-gradient-to-br from-pink-50 via-white to-pink-100/60 p-5 sm:p-6 shadow-xl shadow-pink-500/10 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-xs"
                  style={{ background: activeBook.spineColor === '#F5F5F3' ? '#444' : activeBook.spineColor }}
                >
                  {activeBook.cubbyLabel}
                </span>
                <span className="rounded-full bg-pink-100 border border-pink-300 px-2 py-0.5 text-[10px] font-bold text-pink-800">
                  {activeBook.genre}
                </span>
                <span className="text-xs text-pink-900/70 font-mono">
                  {activeBook.year > 0 ? activeBook.year : `${Math.abs(activeBook.year)} BC`} • {activeBook.pages} pages
                </span>
              </div>

              <h3 className="mt-2 text-lg sm:text-xl font-bold text-pink-950 font-serif leading-tight">
                {activeBook.title}
              </h3>
              <p className="mt-0.5 text-xs font-semibold text-pink-800">
                by <span className="font-bold">{activeBook.author}</span>
              </p>
              <p className="mt-2 text-xs sm:text-sm text-pink-950/80 leading-relaxed max-w-3xl">
                {activeBook.description}
              </p>
            </div>

            {/* Actions: Pin / Copy */}
            <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-start shrink-0">
              <div className="flex items-center text-pink-600 text-base">
                {'★'.repeat(activeBook.rating)}
                <span className="text-pink-900/70 text-xs ml-1.5 font-bold font-mono">
                  {activeBook.rating}/5
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCopyTitle(activeBook.title)}
                className="rounded-full px-3 py-1.5 text-xs font-semibold text-pink-900 bg-white hover:bg-pink-100 border border-pink-300 transition-colors shadow-2xs"
              >
                {copiedTitle ? '✓ Copied' : 'Copy'}
              </button>

              {selectedBook?.id === activeBook.id ? (
                <button
                  type="button"
                  onClick={() => setSelectedBook(null)}
                  className="rounded-full px-3.5 py-1.5 text-xs font-bold text-pink-900 bg-pink-100 hover:bg-pink-200 border border-pink-300 shadow-2xs"
                >
                  Unpin
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedBook(activeBook)}
                  className="rounded-full px-3.5 py-1.5 text-xs font-bold text-white bg-pink-600 hover:bg-pink-500 shadow-md shadow-pink-600/30"
                >
                  Pin Volume
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tactile Book Spines Drawer */}
      <div className="border-t border-pink-200/80 bg-pink-50/40 p-5 sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-pink-950 font-serif flex items-center gap-2">
              <span>🌸</span>
              <span>
                {currentCubby && currentCubby !== 'all'
                  ? SHELF_CUBBIES[currentCubby]?.title
                  : 'Active Shelf Selection'}
              </span>
            </h4>
            <p className="text-xs text-pink-900/70 mt-0.5">
              {currentCubby && currentCubby !== 'all'
                ? `${SHELF_CUBBIES[currentCubby]?.description} • Stacked horizontally as on the physical shelf`
                : 'Hover any book spine below to pull it out and reveal its archival record'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle: Stack vs Grid */}
            <div className="flex items-center gap-1 rounded-full bg-white p-0.5 border border-pink-200 text-xs shadow-2xs">
              <button
                type="button"
                onClick={() => setDrawerMode('stack')}
                className={`rounded-full px-3 py-1 font-bold transition-all ${
                  drawerMode === 'stack'
                    ? 'bg-pink-600 text-white shadow-sm shadow-pink-600/30'
                    : 'text-pink-900/70 hover:text-pink-950'
                }`}
              >
                📚 Shelf Stack
              </button>
              <button
                type="button"
                onClick={() => setDrawerMode('grid')}
                className={`rounded-full px-3 py-1 font-bold transition-all ${
                  drawerMode === 'grid'
                    ? 'bg-pink-600 text-white shadow-sm shadow-pink-600/30'
                    : 'text-pink-900/70 hover:text-pink-950'
                }`}
              >
                ⊞ Grid
              </button>
            </div>

            {/* Quick Drawer Genre Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <button
                type="button"
                onClick={() => setSelectedGenre('all')}
                className={`rounded-full px-2.5 py-1 font-semibold transition-colors border ${
                  selectedGenre === 'all'
                    ? 'bg-pink-600 text-white border-pink-600 shadow-sm shadow-pink-600/30'
                    : 'bg-white text-pink-900 border-pink-200 hover:bg-pink-100'
                }`}
              >
                All ({activeBooks.length})
              </button>
              {availableGenres.slice(0, 4).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setSelectedGenre(selectedGenre === g ? 'all' : g)}
                  className={`rounded-full px-2.5 py-1 font-semibold transition-colors border ${
                    selectedGenre === g
                      ? 'bg-pink-600 text-white border-pink-600 shadow-sm shadow-pink-600/30'
                      : 'bg-white text-pink-900 border-pink-200 hover:bg-pink-100'
                  }`}
                >
                  {g.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Physical Stack View (Horizontal spines stacked like the photo) */}
        {drawerMode === 'stack' ? (
          <div className="rounded-2xl border border-pink-200 bg-white p-3 sm:p-5 shadow-xs">
            <div className="flex flex-col md:flex-row items-stretch gap-4">
              {/* Leaning Vertical Books (e.g. Algorithms, Art of Uncertainty) */}
              {activeBooks.some((b) => b.orientation === 'vertical') && (
                <div className="flex items-end gap-2.5 pb-1 border-b md:border-b-0 md:border-r border-pink-200 md:pr-4 shrink-0">
                  <span className="text-[10px] uppercase tracking-widest font-mono text-pink-600 [writing-mode:vertical-rl] rotate-180 mb-2 hidden md:block">
                    Leaning
                  </span>
                  {activeBooks
                    .filter((b) => b.orientation === 'vertical')
                    .map((book) => {
                      const isHovered = hoveredBook?.id === book.id;
                      const isSelected = selectedBook?.id === book.id;
                      return (
                        <div
                          key={book.id}
                          onMouseEnter={() => setHoveredBook(book)}
                          onMouseLeave={() => setHoveredBook(null)}
                          onClick={() => handleBookClick(book)}
                          className={`group relative flex flex-col justify-between cursor-pointer rounded-lg px-2 py-3 transition-all duration-200 border w-12 sm:w-14 h-48 sm:h-56 select-none ${
                            isHovered || isSelected
                              ? '-translate-y-2 border-pink-500 shadow-lg shadow-pink-500/25'
                              : 'border-pink-200/80 hover:border-pink-400'
                          }`}
                          style={{
                            backgroundColor: book.spineColor,
                            color: book.textColor,
                            boxShadow: isHovered || isSelected ? '0 10px 25px rgba(236,72,153,0.3)' : undefined,
                          }}
                        >
                          <div className="text-[9px] font-mono opacity-80">{book.year}</div>
                          <div className="flex-1 flex items-center justify-center overflow-hidden my-1">
                            <span className="text-xs font-bold font-serif whitespace-nowrap [writing-mode:vertical-rl] rotate-180 truncate">
                              {book.title}
                            </span>
                          </div>
                          <div className="text-[9px] font-bold truncate opacity-80">{book.author.split(' ').pop()}</div>
                        </div>
                      );
                    })}
                </div>
              )}

              {/* Horizontal Books Stack (Piled from top to bottom) */}
              <div className="flex-1 flex flex-col gap-2 max-h-[460px] overflow-y-auto pr-1">
                {activeBooks
                  .filter((b) => b.orientation !== 'vertical' || !activeBooks.some((x) => x.orientation === 'vertical'))
                  .map((book, idx) => {
                    const isHovered = hoveredBook?.id === book.id;
                    const isSelected = selectedBook?.id === book.id;

                    return (
                      <div
                        key={book.id}
                        onMouseEnter={() => setHoveredBook(book)}
                        onMouseLeave={() => setHoveredBook(null)}
                        onClick={() => handleBookClick(book)}
                        className={`group relative flex cursor-pointer items-center justify-between rounded-xl px-4 py-2.5 sm:py-3 transition-all duration-200 border ${
                          isHovered || isSelected
                            ? 'translate-x-3 sm:translate-x-4 border-pink-500 shadow-md shadow-pink-500/20 z-10'
                            : 'border-pink-200/70 hover:border-pink-400'
                        }`}
                        style={{
                          backgroundColor: book.spineColor === '#F5F5F3' ? '#FBF9F4' : book.spineColor,
                          color: book.textColor === '#1A1A1A' && book.spineColor === '#F5F5F3' ? '#2A141E' : book.textColor,
                          borderLeftWidth: '8px',
                          borderLeftColor: book.accentColor || '#EC4899',
                        }}
                      >
                        <div className="flex items-center gap-3 truncate">
                          <span className="font-mono text-[10px] opacity-60 w-4 text-center">
                            #{idx + 1}
                          </span>
                          <div className="truncate">
                            <p className="truncate text-xs sm:text-sm font-bold font-serif group-hover:underline">
                              {book.title}
                            </p>
                            <p className="truncate text-[11px] opacity-80">
                              {book.author}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0 ml-2">
                          <span className="hidden sm:inline-block rounded px-1.5 py-0.5 text-[9px] font-mono bg-black/10 border border-black/10">
                            {book.pages} pp
                          </span>
                          <span className="text-[10px] font-mono opacity-80">
                            {book.year > 0 ? book.year : `${Math.abs(book.year)} BC`}
                          </span>
                          <span className="text-pink-600 text-xs">
                            {'★'.repeat(book.rating)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        ) : (
          /* Spines Grid View with Light Theme */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[420px] overflow-y-auto pr-1">
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
                      ? '-translate-y-1 scale-[1.01] border-pink-500 bg-pink-50/80 shadow-md shadow-pink-500/15'
                      : 'border-pink-200/80 bg-white hover:border-pink-400 hover:bg-pink-50/40'
                  }`}
                  style={{
                    borderLeftWidth: '5px',
                    borderLeftColor: book.spineColor === '#F5F5F3' ? '#D4D4D8' : book.spineColor,
                  }}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="truncate">
                      <p className="truncate text-xs font-bold text-pink-950 font-serif group-hover:text-pink-700 transition-colors">
                        {book.title}
                      </p>
                      <p className="truncate text-[11px] text-pink-900/70">
                        {book.author}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-[10px] font-mono text-pink-900/60">
                      {book.year > 0 ? book.year : `${Math.abs(book.year)} BC`}
                    </span>
                    <span className="text-pink-600 text-xs">
                      {'★'.repeat(book.rating)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
