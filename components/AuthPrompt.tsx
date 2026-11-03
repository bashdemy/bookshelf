'use client';

import Link from 'next/link';
import { IconLogin, IconSparkles } from '@tabler/icons-react';

export default function AuthPrompt() {
  return (
    <aside
      aria-label="Public viewer mode notice"
      className="fixed bottom-5 left-5 z-40 hidden sm:block animate-fadeIn"
    >
      <div 
        className="flex items-center gap-3 rounded-full py-1.5 pl-4 pr-1.5 bg-white/95 backdrop-blur-md"
        style={{ 
          border: '1px solid rgba(244, 114, 182, 0.35)',
          boxShadow: '0 10px 25px -4px rgba(236, 72, 153, 0.18), 0 2px 6px rgba(236, 72, 153, 0.08)',
        }}
      >
        <span className="flex items-center gap-1.5 text-xs font-sans text-pink-900/80">
          <IconSparkles size={14} className="text-pink-500 animate-pulse" />
          <span>Visiting <strong className="font-semibold text-pink-950">bashdemy</strong>&apos;s shelf</span>
        </span>
        <Link
          href="/login"
          className="whimsical-btn-primary text-xs py-1.5 px-3.5"
        >
          <IconLogin size={13} />
          <span>Sign In</span>
        </Link>
      </div>
    </aside>
  );
}
