import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';
import { hashPassword } from '@/lib/password';

export const dynamic = 'force-dynamic';

const resetSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = resetSchema.parse(body);

    const cleanUsername = validated.username.trim().toLowerCase();

    const existing = (await sql`
      SELECT id, username, display_name FROM users
      WHERE LOWER(username) = ${cleanUsername}
      LIMIT 1
    `) as Array<{ id: string; username: string; display_name: string }>;

    if (existing.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const newHash = await hashPassword(validated.newPassword);

    await sql`
      UPDATE users
      SET password_hash = ${newHash}, updated_at = NOW()
      WHERE id = ${existing[0].id}
    `;

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password reset error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to reset password' },
      { status: 500 }
    );
  }
}
