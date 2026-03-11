export type Level = "debug" | "info" | "warn" | "error";

export type LogParams = {
  level: Level;
  msg: string;
  scope?: string;
  requestId?: string;
  data?: Record<string, unknown>;
};

function isObservabilityEnabled(): boolean {
  const raw = process.env.OBSERVABILITY_MODE?.trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "on";
}

function normalizeError(error: unknown) {
  if (!(error instanceof Error)) {
    return { message: String(error) };
  }

  return {
    name: error.name,
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
  };
}

export function log({ level, msg, scope, requestId, data }: LogParams) {
  if (level === "debug" && !isObservabilityEnabled()) return;

  const payload = {
    ts: new Date().toISOString(),
    level,
    msg,
    scope,
    requestId,
    ...(data ? { data } : {}),
  };

  const method = level === "debug" ? "log" : level;
  console[method](JSON.stringify(payload));
}

export function logError(params: {
  scope: string;
  msg: string;
  error: unknown;
  requestId?: string;
  data?: Record<string, unknown>;
}) {
  log({
    level: "error",
    scope: params.scope,
    msg: params.msg,
    requestId: params.requestId,
    data: {
      ...params.data,
      error: normalizeError(params.error),
    },
  });
}
