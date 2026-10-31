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

// 8 cubbies mapped to percentages of the actual 1800x1350 bookshelf photograph
interface CubbyHotspot {
  id: 'r1c1' | 'r1c2' | 'r1c3' | 'r1c4' | 'r2c1' | 'r2c2' | 'r2c3' | 'r2c4';
  x: number; // percentage left
  y: number; // percentage top
  width: number; // percentage width
  height: number; // percentage height
  zoomOrigin: string; // transform-origin for smooth camera zoom
}

const CUBBY_HOTSPOTS: Record<string, CubbyHotspot> = {
  r1c1: { id: 'r1c1', x: 4.5, y: 7.5, width: 22.5, height: 43.5, zoomOrigin: '15% 30%' },
  r1c2: { id: 'r1c2', x: 27.5, y: 7.5, width: 22.5, height: 43.5, zoomOrigin: '38% 30%' },
  r1c3: { id: 'r1c3', x: 50.5, y: 7.5, width: 22.5, height: 43.5, zoomOrigin: '61% 30%' },
  r1c4: { id: 'r1c4', x: 73.5, y: 7.5, width: 22.5, height: 43.5, zoomOrigin: '84% 30%' },
  r2c1: { id: 'r2c1', x: 4.5, y: 51.5, width: 22.5, height: 43.5, zoomOrigin: '15% 73%' },
  r2c2: { id: 'r2c2', x: 27.5, y: 51.5, width: 22.5, height: 43.5, zoomOrigin: '38% 73%' },
  r2c3: { id: 'r2c3', x: 50.5, y: 51.5, width: 22.5, height: 43.5, zoomOrigin: '61% 73%' },
  r2c4: { id: 'r2c4', x: 73.5, y: 51.5, width: 22.5, height: 43.5, zoomOrigin: '84% 73%' },
};

export default function InteractiveBookshelf({
  onSelectBook,
  className = '',
  initialCubby = 'all',
}: InteractiveBookshelfProps) {
  const [activeCubby, setActiveCubby] = useState<string>(initialCubby);
  const [zoomedCubby, setZoomedCubby] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredBook, setHoveredBook] = useState<PhysicalBook | null>(null);
  const [selectedBook, setSelectedBook] = useState<PhysicalBook | null>(null);
  const [hoveredCubbyHotspot, setHoveredCubbyHotspot] = useState<string | null>(null);
  const [spotlightPos, setSpotlightPos] = useState<{ x: number; y: number } | null>(null);
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

  // If search query matches a book, auto-highlight its cubby
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

  // Handle mouse move on photo for spotlight effect
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
    if (currentCubby && currentCubby !== 'all') {
      return booksByCubby[currentCubby] || [];
    }
    return PHYSICAL_SHELF_BOOKS;
  }, [currentCubby, booksByCubby]);

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

  return (
    <div className={`relative overflow-hidden rounded-3xl border ${className}`} style={{
      background: '#121110',
      borderColor: '#292524',
      boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
    }}>
      {/* Top Ambient Gallery Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-amber-500/10 blur-[80px] pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col gap-4 p-5 sm:p-7 md:flex-row md:items-center md:justify-between border-b border-stone-800">
        <div>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-3 w-3 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)] animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-stone-100 font-serif">
              The Physical Library
            </h2>
            <span className="rounded-full bg-amber-950/80 border border-amber-800/60 px-2.5 py-0.5 text-[11px] font-bold text-amber-300">
              Interactive Shelf Camera
            </span>
          </div>
          <p className="mt-1.5 text-xs sm:text-sm text-stone-400 max-w-xl">
            Real photograph of bashdemy&apos;s bookcase • Click any cubby to zoom in • Hover book spines to pull out and inspect
          </p>
        </div>

        {/* Controls: Search & Zoom Reset */}
        <div className="flex flex-wrap items-center gap-2.5">
          {zoomedCubby && (
            <button
              type="button"
              onClick={() => {
                setZoomedCubby(null);
                setActiveCubby('all');
              }}
              className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold text-stone-900 bg-amber-400 hover:bg-amber-300 transition-all shadow-md shadow-amber-400/20 active:translate-y-[1px]"
            >
              <span>🔍</span>
              <span>Reset Full View</span>
            </button>
          )}

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find book on shelf..."
              className="w-48 sm:w-60 rounded-full border border-stone-700 bg-stone-900/90 px-3.5 py-1.5 text-xs text-stone-100 placeholder:text-stone-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
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

      {/* Cubby Navigation Track */}
      <div className="relative z-10 flex items-center gap-1.5 overflow-x-auto px-5 py-2.5 bg-stone-950/80 border-b border-stone-800 text-xs">
        <button
          type="button"
          onClick={() => {
            setActiveCubby('all');
            setZoomedCubby(null);
          }}
          className={`rounded-full px-3 py-1 font-bold whitespace-nowrap transition-all ${
            activeCubby === 'all' && !zoomedCubby
              ? 'bg-amber-400 text-stone-950 shadow-sm'
              : 'bg-stone-900 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
          }`}
        >
          Entire Shelf (84 books)
        </button>
        {cubbiesList.map((c, idx) => {
          const isSelected = activeCubby === c.id || zoomedCubby === c.id;
          const count = booksByCubby[c.id]?.length || 0;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => handleCubbyClick(c.id)}
              className={`flex items-center gap-1 rounded-full px-3 py-1 font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-amber-400/20 text-amber-300 border-amber-500/80 shadow-[0_0_15px_rgba(251,191,36,0.15)]'
                  : 'bg-stone-900/60 text-stone-400 border-stone-800 hover:border-stone-700 hover:text-stone-300'
              }`}
            >
              <span className="font-mono text-[10px] text-amber-400/80 font-bold">C{idx + 1}</span>
              <span>{c.title.split(' ')[0]}</span>
              <span className="rounded-full bg-stone-800/80 px-1.5 py-0.2 text-[10px] text-stone-300">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Stage: Interactive Photograph with Zoom & Hotspots */}
      <div className="relative p-4 sm:p-7">
        <div
          ref={photoContainerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-stone-800 bg-stone-950 cursor-crosshair select-none"
          style={{
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8), 0 10px 30px rgba(0,0,0,0.6)',
          }}
        >
          {/* Zoomable Shelf Photo */}
          <div
            className="absolute inset-0 transition-transform duration-700 ease-out will-change-transform"
            style={{
              transformOrigin: zoomedCubby ? CUBBY_HOTSPOTS[zoomedCubby]?.zoomOrigin : '50% 50%',
              transform: zoomedCubby ? 'scale(2.35)' : 'scale(1)',
            }}
          >
            <Image
              src="/bookshelf_web.jpg"
              alt="Actual physical bookcase"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1400px) 100vw, 1400px"
            />

            {/* Dynamic Spotlight Effect on Mouse Hover */}
            {spotlightPos && !zoomedCubby && (
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-150"
                style={{
                  background: `radial-gradient(circle 220px at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(255,245,210,0.25) 0%, rgba(0,0,0,0) 70%)`,
                  mixBlendMode: 'screen',
                }}
              />
            )}

            {/* Interactive Hotspot Frames (Mapped to exact cubbies) */}
            {Object.entries(CUBBY_HOTSPOTS).map(([key, spot], idx) => {
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
                      ? 'border-2 border-amber-400 bg-amber-400/5 shadow-[0_0_30px_rgba(251,191,36,0.3)]'
                      : isHovered || isFiltered
                      ? 'border-2 border-amber-400/90 bg-amber-500/15 backdrop-brightness-110 shadow-[0_0_20px_rgba(251,191,36,0.25)]'
                      : 'border border-white/20 bg-black/10 hover:border-amber-400/60 hover:bg-black/25'
                  }`}
                  style={{
                    left: `${spot.x}%`,
                    top: `${spot.y}%`,
                    width: `${spot.width}%`,
                    height: `${spot.height}%`,
                  }}
                >
                  {/* Floating Pill on Cubby */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 pointer-events-none transition-transform duration-200">
                    <span className="flex items-center gap-1 rounded-md bg-stone-950/85 backdrop-blur-md px-2 py-0.5 text-[10px] font-extrabold text-amber-300 border border-stone-700/80 shadow-md">
                      <span>C{idx + 1}</span>
                      <span className="text-stone-400 font-normal">• {books.length}</span>
                    </span>
                  </div>

                  {/* Zoom Hint Badge */}
                  <div className="absolute bottom-2 right-2 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="rounded bg-black/80 px-2 py-0.5 text-[9px] font-bold text-stone-200 border border-stone-700">
                      {isZoomed ? 'Click to zoom out' : 'Click to zoom in 🔍'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Minimap Radar Indicator in the Bottom Left */}
          <div className="absolute bottom-3 left-3 z-20 hidden sm:flex items-center gap-2 rounded-xl bg-stone-950/85 backdrop-blur-md p-2 border border-stone-800 shadow-xl">
            <div className="grid grid-cols-4 grid-rows-2 gap-1 w-20 h-10">
              {Object.keys(CUBBY_HOTSPOTS).map((k) => (
                <div
                  key={k}
                  className={`rounded-xs transition-colors ${
                    (zoomedCubby === k || activeCubby === k)
                      ? 'bg-amber-400'
                      : 'bg-stone-800'
                  }`}
                />
              ))}
            </div>
            <div className="text-[10px] text-stone-300 font-medium pr-1">
              {zoomedCubby ? `Zoomed in on C${cubbiesList.findIndex(c => c.id === zoomedCubby) + 1}` : 'Full View'}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Active Book Spotlight Card */}
      {activeBook && (
        <div className="mx-4 mb-4 sm:mx-7 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-stone-900 via-stone-900 to-stone-950 p-4 sm:p-5 shadow-2xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2.5">
                <span
                  className="rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-sm"
                  style={{ background: activeBook.spineColor === '#F5F5F3' ? '#333' : activeBook.spineColor }}
                >
                  {activeBook.cubbyLabel}
                </span>
                <span className="text-xs font-semibold text-amber-400">
                  {activeBook.genre}
                </span>
                <span className="text-xs text-stone-400">
                  • {activeBook.year} • {activeBook.pages} pages
                </span>
              </div>
              <h3 className="mt-1 text-base sm:text-lg font-bold text-stone-100 font-serif">
                {activeBook.title}
              </h3>
              <p className="text-xs font-semibold text-stone-400">
                by <span className="text-stone-200 font-bold">{activeBook.author}</span>
              </p>
              <p className="mt-1 text-xs text-stone-300 leading-relaxed line-clamp-2">
                {activeBook.description}
              </p>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
              <div className="flex items-center text-amber-400 text-sm">
                {'★'.repeat(activeBook.rating)}
                <span className="text-stone-400 text-xs ml-1.5 font-bold">
                  {activeBook.rating}/5
                </span>
              </div>
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
                  className="rounded-full px-3.5 py-1.5 text-xs font-bold text-stone-900 bg-amber-400 hover:bg-amber-300 shadow-md shadow-amber-400/20"
                >
                  Pin Book
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tactile Book Spine Drawer (Interactive Shelf Deck) */}
      <div className="border-t border-stone-800 bg-stone-950/90 p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h4 className="text-sm font-bold text-stone-200 font-serif flex items-center gap-2">
              <span>📖</span>
              <span>
                {currentCubby && currentCubby !== 'all'
                  ? SHELF_CUBBIES[currentCubby]?.title
                  : 'All Shelf Volumes'}
              </span>
            </h4>
            <p className="text-xs text-stone-400">
              {currentCubby && currentCubby !== 'all'
                ? SHELF_CUBBIES[currentCubby]?.description
                : 'Hover any spine below to pull it out of the shelf in 3D'}
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400 font-bold">
            {activeBooks.length} volumes in focus
          </span>
        </div>

        {/* 3D Interactive Spines Grid */}
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
                    ? '-translate-y-1.5 scale-[1.02] border-amber-400 bg-stone-800 shadow-xl shadow-amber-500/10'
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
