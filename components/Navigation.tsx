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
    <nav className="flex items-center gap-1 rounded-lg p-1 border border-pink-300/80" style={{ background: '#FCE7F3' }}>
      {navigationItems.map((item) => {
        const isActive = pathname === item.href;
        const isDisabled = !!(item.requiresAuth && !isAuthenticated);
        const Icon = item.icon;
        const tooltipText = isDisabled
          ? 'Showing public data. Sign in to add your own books.'
          : undefined;

        if (isDisabled) {
          return (
            <div key={item.href} className="group relative inline-block">
              <span
                className="inline-flex items-center gap-1.5 cursor-not-allowed rounded-md px-3 py-1.5 text-xs font-serif font-medium opacity-50"
                style={{ color: '#9D174D' }}
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </span>
              {tooltipText && (
                <div
                  className="absolute top-full left-1/2 z-50 mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md px-2.5 py-1 text-xs group-hover:block"
                  style={{
                    background: '#831843',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 12px rgba(131, 24, 67, 0.2)',
                  }}
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
            className="inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-serif transition-all"
            style={{
              background: isActive ? '#FFFFFF' : 'transparent',
              color: isActive ? '#9D174D' : '#9D174D',
              fontWeight: isActive ? 700 : 500,
              border: isActive ? '1px solid #FBCFE8' : '1px solid transparent',
              boxShadow: isActive ? '0 1px 3px rgba(190, 24, 93, 0.12)' : 'none',
            }}
          >
            <Icon size={14} className={isActive ? 'text-pink-600' : 'text-pink-700/80'} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
