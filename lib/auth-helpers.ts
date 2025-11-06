import { auth } from '@/auth';
import { sql } from './db';

export async function getCurrentUser() {
  const session = await auth();
  return session?.user || null;
}

export async function getCurrentUserId(): Promise<string> {
  const user = await getCurrentUser();
  return user?.id || 'bashdemy';
}

export async function getUserProfile(userId: string) {
  try {
    const result = await sql`
      SELECT id, username, display_name, email, avatar_url, is_root
      FROM users
      WHERE id = ${userId}
      LIMIT 1
    ` as Array<{
      id: string;
      username: string | null;
      display_name: string;
      email: string | null;
      avatar_url: string | null;
      is_root: boolean;
    }>;

    return result[0] || null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function checkUserOnboarding(userId: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT username, display_name
      FROM users
      WHERE id = ${userId}
      LIMIT 1
    ` as Array<{
      username: string | null;
      display_name: string;
    }>;

    if (!result[0]) return false;
    
    return !!(result[0].username && result[0].display_name);
  } catch (error) {
    console.error('Error checking onboarding:', error);
    return false;
  }
}

export async function updateUserProfile(
  userId: string,
  updates: { username?: string; displayName?: string }
) {
  try {
    await sql`
      UPDATE users
      SET 
        username = COALESCE(${updates.username || null}, username),
        display_name = COALESCE(${updates.displayName || null}, display_name),
        updated_at = NOW()
      WHERE id = ${userId}
    `;
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
}

