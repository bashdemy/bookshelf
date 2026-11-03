'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function OnboardingPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      if (!displayName && (session.user.displayName || session.user.name)) {
        setDisplayName(session.user.displayName || session.user.name || '');
      }
      if (!username) {
        if (session.user.username) {
          setUsername(session.user.username);
        } else if (session.user.email) {
          const suggested = session.user.email
            .split('@')[0]
            .toLowerCase()
            .replace(/[^a-z0-9_-]/g, '')
            .slice(0, 20);
          if (suggested.length >= 3) {
            setUsername(suggested);
          }
        }
      }
    }
  }, [session, displayName, username]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, displayName }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to complete profile');
      }

      await update();
      router.refresh();
      window.location.href = '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidUsername = (u: string) => {
    return /^[a-z0-9_-]{3,20}$/.test(u);
  };

  return (
    <main className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div
        className="bookplate w-full p-8"
        style={{
          boxShadow: '0 12px 36px rgba(90, 34, 50, 0.14), 0 2px 8px rgba(197, 160, 89, 0.2)',
        }}
      >
        <p className="text-[10px] font-serif uppercase tracking-widest text-[#8A4B58] flex items-center gap-2 mb-1.5">
          <span className="gold-text select-none">❦</span>
          <span>Ex Libris • Reader Registry</span>
          <span className="gold-text select-none">❦</span>
        </p>
        <h1 className="mb-1 text-2xl font-bold font-serif tracking-tight text-[#5A2232]">
          Librarian Profile Setup
        </h1>
        <p className="mb-6 text-xs font-serif text-[#8A4B58]">
          Choose your reader handle and public bookshelf display name
        </p>

        {error && (
          <div
            className="mb-4 rounded border p-2.5 text-xs font-serif"
            style={{
              borderColor: '#F5C6CB',
              background: '#FFF5F5',
              color: '#9E384D',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="mb-1 block text-xs font-serif font-semibold text-[#5A2232]">
              Reader Handle *
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              required
              pattern="[a-z0-9_-]{3,20}"
              className="w-full bg-[#FFFAF5] px-3 py-2 text-xs font-serif focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
              style={{ 
                borderRadius: 'var(--radius-base)',
                border: '1px solid var(--color-border)',
                color: 'var(--foreground)',
              }}
              placeholder="e.g., maria"
            />
            <p className="mt-1 text-[11px] font-serif text-[#8A4B58]">
              3–20 characters: lowercase letters, numbers, hyphens, underscores
            </p>
          </div>

          <div>
            <label htmlFor="displayName" className="mb-1 block text-xs font-serif font-semibold text-[#5A2232]">
              Public Inscription Name *
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full bg-[#FFFAF5] px-3 py-2 text-xs font-serif focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
              style={{ 
                borderRadius: 'var(--radius-base)',
                border: '1px solid var(--color-border)',
                color: 'var(--foreground)',
              }}
              placeholder="e.g., Maria K."
            />
            <p className="mt-1 text-[11px] font-serif text-[#8A4B58]">
              How your name will be inscribed upon your bookcase
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isValidUsername(username) || !displayName.trim()}
            className="brass-plate w-full rounded py-2.5 text-xs font-serif font-bold text-white transition-all active:translate-y-[1px] disabled:opacity-50"
          >
            {isSubmitting ? 'Inscribing Ledger...' : 'Inscribe Profile'}
          </button>
        </form>
      </div>
    </main>
  );
}
