import { neon } from '@neondatabase/serverless';

let sqlInstance: ReturnType<typeof neon> | null = null;

function getSql() {
  if (!sqlInstance) {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    sqlInstance = neon(databaseUrl);
  }
  
  return sqlInstance;
}

// Create a callable Proxy that handles both function calls and property access
export const sql = new Proxy(() => {}, {
  apply(_target, _thisArg, argumentsList) {
    const instance = getSql();
    // Handle tagged template literal calls: sql`...`
    return (instance as any).apply(null, argumentsList);
  },
  get(_target, prop) {
    const instance = getSql();
    const value = (instance as any)[prop];
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  },
}) as unknown as ReturnType<typeof neon>;

