import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { checkUserOnboarding } from '@/lib/auth-helpers';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ isOnboarded: false, authenticated: false });
    }

    const isOnboarded = await checkUserOnboarding(session.user.id);
    return NextResponse.json({ isOnboarded, authenticated: true });
  } catch (error) {
    console.error('Error checking onboarding:', error);
    return NextResponse.json({ isOnboarded: false, authenticated: false });
  }
}

