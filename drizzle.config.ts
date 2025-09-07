import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'd1',
  dbCredentials: {
    wranglerConfigPath: './wrangler.toml',
    // Must match the database_name in wrangler.toml
    dbName: 'bookself-db',
  },
  verbose: true,
  strict: true,
});
