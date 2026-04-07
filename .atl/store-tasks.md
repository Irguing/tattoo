# Tasks: Store (E-Commerce Merch)

Specs: `.atl/store-specs.md`

---

## Fase 1: Infraestructura y Seguridad

- [ ] 1.1 Crear `src/lib/env.ts` — validación Zod de todas las env vars (DATABASE_URL, DIRECT_URL, BLOB_READ_WRITE_TOKEN, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, SESSION_COOKIE_NAME, SITE_URL)
- [ ] 1.2 Crear `src/lib/stripe.ts` — singleton Stripe server-side importando de `@/lib/env`
- [ ] 1.3 Crear `src/lib/api-auth.ts` — helper `requireAdmin(request: Request)` que retorna `AdminUser | NextResponse<{error:string}>`
- [ ] 1.4 Agregar `requireAdmin()` a `src/app/api/admin/bookings/route.ts`
- [ ] 1.5 Agregar `requireAdmin()` a `src/app/api/admin/bookings/[id]/route.ts`
- [ ] 1.6 Agregar `requireAdmin()` a `src/app/api/admin/gallery/route.ts`
- [ ] 1.7 Agregar `requireAdmin()` a `src/app/api/admin/gallery/[id]/route.ts`
- [ ] 1.8 Agregar `requireAdmin()` a `src/app/api/admin/posts/route.ts`
- [ ] 1.9 Agregar `requireAdmin()` a `src/app/api/admin/posts/[id]/route.ts`
- [ ] 1.10 Agregar `requireAdmin()` a `src/app/api/gallery/upload/route.ts`

## Fase 2: Schema de Base de Datos

- [ ] 2.1 Agregar modelo `Product` a `prisma/schema.prisma` (id, slug @unique, name, description, price Int centavos, imageUrl, imageFilename, category String, stock Int default 0, isPublished Boolean default false, createdAt, updatedAt)
- [ ] 2.2 Agregar modelo `Order` a `prisma/schema.prisma` (id, stripeSessionId @unique, customerEmail, status String default "pending", totalCents Int, items OrderItem[], createdAt)
- [ ] 2.3 Agregar modelo `OrderItem` a `prisma/schema.prisma` (id, orderId, productId, quantity Int, priceCents Int — snapshot del precio al momento de compra)
- [ ] 2.4 Ejecutar `npx prisma migrate dev --name add_product_order` y confirmar que `prisma generate` compila sin errores

## Fase 3: API de Productos (CRUD admin)

- [ ] 3.1 Crear `src/app/api/merch/upload/route.ts` — POST con `requireAdmin()`, Vercel Blob put(), retorna `{ url, filename, mime, size }`
- [ ] 3.2 Crear `src/app/api/merch/route.ts` — GET público (solo isPublished:true), POST admin con `requireAdmin()` crea Product
- [ ] 3.3 Crear `src/app/api/merch/[id]/route.ts` — PATCH admin (editar campos), DELETE admin (soft o hard delete), ambos con `requireAdmin()`

## Fase 4: Panel Admin de Merch

- [ ] 4.1 Crear `src/app/admin/(protected)/merch/page.tsx` — Server Component con `force-dynamic`, query Prisma todos los productos, serializa Date a string (DTO), pasa a MerchAdmin
- [ ] 4.2 Crear `src/components/admin/MerchAdmin.client.tsx` — CRUD completo: lista productos, formulario crear/editar con upload imagen, toggle isPublished, delete con confirm
- [ ] 4.3 Modificar `src/components/admin/AdminShell.client.tsx` — agregar `{ href: "/admin/merch", label: "Merch", desc: "Productos y stock" }` al array NAV

## Fase 5: Catálogo Público

- [ ] 5.1 Crear `src/app/merch/components/ProductCard.tsx` — Server Component, muestra imagen, nombre, precio formateado (centavos → moneda), categoría
- [ ] 5.2 Reemplazar `src/app/merch/page.tsx` — Server Component con `force-dynamic`, grilla de productos publicados ordenados por createdAt desc, filtro por categoría via searchParams
- [ ] 5.3 Crear `src/app/merch/[slug]/page.tsx` — Server Component, detalle de producto, genera metadata SEO, 404 si no publicado
- [ ] 5.4 Crear `src/app/merch/components/AddToCartButton.client.tsx` — Client Component, invoca CartContext, feedback visual al agregar

## Fase 6: Carrito

- [ ] 6.1 Crear `src/context/CartContext.tsx` — React Context con `"use client"`, estado `CartItem[]`, acciones add/remove/clear, persistencia localStorage via useEffect
- [ ] 6.2 Crear `src/app/merch/components/CartDrawer.client.tsx` — drawer lateral con lista de items, cantidad, subtotal, botón "Ir al checkout" que llama `/api/checkout`
- [ ] 6.3 Crear `src/app/merch/components/CartIcon.client.tsx` — icono con badge de cantidad desde CartContext
- [ ] 6.4 Modificar `src/app/layout.tsx` — envolver `<LayoutShell>` con `<CartProvider>`
- [ ] 6.5 Modificar `src/components/SiteHeader.tsx` — agregar `<CartIcon>` en el nav

## Fase 7: Checkout y Webhooks

- [ ] 7.1 Crear `src/app/api/checkout/route.ts` — POST recibe `[{productId, quantity}]`, consulta precios reales en DB (nunca confía en el cliente), crea `stripe.checkout.sessions.create()`, retorna `{ url }`
- [ ] 7.2 Crear `src/app/api/webhooks/stripe/route.ts` — POST usa `req.text()` para verificar firma, maneja `checkout.session.completed`, crea Order + OrderItems en transacción Prisma, decrementa stock, idempotente via `stripeSessionId @unique`
- [ ] 7.3 Crear `src/app/merch/success/page.tsx` — página confirmación post-pago, lee `session_id` de searchParams
- [ ] 7.4 Agregar variables Stripe en Vercel: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] 7.5 Configurar webhook endpoint en Stripe Dashboard apuntando a `/api/webhooks/stripe`

## Fase 8: Verificación

- [ ] 8.1 Verificar `tsc --noEmit` compila sin errores
- [ ] 8.2 Verificar que `curl` sin cookie a `/api/admin/bookings` retorna 401
- [ ] 8.3 Verificar flujo completo con Stripe CLI en modo test: agregar producto → checkout → webhook → Order en DB
- [ ] 8.4 Verificar que carrito persiste tras refresh de página
- [ ] 8.5 Push a main → confirmar deploy en Vercel sin errores de build
