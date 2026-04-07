import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

export const runtime = "nodejs";

// IMPORTANTE: req.text() — no req.json() — para verificar firma Stripe
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[webhook] Firma inválida:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object;
  const stripeSessionId = session.id;
  const customerEmail = session.customer_details?.email ?? session.customer_email ?? "unknown";

  // Recuperar items desde metadata
  let items: Array<{ productId: string; quantity: number }> = [];
  try {
    items = JSON.parse(session.metadata?.items ?? "[]");
  } catch {
    console.error("[webhook] metadata.items inválido");
    return NextResponse.json({ error: "Invalid metadata" }, { status: 400 });
  }

  if (items.length === 0) {
    return NextResponse.json({ received: true });
  }

  // Obtener precios reales desde DB
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, price: true, stock: true },
  });

  const totalCents = items.reduce((sum, item) => {
    const p = products.find((pr) => pr.id === item.productId);
    return sum + (p?.price ?? 0) * item.quantity;
  }, 0);

  try {
    // Transacción: crear orden + items + decrementar stock
    // stripeSessionId es @unique — idempotente si el webhook llega dos veces
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          stripeSessionId,
          customerEmail,
          status: "paid",
          totalCents,
          items: {
            create: items.map((item) => {
              const product = products.find((p) => p.id === item.productId)!;
              return {
                productId: item.productId,
                quantity: item.quantity,
                priceCents: product.price,
              };
            }),
          },
        },
      });

      // Decrementar stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return order;
    });
  } catch (err: unknown) {
    // P2002 = unique constraint (stripeSessionId ya existe → webhook duplicado)
    const code = (err as { code?: string })?.code;
    if (code === "P2002") {
      console.log("[webhook] Evento duplicado ignorado:", stripeSessionId);
      return NextResponse.json({ received: true });
    }
    console.error("[webhook] Error al crear orden:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
