/**
 * Resolves Cloudflare Workers AI binding from the runtime environment.
 */
export async function getAIBinding(): Promise<any> {
  const globalAny = globalThis as any;

  // 1. Official OpenNext async context getter
  try {
    if (typeof globalAny.getCloudflareContext === 'function') {
      const context = await globalAny.getCloudflareContext({ async: true });
      if (context?.env?.AI) return context.env.AI;
      
      const syncContext = globalAny.getCloudflareContext();
      if (syncContext?.env?.AI) return syncContext.env.AI;
    }
  } catch {}

  // 2. Direct symbol and property bindings
  try {
    const symbolKey = Symbol.for('__cloudflare-context__');
    if (globalAny[symbolKey]?.env?.AI) {
      return globalAny[symbolKey].env.AI;
    }
  } catch {}

  // 3. Fallback to global AI or process.env.AI
  if (globalAny.AI && typeof globalAny.AI.run === 'function') {
    return globalAny.AI;
  }

  if (globalAny.process?.env?.AI) {
    return globalAny.process.env.AI;
  }

  return null;
}
