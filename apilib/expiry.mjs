// Cron job and core logic for expiring overdue active vaults.
import { timingSafeEqual } from 'node:crypto'
import { getStore } from './store.mjs'

/**
 * Constant-time comparison of two strings to prevent timing attacks.
 */
export function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

/**
 * Expire overdue active vaults in batches of up to batchSize.
 *
 * @param {Object} [options]
 * @param {Date|string|number} [options.now] Injected clock for testing (default: Date.now())
 * @param {number} [options.batchSize] Max vaults to process in this run (default: 100)
 * @param {Object} [options.store] Store instance (default: getStore())
 * @returns {Promise<{ processed: number, remaining: number }>}
 */
export async function expireOverdueVaults(options = {}) {
  const store = options.store || await getStore()
  const now = options.now ? new Date(options.now) : new Date()
  const batchSize = typeof options.batchSize === 'number' ? options.batchSize : 100

  return store.expireOverdueVaults({ now, batchSize })
}
