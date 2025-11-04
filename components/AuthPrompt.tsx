'use client';

export default function AuthPrompt() {
  function handleSignInClick() {
    // TODO: Implement Google authentication
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-float cursor-pointer">
      <div className="group relative rounded-full bg-pink-200/95 backdrop-blur-sm px-5 py-3 shadow-lg shadow-pink-300/30 transition-all hover:bg-pink-300/95 hover:shadow-xl hover:shadow-pink-400/40">
        <div className="flex items-center gap-2">
          <span className="text-sm text-pink-700">
            Showing data for{' '}
            <span className="font-semibold">bashdemy</span>
          </span>
          <button
            onClick={handleSignInClick}
            className="ml-2 rounded-full bg-pink-500 px-3 py-1 text-xs font-semibold text-white transition-all hover:bg-pink-600 active:scale-95"
          >
            Log in
          </button>
        </div>
        <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 rounded-sm bg-pink-200/95"></div>
      </div>
    </div>
  );
}

