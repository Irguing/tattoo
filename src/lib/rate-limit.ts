type RateLimitResult = { ok: true } | { ok: false; retryAfterSec: number };

type Entry = {
  count: number;
  resetAtMs: number;
};

const store = new Map<string, Entry>();

export function rateLimitFixedWindow(params: {
  key: string;
  limit: number;
  windowSec: number;
}): RateLimitResult {
  const now = Date.now();
  const windowMs = params.windowSec * 1000;

  const existing = store.get(params.key);
  if (!existing || now >= existing.resetAtMs) {
    store.set(params.key, { count: 1, resetAtMs: now + windowMs });
    return { ok: true };
  }

  if (existing.count >= params.limit) {
    const retryAfterSec = Math.max(1, Math.ceil((existing.resetAtMs - now) / 1000));
    return { ok: false, retryAfterSec };
  }

  existing.count += 1;
  store.set(params.key, existing);
  return { ok: true };
}
