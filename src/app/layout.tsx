import type { Metadata } from 'next';
import { Inter, Quicksand } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-cute',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Bookshelf',
  description: 'A lightweight, serverless reading tracker',
  metadataBase: new URL('https://bookshelf.bashdemy.com'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${quicksand.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <div className="min-h-screen bg-background">
            <header className="border-b">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold font-cute">Bookshelf</h1>
                  <ThemeToggle />
                </div>
                <Navigation />
              </div>
            </header>
            <main>{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
