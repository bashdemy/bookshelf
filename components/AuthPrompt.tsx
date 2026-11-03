'use client';

import Link from 'next/link';
import { IconLogin } from '@tabler/icons-react';

export default function AuthPrompt() {
  return (
    <aside
      aria-label="Public viewer mode notice"
      className="fixed bottom-5 left-5 z-40 hidden sm:block"
    >
      <div 
        className="bookplate flex items-center gap-3 rounded-lg py-2 pl-3.5 pr-2"
        style={{ 
          background: 'var(--paper)',
          border: '1px solid var(--color-border)',
          boxShadow: '0 8px 24px rgba(90, 34, 50, 0.12), 0 2px 6px rgba(197, 160, 89, 0.15)',
        }}
      >
        <span className="flex items-center gap-1.5 text-xs font-serif" style={{ color: 'var(--foreground-secondary)' }}>
          <span className="gold-text select-none">❦</span>
          <span>Browsing <strong className="font-semibold" style={{ color: 'var(--foreground)' }}>bashdemy</strong>&apos;s library</span>
        </span>
        <Link
          href="/login"
          className="brass-plate inline-flex items-center gap-1.5 rounded px-3 py-1 text-xs font-serif font-bold text-white transition-all shadow-xs active:translate-y-[1px]"
        >
          <IconLogin size={13} className="text-[#FFE58F]" />
          <span>Sign In</span>
        </Link>
      </div>
    </aside>
  );
}
