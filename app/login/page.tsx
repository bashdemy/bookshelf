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
      className="w-full max-w-sm p-7"
      style={{
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        background: 'var(--paper)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div className="mb-6 text-center">
        <h1 className="flex items-center justify-center gap-2.5 text-2xl font-bold font-serif tracking-tight" style={{ color: 'var(--color-foreground)' }}>
          <span className="flex items-center justify-center h-8 w-8 rounded-full bg-pink-100 text-pink-600 border border-pink-200 shadow-2xs">
            <IconFlower size={18} />
          </span>
          <span>Bookshelf</span>
        </h1>
        <p className="mt-1 text-xs" style={{ color: 'var(--color-foreground-secondary)' }}>
          {mode === 'signin'
            ? 'Sign in to your personal archive'
            : mode === 'register'
            ? 'Create your reading profile'
            : 'Set or update your password'}
        </p>
      </div>

      <div
        className="mb-5 flex rounded-full p-1"
        style={{ background: '#EFEBE2' }}
      >
        <button
          type="button"
          onClick={() => {
            setMode('signin');
            setError(null);
            setSuccessMsg(null);
          }}
          className="flex-1 rounded-full py-1.5 text-xs font-semibold transition-all"
          style={{
            background: mode === 'signin' ? '#FFFFFF' : 'transparent',
            color: mode === 'signin' ? 'var(--color-foreground)' : 'var(--color-foreground-secondary)',
            boxShadow: mode === 'signin' ? '0 1px 2px rgba(26, 23, 20, 0.08)' : 'none',
          }}
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
          className="flex-1 rounded-full py-1.5 text-xs font-semibold transition-all"
          style={{
            background: mode === 'register' ? '#FFFFFF' : 'transparent',
            color: mode === 'register' ? 'var(--color-foreground)' : 'var(--color-foreground-secondary)',
            boxShadow: mode === 'register' ? '0 1px 2px rgba(26, 23, 20, 0.08)' : 'none',
          }}
        >
          New User
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('reset');
            setError(null);
            setSuccessMsg(null);
          }}
          className="flex-1 rounded-full py-1.5 text-xs font-semibold transition-all"
          style={{
            background: mode === 'reset' ? '#FFFFFF' : 'transparent',
            color: mode === 'reset' ? 'var(--color-foreground)' : 'var(--color-foreground-secondary)',
            boxShadow: mode === 'reset' ? '0 1px 2px rgba(26, 23, 20, 0.08)' : 'none',
          }}
        >
          Reset
        </button>
      </div>

      {successMsg && (
        <div
          className="mb-4 rounded-md border p-2.5 text-xs text-emerald-800"
          style={{
            borderColor: '#A7F3D0',
            background: '#ECFDF5',
          }}
        >
          {successMsg}
        </div>
      )}

      {error && (
        <div
          className="mb-4 rounded-md border p-2.5 text-xs text-red-800"
          style={{
            borderColor: '#F5C6CB',
            background: '#FFF5F5',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label
            htmlFor="username"
            className="mb-1 block text-xs font-semibold"
            style={{ color: 'var(--color-foreground)' }}
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
            className="w-full bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E384D]"
            style={{
              borderRadius: 'var(--radius-base)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-foreground)',
            }}
          />
        </div>

        {mode === 'register' && (
          <div>
            <label
              htmlFor="displayName"
              className="mb-1 block text-xs font-semibold"
              style={{ color: 'var(--color-foreground)' }}
            >
              Display Name (optional)
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g., Maria"
              className="w-full bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E384D]"
              style={{
                borderRadius: 'var(--radius-base)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-foreground)',
              }}
            />
          </div>
        )}

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-xs font-semibold"
            style={{ color: 'var(--color-foreground)' }}
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
            className="w-full bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#9E384D]"
            style={{
              borderRadius: 'var(--radius-base)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-foreground)',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !username.trim() || !password}
          className="mt-2 w-full rounded-md py-2.5 text-xs font-bold text-white transition-all active:translate-y-[1px] disabled:opacity-50"
          style={{
            background: 'var(--color-primary)',
            boxShadow: 'var(--shadow-button-primary)',
          }}
        >
          {isSubmitting
            ? mode === 'signin'
              ? 'Authenticating...'
              : mode === 'register'
              ? 'Creating account...'
              : 'Updating password...'
            : mode === 'signin'
              ? 'Sign In'
              : mode === 'register'
              ? 'Create Account'
              : 'Reset & Sign In'}
        </button>
      </form>

      <div className="mt-5 text-center text-xs" style={{ color: 'var(--color-foreground-secondary)' }}>
        <Link href="/" className="hover:underline" style={{ color: 'var(--color-foreground-secondary)' }}>
          ← Back to library
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
