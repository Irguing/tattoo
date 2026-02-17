type Level = "debug" | "info" | "warn" | "error";

type LogParams = {
  level: Level;
  msg: string;
  scope?: string;
  data?: Record<string, unknown>;
};

export function log({ level, msg, scope, data }: LogParams) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    msg,
    scope,
    ...(data ? { data } : {}),
  };

  const method = level === "debug" ? "log" : level;
  console[method](JSON.stringify(payload));
}
