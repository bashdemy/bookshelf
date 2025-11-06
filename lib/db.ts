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

export const sql = new Proxy({} as ReturnType<typeof neon>, {
  get(_target, prop) {
    const instance = getSql();
    const value = instance[prop as keyof ReturnType<typeof neon>];
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  },
  apply(_target, _thisArg, argumentsList) {
    return getSql().apply(null, argumentsList as any);
  },
}) as ReturnType<typeof neon>;

