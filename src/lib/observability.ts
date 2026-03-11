import { headers } from "next/headers";

export const REQUEST_ID_HEADER = "x-request-id";

export function newRequestId(): string {
  return crypto.randomUUID();
}

export async function getRequestIdFromHeaders(): Promise<string | undefined> {
  const h = await headers();
  return h.get(REQUEST_ID_HEADER) ?? undefined;
}
