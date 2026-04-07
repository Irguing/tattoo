import Stripe from "stripe";
import { env } from "@/lib/env";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY no está configurada. Configura tu cuenta de Stripe.");
  }
  if (!_stripe) {
    _stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-01-28.clover",
    });
  }
  return _stripe;
}
