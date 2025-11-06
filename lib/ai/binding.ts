export function getAIBinding(): any {
  try {
    const getCloudflareContext = (globalThis as any).getCloudflareContext;
    if (getCloudflareContext) {
      const context = getCloudflareContext();
      if (context?.env?.AI) {
        return context.env.AI;
      }
    }
  } catch {}

  try {
    const cloudflareContext = (globalThis as any).cloudflareContext;
    if (cloudflareContext?.env?.AI) {
      return cloudflareContext.env.AI;
    }
  } catch {}

  return (
    (globalThis as any).AI ||
    ((globalThis as any).process?.env as any)?.AI ||
    (process.env as any).AI
  );
}

