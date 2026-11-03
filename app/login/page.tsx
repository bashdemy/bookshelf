'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { IconFlower } from '@tabler/icons-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [mode, setMode] = useState<'signin' | 'register' | 'reset'>('signin');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    const cleanUsername = username.trim().toLowerCase();

    try {
      if (mode === 'reset') {
        const resetRes = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: cleanUsername,
            newPassword: password,
          }),
        });

        const resetData = await resetRes.json();
        if (!resetRes.ok) {
          throw new Error(resetData.error || 'Failed to reset password');
        }

        setSuccessMsg('Password updated! Signing you in...');
      } else if (mode === 'register') {
        const regRes = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: cleanUsername,
            displayName: displayName.trim() || cleanUsername,
            password,
          }),
        });

        const regData = await regRes.json();
        if (!regRes.ok) {
          throw new Error(regData.error || 'Failed to create account');
        }
      }

      const res = await signIn('credentials', {
        username: cleanUsername,
        password,
        redirect: false,
      });

      if (res?.error) {
        throw new Error('Invalid username or password');
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during authentication');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="bookplate w-full max-w-sm p-8"
      style={{
        boxShadow: '0 12px 36px rgba(90, 34, 50, 0.14), 0 2px 8px rgba(197, 160, 89, 0.2)',
      }}
    >
      <div className="mb-6 text-center">
        <p className="text-[10px] font-serif uppercase tracking-widest text-[#8A4B58] flex items-center justify-center gap-2 mb-1">
          <span className="gold-text select-none">❦</span>
          <span>Ex Libris • Reader Access</span>
          <span className="gold-text select-none">❦</span>
        </p>
        <h1 className="text-2xl font-bold font-serif tracking-tight text-[#5A2232]">
          Library Register
        </h1>
        <p className="mt-1 text-xs font-serif text-[#8A4B58]">
          {mode === 'signin'
            ? 'Sign in to catalogue or edit volumes'
            : mode === 'register'
            ? 'Register a new librarian profile'
            : 'Reset access key credentials'}
        </p>
      </div>

      <div
        className="mb-5 flex rounded p-1"
        style={{
          background: 'rgba(233, 207, 199, 0.35)',
          border: '1px solid var(--color-border)',
        }}
      >
        <button
          type="button"
          onClick={() => {
            setMode('signin');
            setError(null);
            setSuccessMsg(null);
          }}
          className={`flex-1 rounded py-1.5 text-xs font-serif font-bold transition-all ${
            mode === 'signin' ? 'brass-plate text-white shadow-xs' : 'text-[#8A4B58] hover:text-[#5A2232]'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('register');
            setError(null);
            setSuccessMsg(null);
          }}
          className={`flex-1 rounded py-1.5 text-xs font-serif font-bold transition-all ${
            mode === 'register' ? 'brass-plate text-white shadow-xs' : 'text-[#8A4B58] hover:text-[#5A2232]'
          }`}
        >
          New Reader
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('reset');
            setError(null);
            setSuccessMsg(null);
          }}
          className={`flex-1 rounded py-1.5 text-xs font-serif font-bold transition-all ${
            mode === 'reset' ? 'brass-plate text-white shadow-xs' : 'text-[#8A4B58] hover:text-[#5A2232]'
          }`}
        >
          Reset
        </button>
      </div>

      {successMsg && (
        <div
          className="mb-4 rounded border p-2.5 text-xs font-serif"
          style={{
            borderColor: '#A7F3D0',
            background: '#ECFDF5',
            color: '#065F46',
          }}
        >
          {successMsg}
        </div>
      )}

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
          <label
            htmlFor="username"
            className="mb-1 block text-xs font-serif font-semibold text-[#5A2232]"
          >
            Username *
          </label>
          <input
            id="username"
            type="text"
            required
            autoCapitalize="none"
            autoCorrect="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g., bashdemy"
            className="w-full bg-[#FFFAF5] px-3 py-2 text-xs font-serif focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
            style={{
              borderRadius: 'var(--radius-base)',
              border: '1px solid var(--color-border)',
              color: 'var(--foreground)',
            }}
          />
        </div>

        {mode === 'register' && (
          <div>
            <label
              htmlFor="displayName"
              className="mb-1 block text-xs font-serif font-semibold text-[#5A2232]"
            >
              Display Name (optional)
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g., Maria"
              className="w-full bg-[#FFFAF5] px-3 py-2 text-xs font-serif focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
              style={{
                borderRadius: 'var(--radius-base)',
                border: '1px solid var(--color-border)',
                color: 'var(--foreground)',
              }}
            />
          </div>
        )}

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-xs font-serif font-semibold text-[#5A2232]"
          >
            Password *
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === 'register' ? 'At least 6 characters' : 'Enter your password'}
            className="w-full bg-[#FFFAF5] px-3 py-2 text-xs font-serif focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
            style={{
              borderRadius: 'var(--radius-base)',
              border: '1px solid var(--color-border)',
              color: 'var(--foreground)',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !username.trim() || !password}
          className="brass-plate mt-2 w-full rounded py-2.5 text-xs font-serif font-bold text-white transition-all active:translate-y-[1px] disabled:opacity-50"
        >
          {isSubmitting
            ? mode === 'signin'
              ? 'Authenticating...'
              : mode === 'register'
              ? 'Creating register entry...'
              : 'Updating key...'
            : mode === 'signin'
              ? 'Sign Into Archive'
              : mode === 'register'
              ? 'Register Reader Profile'
              : 'Reset & Sign In'}
        </button>
      </form>

      <div className="mt-5 text-center text-xs">
        <Link href="/" className="font-serif text-[#8A4B58] hover:text-[#5A2232] transition-colors">
          ← Return to reading room
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[75vh] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-xs">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
