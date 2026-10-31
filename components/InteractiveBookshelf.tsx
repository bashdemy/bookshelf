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
        background: '#190E17',
        borderColor: '#4A1D34',
        boxShadow: '0 30px 70px -15px rgba(131, 24, 67, 0.45), 0 0 0 1px rgba(244, 114, 182, 0.15)',
      }}
    >
      {/* Ambient Cherry Blossom Light Overhead Wash */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-44 bg-pink-500/22 blur-[100px] pointer-events-none" />

      {/* Top Gallery Header Bar */}
      <div className="relative z-10 flex flex-col gap-4 p-5 sm:p-7 md:flex-row md:items-center md:justify-between border-b border-pink-950/60">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-pink-400 shadow-[0_0_12px_rgba(244,114,182,1)] animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-pink-50 font-serif">
              Physical Bookshelf Camera
            </h2>
            <span className="rounded-full bg-pink-950/90 border border-pink-700/70 px-2.5 py-0.5 text-[10px] font-mono font-bold text-pink-300 uppercase tracking-widest shadow-sm">
              Live Lens 2.9× 🌸
            </span>
          </div>
          <p className="mt-1.5 text-xs sm:text-sm text-pink-200/70 max-w-xl">
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
                ? 'bg-pink-600/30 text-pink-200 border-pink-400/80 shadow-[0_0_12px_rgba(244,114,182,0.3)]'
                : 'bg-stone-900/80 text-pink-300/70 border-stone-800 hover:text-pink-100'
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
              className="w-48 sm:w-60 rounded-full border border-pink-900/80 bg-stone-950/90 px-3.5 py-1.5 text-xs text-pink-100 placeholder:text-pink-400/50 focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-pink-400 hover:text-pink-200"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cubby Selector Bar (Brass Roman Numerals with Pink Glow) */}
      <div className="relative z-10 flex items-center gap-1.5 overflow-x-auto px-5 py-2.5 bg-stone-950/90 border-b border-pink-950/40 text-xs">
        <button
          type="button"
          onClick={() => {
            setActiveCubby('all');
            setZoomedCubby(null);
          }}
          className={`rounded-full px-3 py-1 font-bold whitespace-nowrap transition-all ${
            activeCubby === 'all' && !zoomedCubby
              ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30'
              : 'bg-stone-900/80 text-pink-200/60 hover:text-pink-100 hover:bg-stone-800'
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
                  ? 'bg-pink-500/25 text-pink-200 border-pink-400/90 shadow-[0_0_15px_rgba(244,114,182,0.3)]'
                  : 'bg-stone-900/60 text-pink-300/60 border-stone-850 hover:border-pink-800 hover:text-pink-200'
              }`}
            >
              <span className="font-serif text-[11px] font-bold text-pink-400">{roman}</span>
              <span>{c.title.split(' ')[0]}</span>
              <span className="rounded-full bg-pink-950/80 px-1.5 py-0.2 text-[10px] text-pink-300 border border-pink-900/50">
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
          className={`relative w-full overflow-hidden rounded-2xl border border-pink-900/50 bg-stone-950 cursor-crosshair select-none transition-all duration-500 ${
            isTallerPhoto
              ? 'h-[480px] sm:h-[620px] lg:h-[720px]'
              : 'aspect-[4/3] min-h-[360px] sm:min-h-[480px]'
          }`}
          style={{
            boxShadow: 'inset 0 0 50px rgba(0,0,0,0.85), 0 12px 35px rgba(0,0,0,0.6)',
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
                      ? 'border-2 border-pink-400 bg-pink-500/10 shadow-[0_0_40px_rgba(244,114,182,0.45)]'
                      : isHovered || isFiltered
                      ? 'border-2 border-pink-400 bg-pink-500/20 backdrop-brightness-110 shadow-[0_0_30px_rgba(244,114,182,0.4)]'
                      : 'border border-pink-200/30 bg-black/10 hover:border-pink-400/80 hover:bg-pink-950/20'
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
                    <span className="flex items-center gap-1.5 rounded-md bg-stone-950/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-pink-300 border border-pink-800/80 shadow-md">
                      <span className="font-serif font-black">{spot.roman}</span>
                      <span className="text-pink-400 font-normal font-mono">• {books.length}</span>
                    </span>
                  </div>

                  {/* Zoom prompt badge */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="rounded bg-black/85 px-2 py-0.5 text-[9px] font-bold text-pink-200 border border-pink-800 shadow-sm">
                      {isZoomed ? 'Zoom out' : 'Inspect 🔍'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Minimap HUD Radar */}
          <div className="absolute bottom-3 left-3 z-20 hidden sm:flex items-center gap-2.5 rounded-xl bg-stone-950/90 backdrop-blur-md p-2.5 border border-pink-900/60 shadow-2xl">
            <div className="grid grid-cols-4 grid-rows-2 gap-1 w-20 h-10">
              {Object.keys(CUBBY_HOTSPOTS).map((k) => (
                <div
                  key={k}
                  className={`rounded-xs transition-all ${
                    zoomedCubby === k || activeCubby === k
                      ? 'bg-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.9)]'
                      : 'bg-stone-800'
                  }`}
                />
              ))}
            </div>
            <div className="text-[10px] text-pink-300 font-medium pr-1">
              {zoomedCubby
                ? `Cubby ${CUBBY_HOTSPOTS[zoomedCubby]?.roman}`
                : 'Overview'}
            </div>
          </div>
        </div>
      </div>

      {/* Archival Specimen / Inspection Card */}
      {activeBook && (
        <div className="mx-4 mb-5 sm:mx-7 rounded-2xl border border-pink-500/50 bg-gradient-to-r from-stone-950 via-[#260C1D] to-stone-950 p-5 sm:p-6 shadow-2xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-sm"
                  style={{ background: activeBook.spineColor === '#F5F5F3' ? '#444' : activeBook.spineColor }}
                >
                  {activeBook.cubbyLabel}
                </span>
                <span className="rounded-full bg-pink-500/20 border border-pink-400/50 px-2 py-0.5 text-[10px] font-bold text-pink-300">
                  {activeBook.genre}
                </span>
                <span className="text-xs text-pink-300/70 font-mono">
                  {activeBook.year > 0 ? activeBook.year : `${Math.abs(activeBook.year)} BC`} • {activeBook.pages} pages
                </span>
              </div>

              <h3 className="mt-2 text-lg sm:text-xl font-bold text-pink-50 font-serif leading-tight">
                {activeBook.title}
              </h3>
              <p className="mt-0.5 text-xs font-semibold text-pink-300">
                by <span className="text-white font-bold">{activeBook.author}</span>
              </p>
              <p className="mt-2 text-xs sm:text-sm text-pink-100/80 leading-relaxed max-w-3xl">
                {activeBook.description}
              </p>
            </div>

            {/* Actions: Pin / Copy */}
            <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-start shrink-0">
              <div className="flex items-center text-pink-400 text-base">
                {'★'.repeat(activeBook.rating)}
                <span className="text-pink-300/70 text-xs ml-1.5 font-bold font-mono">
                  {activeBook.rating}/5
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCopyTitle(activeBook.title)}
                className="rounded-full px-3 py-1.5 text-xs font-medium text-pink-200 bg-stone-900 hover:bg-stone-800 border border-pink-800/80 transition-colors"
              >
                {copiedTitle ? '✓ Copied' : 'Copy'}
              </button>

              {selectedBook?.id === activeBook.id ? (
                <button
                  type="button"
                  onClick={() => setSelectedBook(null)}
                  className="rounded-full px-3.5 py-1.5 text-xs font-bold text-pink-300 bg-stone-900 hover:bg-stone-800 border border-pink-700"
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
      <div className="border-t border-pink-950/50 bg-stone-950/95 p-5 sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-pink-100 font-serif flex items-center gap-2">
              <span>🌸</span>
              <span>
                {currentCubby && currentCubby !== 'all'
                  ? SHELF_CUBBIES[currentCubby]?.title
                  : 'Active Shelf Selection'}
              </span>
            </h4>
            <p className="text-xs text-pink-300/60 mt-0.5">
              {currentCubby && currentCubby !== 'all'
                ? `${SHELF_CUBBIES[currentCubby]?.description} • Stacked horizontally as on the physical shelf`
                : 'Hover any book spine below to pull it out and reveal its archival record'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle: Stack vs Grid */}
            <div className="flex items-center gap-1 rounded-full bg-stone-900/90 p-0.5 border border-pink-900/60 text-xs">
              <button
                type="button"
                onClick={() => setDrawerMode('stack')}
                className={`rounded-full px-3 py-1 font-bold transition-all ${
                  drawerMode === 'stack'
                    ? 'bg-pink-600 text-white shadow-sm shadow-pink-600/30'
                    : 'text-pink-300/60 hover:text-pink-200'
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
                    : 'text-pink-300/60 hover:text-pink-200'
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
                className={`rounded-full px-2.5 py-1 font-semibold transition-colors ${
                  selectedGenre === 'all'
                    ? 'bg-pink-500 text-white shadow-sm shadow-pink-500/30'
                    : 'bg-stone-900 text-pink-300/70 hover:text-pink-100'
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
                      ? 'bg-pink-500 text-white border-pink-400 shadow-sm shadow-pink-500/30'
                      : 'bg-stone-900/60 text-pink-300/70 border-stone-850 hover:text-pink-100 hover:border-pink-800'
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
          <div className="rounded-2xl border border-pink-900/40 bg-black/40 p-3 sm:p-5">
            <div className="flex flex-col md:flex-row items-stretch gap-4">
              {/* Leaning Vertical Books (e.g. Algorithms, Art of Uncertainty) */}
              {activeBooks.some((b) => b.orientation === 'vertical') && (
                <div className="flex items-end gap-2.5 pb-1 border-b md:border-b-0 md:border-r border-pink-900/40 md:pr-4 shrink-0">
                  <span className="text-[10px] uppercase tracking-widest font-mono text-pink-400/60 [writing-mode:vertical-rl] rotate-180 mb-2 hidden md:block">
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
                              ? '-translate-y-2 border-pink-400 shadow-xl shadow-pink-500/30'
                              : 'border-stone-800 hover:border-pink-500/70'
                          }`}
                          style={{
                            backgroundColor: book.spineColor,
                            color: book.textColor,
                            boxShadow: isHovered || isSelected ? '0 10px 25px rgba(244,114,182,0.35)' : undefined,
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
                            ? 'translate-x-3 sm:translate-x-4 border-pink-400 shadow-xl shadow-pink-500/25 z-10'
                            : 'border-stone-800/80 hover:border-pink-800'
                        }`}
                        style={{
                          backgroundColor: book.spineColor === '#F5F5F3' ? '#222' : book.spineColor,
                          color: book.textColor === '#1A1A1A' && book.spineColor === '#F5F5F3' ? '#F4F4F5' : book.textColor,
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
                          <span className="hidden sm:inline-block rounded px-1.5 py-0.5 text-[9px] font-mono bg-black/40 border border-white/10">
                            {book.pages} pp
                          </span>
                          <span className="text-[10px] font-mono opacity-80">
                            {book.year > 0 ? book.year : `${Math.abs(book.year)} BC`}
                          </span>
                          <span className="text-pink-300 text-xs">
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
          /* 3D Spines Grid View with Pink Glow */
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
                      ? '-translate-y-1.5 scale-[1.02] border-pink-400 bg-pink-950/40 shadow-xl shadow-pink-500/20'
                      : 'border-stone-850 bg-stone-900/80 hover:border-pink-800 hover:bg-stone-850'
                  }`}
                  style={{
                    borderLeftWidth: '5px',
                    borderLeftColor: book.spineColor === '#F5F5F3' ? '#D4D4D8' : book.spineColor,
                  }}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="truncate">
                      <p className="truncate text-xs font-bold text-stone-100 group-hover:text-pink-300 transition-colors">
                        {book.title}
                      </p>
                      <p className="truncate text-[11px] text-pink-300/60">
                        {book.author}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-[10px] font-mono text-pink-300/60">
                      {book.year > 0 ? book.year : `${Math.abs(book.year)} BC`}
                    </span>
                    <span className="text-pink-400 text-xs">
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
