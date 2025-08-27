import { drizzle } from 'drizzle-orm/d1';
import { migrate } from 'drizzle-orm/d1/migrator';
import * as schema from './schema';

export function createDb(d1: D1Database) {
  return drizzle(d1, { schema });
}

export async function runMigrations(db: ReturnType<typeof createDb>) {
  await migrate(db, { migrationsFolder: './drizzle' });
}

export { schema };
export type { Book, NewBook } from './schema';
