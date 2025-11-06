'use client';

export default function AuthPrompt() {
  function handleSignInClick() {
    // TODO: Implement Google authentication
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-float cursor-pointer">
      <div 
        className="group relative rounded-full backdrop-blur-sm px-5 py-3 transition-all"
        style={{ 
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-accent-blush)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
            Showing data for{' '}
            <span className="font-bold">bashdemy</span>
          </span>
          <button
            onClick={handleSignInClick}
            className="ml-2 px-3 py-1 text-xs font-bold text-white transition-all active:scale-95"
            style={{ 
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-primary)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-primary-dark)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-primary)'}
          >
            Log in
          </button>
        </div>
        <div 
          className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 rounded-sm"
          style={{ background: 'var(--color-accent-blush)' }}
        ></div>
      </div>
    </div>
  );
}

