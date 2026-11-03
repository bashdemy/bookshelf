'use client';

import React from 'react';
import type { PhysicalBook } from '@/lib/shelf-data';

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/* ================================================================
   WHIMSICAL PASTEL COLLECTOR PALETTE
   ================================================================ */
export const PASTEL_PALETTE = [
  '#F472B6', // Rose Macaron
  '#FB7185', // Strawberry Cream
  '#C084FC', // Lavender Dream
  '#7DD3FC', // Robin's Egg Sky
  '#6EE7B7', // Pistachio Mint
  '#FDBA74', // Peach Blossom
  '#FDE047', // Buttercup Lemon
  '#D8B4FE', // Sweet Lilac
  '#FDA4AF', // Spun Sugar
  '#A78BFA', // Periwinkle
  '#E879F9', // Orchid Pink
  '#2DD4BF', // Mint Glaze
];

export const GOLD_GRADIENT =
  'linear-gradient(135deg, #FEF3C7 0%, #F59E0B 45%, #D97706 75%, #FDE68A 100%)';
export const GOLD_RULE =
  'linear-gradient(90deg, transparent, #F59E0B 20%, #FDE68A 50%, #F59E0B 80%, transparent)';

export function getBookSpineColor(book: { spineColor?: string; title: string; id?: string }): string {
  if (book.spineColor && !book.spineColor.startsWith('#2') && !book.spineColor.startsWith('#3')) {
    return book.spineColor;
  }
  const hash = hashString((book.id || '') + book.title);
  return PASTEL_PALETTE[hash % PASTEL_PALETTE.length];
}

interface BookSpineProps {
  book: PhysicalBook;
  selected?: boolean;
  onClick?: () => void;
}

export default function BookSpine({ book, selected = false, onClick }: BookSpineProps) {
  const seed = hashString(book.id);
  const base = getBookSpineColor(book);

  // Proportions: playful height & thickness
  const width = Math.round(Math.max(30, Math.min(56, 26 + book.pages / 22)));
  const height = 168 + (seed % 6) * 8;
  const author = book.author.split(' ').pop() ?? '';

  return (
    <button
      type="button"
      onClick={onClick}
      title={`${book.title} — ${book.author}`}
      aria-pressed={selected}
      className="book-spine group relative shrink-0 select-none focus:outline-none cursor-pointer"
      style={{
        width,
        height,
        transform: selected ? 'translateY(-14px) scale(1.03)' : undefined,
      }}
    >
      <span
        className="absolute inset-0 overflow-hidden rounded-[4px_4px_2px_2px]"
        style={{
          backgroundColor: base,
          backgroundImage: [
            // Spine rounded highlight & shadow
            'linear-gradient(90deg, rgba(0,0,0,0.25) 0%, rgba(255,255,255,0.4) 18%, rgba(255,255,255,0.1) 40%, rgba(0,0,0,0.05) 75%, rgba(0,0,0,0.3) 100%)',
            // Pearlescent gloss
            'radial-gradient(ellipse at 50% 15%, rgba(255,255,255,0.4), transparent 60%)',
            // Dainty cloth weave
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 3px)',
          ].join(','),
          boxShadow: selected
            ? '0 0 0 2px #F472B6, 0 16px 28px -6px rgba(236, 72, 153, 0.45)'
            : 'inset 0 -2px 0 rgba(0,0,0,0.15), 2px 0 4px rgba(236, 72, 153, 0.15)',
        }}
      >
        {/* Top & bottom dainty gold foil bands */}
        <span className="absolute left-1 right-1 top-2.5 h-[1.5px]" style={{ background: GOLD_RULE }} />
        <span className="absolute left-1 right-1 top-4 h-px opacity-75" style={{ background: GOLD_RULE }} />
        <span className="absolute left-1 right-1 bottom-4 h-px opacity-75" style={{ background: GOLD_RULE }} />
        <span className="absolute left-1 right-1 bottom-2.5 h-[1.5px]" style={{ background: GOLD_RULE }} />

        {/* Little whimsical star at head */}
        <span className="absolute left-0 right-0 top-5 text-center text-[8px] text-[#FEF3C7] opacity-90 select-none">
          ✦
        </span>

        {/* Title panel */}
        <span className="absolute left-[3px] right-[3px] top-[30px] bottom-[30px] flex items-center justify-center overflow-hidden">
          <span
            className="spine-title font-serif uppercase tracking-widest whitespace-nowrap [writing-mode:vertical-rl] rotate-180 overflow-hidden text-ellipsis max-h-full font-bold text-[10px]"
            style={{
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              color: '#FFFFFF',
            }}
          >
            {book.title}
          </span>
        </span>

        {/* Author tooled at foot */}
        <span
          className="absolute left-0 right-0 bottom-[14px] text-center font-serif italic truncate px-0.5 text-[8.5px] text-[#FFFFFF]/90"
        >
          {author.slice(0, 8)}
        </span>
      </span>
    </button>
  );
}

export function BookCover({
  book,
  size = 'md',
  className = '',
}: {
  book: { title: string; author?: string; spineColor?: string; id?: string };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const base = getBookSpineColor(book);

  const dims =
    size === 'sm'
      ? { width: 84, height: 120, titleSize: 9.5, authorSize: 8, pad: 'p-2', inset: 'inset-[6px]' }
      : size === 'lg'
      ? { width: 160, height: 230, titleSize: 14, authorSize: 11, pad: 'p-5', inset: 'inset-[12px]' }
      : { width: 128, height: 184, titleSize: 12, authorSize: 9.5, pad: 'p-4', inset: 'inset-[9px]' };

  return (
    <div
      className={`relative shrink-0 overflow-hidden select-none transition-all duration-300 group-hover:scale-[1.03] group-hover:-translate-y-1 ${className}`}
      style={{
        width: dims.width,
        height: dims.height,
        borderRadius: '3px 8px 8px 3px',
        backgroundColor: base,
        backgroundImage: [
          // Spine hinge crease
          'linear-gradient(90deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 4%, rgba(255,255,255,0.35) 7%, transparent 14%)',
          // Pearlescent diagonal gleam
          'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(0,0,0,0.15) 100%)',
          // Delicate cloth weave
          'repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 3px)',
        ].join(','),
        boxShadow:
          size === 'sm'
            ? '0 6px 16px -2px rgba(236, 72, 153, 0.25), 0 2px 6px rgba(0,0,0,0.06)'
            : '0 12px 28px -4px rgba(236, 72, 153, 0.3), 0 4px 12px rgba(0,0,0,0.08)',
      }}
    >
      {/* Delicate inner gold foil frame */}
      <div
        className={`absolute ${dims.inset} rounded-[2px] border pointer-events-none`}
        style={{
          borderColor: 'rgba(254, 243, 199, 0.75)',
          boxShadow: 'inset 0 0 0 1px rgba(245, 158, 11, 0.25)',
        }}
      />

      {/* Sweet satin bookmark ribbon peeking at bottom */}
      <div
        className="absolute bottom-0 right-4 w-3.5 h-4 bg-gradient-to-b from-[#F472B6] to-[#DB2777] rounded-b-xs shadow-xs"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%)' }}
      />

      <div className={`relative h-full flex flex-col items-center justify-between text-center ${dims.pad} z-10`}>
        {/* Whimsical sparkle icon */}
        <span className="text-[#FEF3C7] text-xs leading-none drop-shadow-xs">✦</span>

        {/* Title */}
        <span
          className="font-serif font-bold leading-tight line-clamp-4 px-1 text-white"
          style={{
            fontSize: dims.titleSize,
            textShadow: '0 1px 3px rgba(0,0,0,0.35)',
          }}
        >
          {book.title}
        </span>

        {/* Author */}
        <div className="flex flex-col items-center w-full">
          <span className="h-px w-6 mb-1 opacity-70" style={{ background: GOLD_RULE }} />
          {book.author && (
            <span
              className="font-serif italic truncate max-w-[90%] text-white/95 leading-tight"
              style={{
                fontSize: dims.authorSize,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              {book.author}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
