import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';
import { hashPassword } from '@/lib/password';

export const dynamic = 'force-dynamic';

const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
  displayName: z.string().max(50).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = registerSchema.parse(body);

    const cleanUsername = validated.username.trim().toLowerCase();
    const cleanDisplayName = (validated.displayName || validated.username).trim();

    // Check if username already exists
    const existing = (await sql`
      SELECT id, password_hash, display_name FROM users
      WHERE LOWER(username) = ${cleanUsername}
      LIMIT 1
    `) as Array<{ id: string; password_hash: string | null; display_name: string }>;

    if (existing.length > 0) {
      // If the user exists without a password (e.g. the initial seeded bashdemy root user),
      // allow setting their password securely
      if (existing[0].password_hash === null) {
        const passwordHash = await hashPassword(validated.password);
        await sql`
          UPDATE users
          SET password_hash = ${passwordHash},
              display_name = ${cleanDisplayName || existing[0].display_name},
              updated_at = NOW()
          WHERE id = ${existing[0].id}
        `;

        return NextResponse.json(
          { success: true, username: cleanUsername },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(validated.password);
    const userId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    await sql`
      INSERT INTO users (id, username, display_name, password_hash)
      VALUES (${userId}, ${cleanUsername}, ${cleanDisplayName}, ${passwordHash})
    `;

    return NextResponse.json(
      { success: true, username: cleanUsername },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to register account' },
      { status: 500 }
    );
  }
}
