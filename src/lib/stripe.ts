import Stripe from "stripe";
import { env } from "@/lib/env";

if (!env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY no está configurada. Configura tu cuenta de Stripe.");
}

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-01-28.clover",
});
