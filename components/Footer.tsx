'use client';

import { IconHeartFilled, IconExternalLink, IconSparkles } from '@tabler/icons-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="mt-20 border-t py-12 relative overflow-hidden"
      style={{
        borderColor: 'rgba(244, 114, 182, 0.2)',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(253, 242, 247, 0.8) 100%)',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 text-xs sm:flex-row text-pink-900/70">
          <div className="flex items-center gap-2 font-sans">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pink-100 text-pink-500 shadow-2xs">
              <IconSparkles size={12} />
            </span>
            <span className="font-semibold text-pink-950 font-serif text-sm">Bookshelf</span>
            <span className="text-pink-300">•</span>
            <span className="text-pink-700/80">A cozy, whimsical reading nook</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://bashdemy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-sans text-xs transition-colors hover:text-pink-600 group"
              style={{ color: 'var(--foreground)' }}
            >
              <span>lovingly crafted by <strong className="font-semibold text-pink-700 underline decoration-pink-300 decoration-2 underline-offset-4">bashdemy</strong></span>
              <IconHeartFilled size={13} className="text-rose-400 fill-rose-400 group-hover:scale-125 transition-transform" />
              <IconExternalLink size={12} className="opacity-40 group-hover:opacity-100 transition-opacity" />
            </a>
            <span className="text-pink-300">•</span>
            <span className="font-sans text-[11px] text-pink-400 font-medium">© {currentYear}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
