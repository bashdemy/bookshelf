import { sql } from '../lib/db';
import { hashPassword } from '../lib/password';

async function main() {
  const [username, password] = process.argv.slice(2);
  if (!username || !password) {
    console.error('Usage: npm run set-password <username> <password>');
    process.exit(1);
  }

  const hash = await hashPassword(password);
  const updated = (await sql`
    UPDATE users
    SET password_hash = ${hash}, updated_at = NOW()
    WHERE LOWER(username) = LOWER(${username.trim()})
    RETURNING id, username, display_name
  `) as Array<{ id: string; username: string; display_name: string }>;

  if (updated.length === 0) {
    console.error(`User "${username}" not found.`);
    process.exit(1);
  }

  console.log(`Password successfully set for user "${updated[0].username}".`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
