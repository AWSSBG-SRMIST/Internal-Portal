import { NextRequest } from 'next/server';

// In-memory fixed-window limiter. Good enough for a single-instance Node
// deployment; resets on cold start. If this app ever runs across multiple
// instances, swap the Map for a shared store (e.g. a DynamoDB counter table).
const buckets = new Map<string, { count: number; resetAt: number }>();

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    // Use the rightmost IP — added by our load balancer, not spoofable by the client.
    const ips = forwarded.split(',').map(s => s.trim()).filter(Boolean);
    return ips[ips.length - 1] || 'unknown';
  }
  return req.headers.get('x-real-ip') || 'unknown';
}

/** Returns true if the request is allowed, false if it should be rejected (rate limited). */
export function checkRateLimit(key: string, limit: number, windowSeconds: number): boolean {
  const now = Date.now();

  // Probabilistic prune (~1% of calls) to prevent unbounded Map growth on long-lived instances.
  if (Math.random() < 0.01) {
    for (const [k, v] of buckets) {
      if (v.resetAt <= now) buckets.delete(k);
    }
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count++;
  return true;
}
