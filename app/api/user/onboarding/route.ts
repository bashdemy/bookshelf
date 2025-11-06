import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { updateUserProfile } from '@/lib/auth-helpers';
import { sql } from '@/lib/db';
import { z } from 'zod';

const onboardingSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-z0-9_-]+$/),
  displayName: z.string().min(1).max(50),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = onboardingSchema.parse(body);

    const existingUser = await sql`
      SELECT id FROM users WHERE username = ${validated.username} AND id != ${session.user.id}
      LIMIT 1
    ` as Array<{ id: string }>;

    if (existingUser.length > 0) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
    }

    const updated = await updateUserProfile(session.user.id, {
      username: validated.username,
      displayName: validated.displayName,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    // Verify the update was successful
    const verifyResult = await sql`
      SELECT username, display_name
      FROM users
      WHERE id = ${session.user.id}
      LIMIT 1
    ` as Array<{
      username: string | null;
      display_name: string;
    }>;

    if (!verifyResult[0] || !verifyResult[0].username || !verifyResult[0].display_name) {
      return NextResponse.json({ error: 'Profile update verification failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }

    console.error('Onboarding error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

