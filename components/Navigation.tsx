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
  { href: '/add', label: 'Add', icon: IconPlus, requiresAuth: true },
];

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  return (
    <nav className="flex items-center gap-1 rounded-sm p-0.5 border border-gold/35 bg-white/70 shadow-2xs">
      {navigationItems.map((item) => {
        const isActive = pathname === item.href;
        const isDisabled = !!(item.requiresAuth && !isAuthenticated);
        const Icon = item.icon;
        const tooltipText = isDisabled
          ? 'Sign in to log and catalog your own reads.'
          : undefined;

        if (isDisabled) {
          return (
            <div key={item.href} className="group relative inline-block">
              <span
                className="inline-flex items-center gap-1.5 cursor-not-allowed rounded-[2px] px-3 py-1.5 text-xs font-serif font-medium opacity-40 text-pink-800"
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </span>
              {tooltipText && (
                <div
                  className="absolute top-full left-1/2 z-50 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-[2px] px-2.5 py-1 text-xs font-serif group-hover:block bg-pink-900 text-white shadow-lg border border-gold/40"
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
            className={`inline-flex items-center gap-1.5 rounded-[2px] px-3.5 py-1.5 text-xs font-serif transition-all ${
              isActive
                ? 'brass-plate font-semibold'
                : 'text-pink-800/80 hover:text-pink-950 hover:bg-white/60'
            }`}
          >
            <Icon size={14} className={isActive ? 'text-gold-dark' : 'text-gold'} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
