export class RateLimiter {
  private cache: Map<string, { count: number; timestamp: number }>;
  private limit: number;
  private windowMs: number;

  constructor(limit = 5, windowMs = 15 * 60 * 1000) {
    this.cache = new Map();
    this.limit = limit;
    this.windowMs = windowMs;
  }

  /**
   * Check if an IP has exceeded the rate limit.
   * Returns true if request is allowed, false if blocked.
   */
  public check(ip: string): boolean {
    const now = Date.now();
    const record = this.cache.get(ip);

    // Filter out expired records to save memory periodically
    if (this.cache.size > 1000) {
      for (const [key, value] of this.cache.entries()) {
        if (now - value.timestamp > this.windowMs) {
          this.cache.delete(key);
        }
      }
    }

    if (!record) {
      this.cache.set(ip, { count: 1, timestamp: now });
      return true;
    }

    if (now - record.timestamp > this.windowMs) {
      this.cache.set(ip, { count: 1, timestamp: now });
      return true;
    }

    if (record.count >= this.limit) {
      return false;
    }

    record.count++;
    return true;
  }
}

// Export a singleton instance strictly for login attempts
export const loginRateLimiter = new RateLimiter();
