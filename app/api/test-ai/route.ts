import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const debug: any = {
    hasGlobalThis: typeof globalThis !== 'undefined',
    globalThisKeys: Object.keys(globalThis).filter((k) =>
      k.toLowerCase().includes('cloudflare') || k.toLowerCase().includes('ai')
    ),
  };

  try {
    const getCloudflareContext = (globalThis as any).getCloudflareContext;
    debug.hasGetCloudflareContext = !!getCloudflareContext;
    if (getCloudflareContext) {
      const context = getCloudflareContext();
      debug.context = context ? Object.keys(context) : null;
      debug.hasAI = !!context?.env?.AI;
      debug.aiType = typeof context?.env?.AI;
      debug.aiHasRun = typeof context?.env?.AI?.run === 'function';
    }
  } catch (e) {
    debug.getCloudflareContextError = String(e);
  }

  try {
    const cloudflareContext = (globalThis as any).cloudflareContext;
    debug.hasCloudflareContext = !!cloudflareContext;
    if (cloudflareContext) {
      debug.cloudflareContextKeys = Object.keys(cloudflareContext);
      debug.cloudflareContextHasAI = !!cloudflareContext?.env?.AI;
    }
  } catch (e) {
    debug.cloudflareContextError = String(e);
  }

  try {
    const ai = (globalThis as any).AI;
    debug.hasGlobalAI = !!ai;
    debug.aiRunType = typeof ai?.run;
  } catch (e) {
    debug.globalAIError = String(e);
  }

  debug.processEnv = typeof process !== 'undefined' ? Object.keys(process.env || {}).filter((k) => k.includes('AI')) : [];

  return NextResponse.json(debug, { status: 200 });
}

