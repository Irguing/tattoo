import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1),
  BLOB_READ_WRITE_TOKEN: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().startsWith("sk_", {
    message: "STRIPE_SECRET_KEY must start with 'sk_'",
  }),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_", {
    message: "STRIPE_WEBHOOK_SECRET must start with 'whsec_'",
  }),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith("pk_", {
    message: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must start with 'pk_'",
  }),
  SESSION_COOKIE_NAME: z.string().optional().default("admin_session"),
  SITE_URL: z.string().optional().default("http://localhost:3000"),
});

export type Env = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:\n",
    parsed.error.issues.map((i) => `  ${i.path.join(".")}: ${i.message}`).join("\n")
  );
  throw new Error("Invalid environment variables. Check server logs.");
}

export const env: Env = parsed.data;
