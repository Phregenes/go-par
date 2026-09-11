import pg from 'pg'
import { env } from './env.js'

let pool

export function getPool() {
  if (!env.databaseUrl) {
    return null
  }

  if (!pool) {
    pool = new pg.Pool({
      connectionString: env.databaseUrl,
      ssl:
        env.nodeEnv === 'production'
          ? { rejectUnauthorized: false }
          : false,
    })
  }

  return pool
}

export async function pingDatabase() {
  const currentPool = getPool()

  if (!currentPool) {
    return {
      connected: false,
      reason: 'DATABASE_URL ainda não foi configurada',
    }
  }

  try {
    const result = await currentPool.query('SELECT NOW() AS now')
    return {
      connected: true,
      now: result.rows[0].now,
    }
  } catch (error) {
    return {
      connected: false,
      reason: error.message,
    }
  }
}
