'use client';

import Link from 'next/link';
import { IconArrowRight } from '@tabler/icons-react';

interface NavigationCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
  accentColor?: 'primary' | 'secondary';
}

export default function NavigationCard({ 
  href, 
  icon, 
  title, 
  description,
}: NavigationCardProps) {
  return (
    <Link
      href={href}
      className="whimsical-card group relative flex flex-col items-center p-6 sm:p-7 text-center transition-all"
    >
      <div className="mb-3 text-3xl transition-transform group-hover:scale-115 duration-200">{icon}</div>
      <h3 className="mb-1 text-base font-serif font-bold text-pink-950 group-hover:text-pink-600 transition-colors">
        {title}
      </h3>
      <p className="text-xs font-sans leading-relaxed text-pink-700/80">
        {description}
      </p>
      <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-sans font-semibold text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity">
        <span>Explore</span>
        <IconArrowRight size={12} />
      </span>
    </Link>
  );
}
