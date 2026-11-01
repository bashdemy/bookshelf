'use client';

import Link from 'next/link';
import { IconFlower, IconLogin } from '@tabler/icons-react';

export default function AuthPrompt() {
  return (
    <aside
      aria-label="Public viewer mode notice"
      className="fixed bottom-5 left-5 z-40 hidden sm:block"
    >
      <div 
        className="flex items-center gap-3 rounded-xl py-2 pl-3.5 pr-2 bg-white"
        style={{ 
          border: '1px solid #FBCFE8',
          boxShadow: '0 6px 20px rgba(190, 24, 93, 0.12), 0 1px 3px rgba(190, 24, 93, 0.05)',
        }}
      >
        <span className="flex items-center gap-1.5 text-xs font-serif font-medium text-pink-900/80">
          <IconFlower size={15} className="text-pink-600" />
          <span>Browsing <span className="font-semibold text-pink-900">bashdemy</span>&apos;s library</span>
        </span>
        <Link
          href="/login"
          className="inline-flex items-center gap-1 rounded-md px-3.5 py-1 text-xs font-serif font-bold text-white transition-all bg-pink-600 hover:bg-pink-700 border border-pink-700 shadow-xs active:translate-y-[1px]"
        >
          <IconLogin size={13} />
          <span>Sign In</span>
        </Link>
      </div>
    </aside>
  );
}
