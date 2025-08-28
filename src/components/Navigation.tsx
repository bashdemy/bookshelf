'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { BookOpen, FileText, BarChart3, Plus } from 'lucide-react';

const navigation = [
  { name: 'Books', href: '/books', icon: BookOpen },
  { name: 'Articles', href: '/articles', icon: FileText },
  { name: 'Data', href: '/data', icon: BarChart3 },
  { name: 'Add Item', href: '/add', icon: Plus },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <NavigationMenu className="max-w-none">
      <NavigationMenuList className="space-x-1">
        {navigation.map(item => {
          const isActive = pathname === item.href;
          return (
            <NavigationMenuItem key={item.name}>
              <NavigationMenuLink asChild>
                <Link
                  href={item.href}
                  className={cn(
                    'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50',
                    isActive && 'bg-accent/50'
                  )}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
