export function getSiteUrl(): string {
  const raw = process.env.SITE_URL?.trim();

  if (!raw) {
    return "http://localhost:3000";
  }

  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

export function absUrl(path: string): string {
  const base = getSiteUrl();

  if (!path.startsWith("/")) {
    return `${base}/${path}`;
  }

  return `${base}${path}`;
}
