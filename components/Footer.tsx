'use client';

import { IconFlower, IconHeartFilled, IconExternalLink } from '@tabler/icons-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t py-8" style={{ borderColor: '#FCE7F3', background: '#FFF7F9' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-3 text-xs sm:flex-row text-pink-900/70">
          <p className="flex items-center gap-2 font-semibold text-pink-950">
            <span className="flex items-center justify-center h-5 w-5 rounded-full bg-pink-100 text-pink-600 border border-pink-200">
              <IconFlower size={13} />
            </span>
            <span>Bookshelf</span>
            <span className="text-pink-300">•</span>
            <span className="text-pink-700">Personal Reading Archive</span>
          </p>
          <div className="flex items-center gap-4 text-pink-900/70">
            <a
              href="https://bashdemy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-pink-950 transition-all hover:text-pink-600 group"
            >
              <span>built by bashdemy</span>
              <IconHeartFilled size={14} className="text-pink-500 fill-pink-500 group-hover:scale-125 transition-transform" />
              <IconExternalLink size={12} className="text-pink-400 group-hover:text-pink-600 transition-colors" />
            </a>
            <span className="text-pink-400 font-mono">© {currentYear}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
