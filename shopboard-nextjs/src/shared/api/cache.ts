/**
 * Keeps one promise per key so components can read it with React's `use()`.
 * The same promise must come back on every render, or `use()` would suspend forever.
 */
export function createPromiseCache<K, T>(load: (key: K) => Promise<T>) {
  const promises = new Map<K, Promise<T>>()

  return {
    get(key: K): Promise<T> {
      const cached = promises.get(key)
      if (cached) return cached
      const promise = load(key)
      promises.set(key, promise)
      return promise
    },
    /** Forgets a failed request so the next read starts a new one. */
    clear(key: K): void {
      promises.delete(key)
    },
  }
}
