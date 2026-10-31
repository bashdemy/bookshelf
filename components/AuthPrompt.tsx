'use client';

import Link from 'next/link';

export default function AuthPrompt() {
  return (
    <aside
      aria-label="Public viewer mode notice"
      className="fixed bottom-5 left-5 z-40 hidden sm:block"
    >
      <div 
        className="flex items-center gap-3 rounded-full py-2 pl-4 pr-2 bg-white"
        style={{ 
          border: '1px solid #FBCFE8',
          boxShadow: '0 6px 20px rgba(190, 24, 93, 0.12), 0 1px 3px rgba(190, 24, 93, 0.05)',
        }}
      >
        <span className="text-xs font-medium text-pink-900/80">
          🌸 Browsing <span className="font-bold text-pink-950">bashdemy</span>&apos;s library
        </span>
        <Link
          href="/login"
          className="rounded-full px-3.5 py-1 text-xs font-bold text-white transition-all shadow-md shadow-pink-600/30 active:translate-y-[1px]"
          style={{ 
            background: 'var(--color-primary)',
          }}
        >
          Sign In
        </Link>
      </div>
    </aside>
  );
}
