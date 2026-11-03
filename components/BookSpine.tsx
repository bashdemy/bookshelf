'use client';

import React from 'react';
import type { PhysicalBook } from '@/lib/shelf-data';

/* ---------- colour helpers: turn modern flat colours into aged clothbound tones ---------- */

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  return '#' + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
}

function mix(a: string, b: string, t: number): string {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t]);
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/** Ages a colour: pulls it toward warm leather/parchment so it reads as an antique binding. */
export function vintageTone(hex: string): string {
  const lum = luminance(hex);
  if (lum > 0.82) return mix(hex, '#E8D5B5', 0.75); // white covers → parchment / vellum
  if (lum < 0.14) return mix(hex, '#3A1F1C', 0.55); // black covers → aged oxblood-black leather
  return mix(hex, '#6E3B2E', 0.32); // everything else → warmed, dusted cloth
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export const GOLD_GRADIENT =
  'linear-gradient(180deg, #F6E7B4 0%, #D9B266 28%, #A9792F 52%, #E9CD86 74%, #9C6D2A 100%)';
const GOLD_RULE = 'linear-gradient(90deg, #7A5523, #E9CD86 30%, #B88A3E 55%, #F3DFA2 75%, #7A5523)';

interface BookSpineProps {
  book: PhysicalBook;
  selected?: boolean;
  onClick?: () => void;
}

export default function BookSpine({ book, selected = false, onClick }: BookSpineProps) {
  const seed = hashString(book.id);
  const base = vintageTone(book.spineColor);
  const isLight = luminance(base) > 0.62;

  // Physical proportions: thickness from page count, height varies like a real shelf
  const width = Math.round(Math.max(30, Math.min(58, 24 + book.pages / 22)));
  const height = 168 + (seed % 6) * 9;
  const style = seed % 3; // 0: gilt bands, 1: leather title label, 2: raised ribs

  const inkTitle = isLight ? '#5A1E24' : undefined;
  const labelColor = isLight ? mix(base, '#5A1E24', 0.82) : mix(base, '#1A0B0A', 0.45);
  const author = book.author.split(' ').pop() ?? '';

  return (
    <button
      type="button"
      onClick={onClick}
      title={`${book.title} — ${book.author}`}
      aria-pressed={selected}
      className="book-spine group relative shrink-0 select-none focus:outline-none"
      style={{
        width,
        height,
        transform: selected ? 'translateY(-16px)' : undefined,
      }}
    >
      <span
        className="absolute inset-0 overflow-hidden rounded-[3px_3px_2px_2px]"
        style={{
          backgroundColor: base,
          backgroundImage: [
            // rounded spine curvature
            'linear-gradient(90deg, rgba(0,0,0,0.42) 0%, rgba(255,255,255,0.14) 16%, rgba(255,255,255,0.05) 38%, rgba(0,0,0,0.06) 70%, rgba(0,0,0,0.45) 100%)',
            // book-cloth weave
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 3px)',
            'repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0 1px, transparent 1px 2px)',
            // sun-fading toward the top
            'linear-gradient(180deg, rgba(255,240,220,0.14), transparent 40%, rgba(0,0,0,0.12))',
          ].join(','),
          boxShadow: selected
            ? '0 0 0 2px #E9CD86, 0 18px 28px -8px rgba(90, 30, 40, 0.55)'
            : 'inset 0 -2px 0 rgba(0,0,0,0.25), 2px 0 3px rgba(60, 20, 20, 0.25)',
        }}
      >
        {/* Top & bottom gilt bands */}
        <span className="absolute left-1 right-1 top-2 h-[2px]" style={{ background: GOLD_RULE }} />
        <span className="absolute left-1 right-1 top-[13px] h-px opacity-80" style={{ background: GOLD_RULE }} />
        <span className="absolute left-1 right-1 bottom-[13px] h-px opacity-80" style={{ background: GOLD_RULE }} />
        <span className="absolute left-1 right-1 bottom-2 h-[2px]" style={{ background: GOLD_RULE }} />

        {style === 2 && (
          <>
            <span className="absolute left-0 right-0 top-[24%] h-[5px] bg-black/20 shadow-[0_1px_0_rgba(255,255,255,0.18)]" />
            <span className="absolute left-0 right-0 bottom-[24%] h-[5px] bg-black/20 shadow-[0_1px_0_rgba(255,255,255,0.18)]" />
          </>
        )}

        {/* Title panel */}
        <span
          className="absolute left-[3px] right-[3px] top-[22px] bottom-[34px] flex items-center justify-center overflow-hidden"
          style={
            style === 1
              ? {
                  background: labelColor,
                  boxShadow: 'inset 0 0 0 1px rgba(233,205,134,0.75), inset 0 0 0 3px rgba(0,0,0,0.25)',
                  borderRadius: 1,
                }
              : undefined
          }
        >
          <span
            className="spine-title font-serif uppercase whitespace-nowrap [writing-mode:vertical-rl] rotate-180 overflow-hidden text-ellipsis max-h-full"
            style={{
              fontSize: width > 40 ? 11 : 10,
              letterSpacing: '0.12em',
              fontWeight: 600,
              ...(inkTitle && style !== 1
                ? { color: inkTitle }
                : {
                    backgroundImage: GOLD_GRADIENT,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }),
            }}
          >
            {book.title}
          </span>
        </span>

        {/* Author tooled at the foot */}
        <span
          className="absolute left-0 right-0 bottom-[17px] text-center font-serif italic truncate px-0.5"
          style={{
            fontSize: 8,
            color: isLight ? '#7A4A2A' : '#E3C47E',
            opacity: 0.9,
          }}
        >
          {author.slice(0, 7)}
        </span>
      </span>
    </button>
  );
}

/** Front cover of an antique clothbound edition — used across bookplates, cards, and inspections. */
const VINTAGE_PALETTE = [
  '#8B263E', // deep antique rose / wine
  '#C85A32', // vintage orange cloth
  '#2C4A52', // deep prussian teal
  '#4A3B32', // worn leather brown
  '#8C7A3E', // antique ochre / olive
  '#3D314A', // aged plum
  '#A8435A', // dusty raspberry
  '#5C3A21', // tobacco leather
  '#3E503C', // aged moss green
  '#6D2A3C', // oxblood
];

export function getBookSpineColor(book: { spineColor?: string; title: string; id?: string }): string {
  if (book.spineColor) return book.spineColor;
  const hash = hashString((book.id || '') + book.title);
  return VINTAGE_PALETTE[hash % VINTAGE_PALETTE.length];
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
  const spine = getBookSpineColor(book);
  const base = vintageTone(spine);
  const isLight = luminance(base) > 0.62;
  const ink = isLight ? '#5A1E24' : undefined;

  const dims =
    size === 'sm'
      ? { width: 84, height: 120, titleSize: 9, authorSize: 7.5, pad: 'px-2 py-2', inset: 'inset-[6px] left-[10px]' }
      : size === 'lg'
      ? { width: 160, height: 230, titleSize: 14, authorSize: 11, pad: 'px-6 py-4', inset: 'inset-[12px] left-[18px]' }
      : { width: 128, height: 184, titleSize: 12, authorSize: 9, pad: 'px-5 py-3', inset: 'inset-[9px] left-[14px]' };

  return (
    <div
      className={`relative shrink-0 overflow-hidden select-none transition-transform duration-200 group-hover:scale-[1.02] ${className}`}
      style={{
        width: dims.width,
        height: dims.height,
        borderRadius: '2px 5px 5px 2px',
        backgroundColor: base,
        backgroundImage: [
          'linear-gradient(90deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.12) 5%, rgba(255,255,255,0.08) 8%, transparent 15%)',
          'radial-gradient(ellipse at 70% 20%, rgba(255,240,220,0.18), transparent 60%)',
          'repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 3px)',
          'repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0 1px, transparent 1px 2px)',
          'linear-gradient(180deg, transparent 70%, rgba(0,0,0,0.22))',
        ].join(','),
        boxShadow:
          size === 'sm'
            ? '3px 5px 12px -3px rgba(60, 20, 25, 0.45), inset -1px 0 0 rgba(255,255,255,0.15)'
            : '6px 8px 18px -6px rgba(60, 20, 25, 0.55), inset -1px 0 0 rgba(255,255,255,0.12)',
      }}
    >
      {/* double gilt frame */}
      <div className={`absolute ${dims.inset} border`} style={{ borderColor: 'rgba(233,205,134,0.85)' }} />
      <div
        className="absolute inset-0 left-[6px] flex flex-col items-center justify-between text-center"
        style={{ padding: dims.pad.replace('px-', '').replace('py-', '') }}
      >
        <span className="text-[10px]" style={{ color: ink ?? '#D9B266' }}>❦</span>
        <span
          className="font-serif font-semibold leading-tight line-clamp-4 px-1"
          style={{
            fontSize: dims.titleSize,
            ...(ink
              ? { color: ink }
              : {
                  backgroundImage: GOLD_GRADIENT,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }),
          }}
        >
          {book.title}
        </span>
        <div className="flex flex-col items-center">
          <span className="h-px w-6" style={{ background: GOLD_RULE }} />
          {book.author && (
            <span
              className="mt-1 font-serif italic truncate max-w-[90%] leading-tight"
              style={{
                fontSize: dims.authorSize,
                color: ink ?? '#E3C47E',
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
