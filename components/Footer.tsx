'use client';

import { IconHeartFilled, IconExternalLink } from '@tabler/icons-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="mt-20 border-t py-10"
      style={{
        borderColor: 'rgba(212, 175, 55, 0.25)',
        background: 'linear-gradient(180deg, rgba(255, 250, 245, 0.85) 0%, rgba(246, 232, 226, 0.95) 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.6)',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 text-xs sm:flex-row" style={{ color: 'var(--foreground-secondary)' }}>
          <div className="flex items-center gap-2.5 font-serif">
            <span className="gold-text text-sm select-none">❦</span>
            <span className="font-semibold tracking-wider uppercase text-[11px]" style={{ color: 'var(--foreground)' }}>
              The Bookshelf Archive
            </span>
            <span className="opacity-40">•</span>
            <span className="italic opacity-80">A Physical & Digital Reading Companion</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://bashdemy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-serif text-xs transition-colors hover:text-[#9E384D] group"
              style={{ color: 'var(--foreground)' }}
            >
              <span>curated by <strong className="font-semibold underline decoration-[#D4AF37]/40 underline-offset-4">bashdemy</strong></span>
              <IconHeartFilled size={13} className="text-[#C5A059] fill-[#C5A059] group-hover:scale-125 transition-transform" />
              <IconExternalLink size={12} className="opacity-50 group-hover:opacity-100 transition-opacity" />
            </a>
            <span className="opacity-30">•</span>
            <span className="font-mono text-[11px] opacity-70">Anno {currentYear}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
