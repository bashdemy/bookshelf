'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  IconHome,
  IconBooks,
  IconArticle,
  IconChartBar,
  IconPlus,
  type TablerIcon,
} from '@tabler/icons-react';

interface NavigationItem {
  href: string;
  label: string;
  icon: TablerIcon;
  requiresAuth?: boolean;
}

const navigationItems: NavigationItem[] = [
  { href: '/', label: 'Home', icon: IconHome },
  { href: '/books', label: 'Books', icon: IconBooks },
  { href: '/articles', label: 'Articles', icon: IconArticle },
  { href: '/stats', label: 'Stats', icon: IconChartBar },
  { href: '/add', label: 'Log Read', icon: IconPlus, requiresAuth: true },
];

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  return (
    <nav className="flex items-center gap-1 rounded-full p-1 border border-pink-200/80 bg-white/80 backdrop-blur-md shadow-xs">
      {navigationItems.map((item) => {
        const isActive = pathname === item.href;
        const isDisabled = !!(item.requiresAuth && !isAuthenticated);
        const Icon = item.icon;
        const tooltipText = isDisabled
          ? 'Sign in to log and catalog your own reads 💖'
          : undefined;

        if (isDisabled) {
          return (
            <div key={item.href} className="group relative inline-block">
              <span
                className="inline-flex items-center gap-1.5 cursor-not-allowed rounded-full px-3 py-1.5 text-xs font-sans font-medium opacity-40 text-pink-700"
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </span>
              {tooltipText && (
                <div
                  className="absolute top-full left-1/2 z-50 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-sans group-hover:block bg-pink-950 text-pink-100 shadow-xl border border-pink-300/30 animate-fadeIn"
                >
                  {tooltipText}
                </div>
              )}
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-sans transition-all duration-200 ${
              isActive
                ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-semibold shadow-xs shadow-pink-500/30 scale-[1.02]'
                : 'text-pink-900/70 hover:text-pink-950 hover:bg-pink-100/60 font-medium'
            }`}
          >
            <Icon size={14} className={isActive ? 'text-white' : 'text-pink-400 group-hover:text-pink-600'} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
