'use client';

import Link from 'next/link';

export default function AuthPrompt() {
  return (
    <aside
      aria-label="Public viewer mode notice"
      className="fixed bottom-5 left-5 z-40 hidden sm:block"
    >
      <div 
        className="flex items-center gap-3 rounded-full py-2 pl-4 pr-2"
        style={{ 
          background: 'var(--paper)',
          border: '1px solid var(--color-border)',
          boxShadow: '0 4px 16px rgba(26, 23, 20, 0.08), 0 1px 2px rgba(26, 23, 20, 0.04)',
        }}
      >
        <span className="text-xs font-medium" style={{ color: 'var(--color-foreground-secondary)' }}>
          Browsing <span className="font-bold text-[#1D1B18]">bashdemy</span>&apos;s library
        </span>
        <Link
          href="/login"
          className="rounded-full px-3 py-1 text-xs font-bold text-white transition-all active:translate-y-[1px]"
          style={{ 
            background: 'var(--color-primary)',
            boxShadow: 'var(--shadow-button-primary)',
          }}
        >
          Sign In
        </Link>
      </div>
    </aside>
  );
}
