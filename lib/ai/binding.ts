export async function getAIBinding(): Promise<any> {
  const methods: Array<{ name: string; fn: () => Promise<any> | any }> = [];

  methods.push({
    name: 'getCloudflareContext (async) - OpenNext official',
    fn: async () => {
      try {
        const getCloudflareContext = (globalThis as any).getCloudflareContext;
        if (getCloudflareContext && typeof getCloudflareContext === 'function') {
          const context = await getCloudflareContext({ async: true });
          if (context?.env?.AI) {
            console.log('AI binding found via getCloudflareContext async');
            return context.env.AI;
          }
        }
      } catch (e) {
        console.debug('getCloudflareContext async failed:', e);
      }
      return null;
    },
  });

  methods.push({
    name: 'getCloudflareContext (sync)',
    fn: () => {
      try {
        const getCloudflareContext = (globalThis as any).getCloudflareContext;
        if (getCloudflareContext) {
          const context = getCloudflareContext();
          return context?.env?.AI;
        }
      } catch (e) {
        console.debug('getCloudflareContext sync failed:', e);
      }
      return null;
    },
  });

  methods.push({
    name: 'cloudflareContextSymbol (direct)',
    fn: () => {
      try {
        const cloudflareContextSymbol = Symbol.for('__cloudflare-context__');
        const cloudflareContext = (globalThis as any)[cloudflareContextSymbol];
        return cloudflareContext?.env?.AI;
      } catch {
        return null;
      }
    },
  });

  methods.push({
    name: 'cloudflareContext getter',
    fn: () => {
      const cloudflareContext = (globalThis as any).cloudflareContext;
      return cloudflareContext?.env?.AI;
    },
  });

  methods.push({
    name: 'cloudflareContext Symbol',
    fn: () => {
      try {
        const cloudflareContextSymbol = Symbol.for('cloudflareContext');
        const cloudflareContext = (globalThis as any)[cloudflareContextSymbol];
        return cloudflareContext?.env?.AI;
      } catch {
        return null;
      }
    },
  });

  methods.push({
    name: 'AsyncLocalStorage (OpenNext)',
    fn: () => {
      try {
        const asyncHooks = require('async_hooks');
        const AsyncLocalStorage = asyncHooks.AsyncLocalStorage;
        
        const allStores = [];
        let current = asyncHooks.executionAsyncId();
        while (current) {
          try {
            const store = new AsyncLocalStorage();
            const context = store.getStore();
            if (context?.env?.AI) {
              return context.env.AI;
            }
          } catch {}
          current = asyncHooks.triggerAsyncId();
        }
        
        const store = new AsyncLocalStorage();
        const context = store.getStore();
        return context?.env?.AI;
      } catch {
        return null;
      }
    },
  });

  methods.push({
    name: 'cloudflareContextALS (direct)',
    fn: () => {
      try {
        const cloudflareContextALS = (globalThis as any).cloudflareContextALS;
        if (cloudflareContextALS) {
          const context = cloudflareContextALS.getStore();
          return context?.env?.AI;
        }
      } catch {
        return null;
      }
      return null;
    },
  });

  methods.push({
    name: 'globalThis.AI',
    fn: () => {
      const ai = (globalThis as any).AI;
      if (ai && typeof ai.run === 'function') {
        return ai;
      }
      return null;
    },
  });

  methods.push({
    name: 'process.env.AI',
    fn: () => {
      const processEnv = (globalThis as any).process?.env;
      return processEnv?.AI || null;
    },
  });

  for (const method of methods) {
    try {
      const result = await method.fn();
      if (result && typeof result.run === 'function') {
        console.log(`AI binding found via: ${method.name}`);
        return result;
      }
    } catch (e) {
      console.debug(`${method.name} failed:`, e);
    }
  }

  console.error('AI binding not found. Available keys:', {
    globalThisKeys: Object.keys(globalThis).filter((k) => k.includes('cloudflare') || k.includes('AI')),
    hasProcess: typeof process !== 'undefined',
    processEnvKeys: typeof process !== 'undefined' ? Object.keys(process.env || {}).filter((k) => k.includes('AI')) : [],
  });

  return null;
}

