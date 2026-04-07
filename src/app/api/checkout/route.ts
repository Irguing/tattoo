import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { env } from "@/lib/env";

type LineItem = { productId: string; quantity: number };

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LineItem[];

    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });
    }

    // Validar y obtener precios REALES desde DB — nunca confiar en el cliente
    const productIds = body.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isPublished: true },
      select: { id: true, name: true, price: true, imageUrl: true, stock: true, slug: true },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "Uno o más productos no están disponibles" },
        { status: 400 }
      );
    }

    // Verificar stock
    for (const item of body) {
      const product = products.find((p) => p.id === item.productId)!;
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuficiente para "${product.name}"` },
          { status: 400 }
        );
      }
    }

    // Construir line_items con precios de DB
    const lineItems = body.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: product.name,
            ...(product.imageUrl ? { images: [product.imageUrl] } : {}),
            metadata: { productId: product.id, slug: product.slug },
          },
          unit_amount: product.price, // ya en centavos
        },
        quantity: item.quantity,
      };
    });

    const origin = env.SITE_URL;

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/merch/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/merch`,
      payment_method_types: ["card"],
      metadata: {
        items: JSON.stringify(body.map((i) => ({ productId: i.productId, quantity: i.quantity }))),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json({ error: "Error al crear la sesión de pago" }, { status: 500 });
  }
}
