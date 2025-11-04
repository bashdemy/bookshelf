import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bookshelf - Track Your Reading Journey",
  description: "A personal bookshelf to track books and articles you've read. View your reading statistics and discover new content.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-pink-50 via-pink-100/70 to-pink-200/50">
          <Header />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
