Tengo suficiente contexto del proyecto. Ahora puedo escribir las specs completas y detalladas.

---

# Especificaciones Técnicas — E-Commerce Tienda Merch

## MÓDULO 0: Infraestructura

---

## Spec 0.1 — `src/lib/env.ts`
**Archivo**: `src/lib/env.ts`

### Comportamiento esperado
Valida y exporta todas las variables de entorno requeridas usando Zod al inicio de la aplicación. Falla con un mensaje claro si alguna variable requerida está ausente o tiene formato incorrecto. Este módulo es importado por otros módulos de la capa de servidor (`stripe.ts`, `api-auth.ts`, route handlers).

### Escenarios

**Escenario 1: Variables requeridas presentes y válidas**
- Given: El proceso tiene todas las variables de entorno definidas con valores correctos (`DATABASE_URL`, `DIRECT_URL`, `BLOB_READ_WRITE_TOKEN`, `STRIPE_SECRET_KEY` empezando con `"sk_"`, `STRIPE_WEBHOOK_SECRET` empezando con `"whsec_"`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` empezando con `"pk_"`)
- When: Se importa `@/lib/env`
- Then: El módulo exporta un objeto `env` con todas las propiedades tipadas. No lanza ningún error.

**Escenario 2: Variable requerida ausente**
- Given: `STRIPE_SECRET_KEY` no está definida en `process.env`
- When: Se importa `@/lib/env`
- Then: Zod lanza un error con un mensaje descriptivo que indica qué campo falló. La aplicación no arranca.

**Escenario 3: Variable con formato incorrecto**
- Given: `STRIPE_SECRET_KEY` está definida pero su valor es `"rk_test_abc"` (no empieza con `"sk_"`)
- When: Se importa `@/lib/env`
- Then: Zod lanza un error indicando que `STRIPE_SECRET_KEY` debe empezar con `"sk_"`.

**Escenario 4: Variables opcionales ausentes usan defaults**
- Given: `SESSION_COOKIE_NAME` y `SITE_URL` no están definidas en `process.env`
- When: Se importa `@/lib/env` y se accede a `env.SESSION_COOKIE_NAME` y `env.SITE_URL`
- Then: `env.SESSION_COOKIE_NAME` retorna `"admin_session"` y `env.SITE_URL` retorna `"http://localhost:3000"`.

### Tipos / Interfaces relevantes

```typescript
// Tipo inferido por Zod, no se declara manualmente
export type Env = z.infer<typeof envSchema>;
export const env: Env;
```

### Restricciones
- MUST: Usar `z.object({...}).parse(process.env)` — lanza en arranque si inválido.
- MUST: `STRIPE_SECRET_KEY` validado con `z.string().startsWith("sk_")`.
- MUST: `STRIPE_WEBHOOK_SECRET` validado con `z.string().startsWith("whsec_")`.
- MUST: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` validado con `z.string().startsWith("pk_")`.
- MUST: `SESSION_COOKIE_NAME` con `.optional().default("admin_session")`.
- MUST: `SITE_URL` con `.optional().default("http://localhost:3000")`.
- MUST: El archivo es solo-servidor — NO importar en archivos con `"use client"`.
- SHOULD: El mensaje de error de Zod incluir `format()` o `flatten()` para legibilidad.

---

## Spec 0.2 — `src/lib/stripe.ts`
**Archivo**: `src/lib/stripe.ts`

### Comportamiento esperado
Exporta un singleton del cliente Stripe para uso exclusivo en el servidor. Importa `STRIPE_SECRET_KEY` desde `@/lib/env`. Nunca se instancia en el cliente.

### Escenarios

**Escenario 1: Primera importación crea el singleton**
- Given: El módulo es importado por primera vez en un contexto servidor
- When: Se accede al export `stripe`
- Then: Retorna una instancia de `Stripe` inicializada con `env.STRIPE_SECRET_KEY` y `apiVersion: "2025-04-30.basil"` (la versión del package `stripe@20.x`).

**Escenario 2: Importaciones subsecuentes retornan la misma instancia**
- Given: El módulo fue importado previamente
- When: Se importa `@/lib/stripe` nuevamente
- Then: Retorna la misma instancia (singleton por módulo ES).

### Tipos / Interfaces relevantes

```typescript
import Stripe from "stripe";
export const stripe: Stripe;
```

### Restricciones
- MUST: Importar `env` desde `@/lib/env`, nunca `process.env.STRIPE_SECRET_KEY` directamente.
- MUST: Este archivo NUNCA debe ser importado desde archivos con `"use client"` ni desde componentes client-side.
- MUST: Usar `apiVersion: "2025-04-30.basil"` (consultar el tipo `Stripe.LatestApiVersion` del paquete instalado si hay duda — usar la constante que acepte TypeScript sin error).
- SHOULD: Pasar `{ typescript: true }` en las opciones si el tipo lo requiere.

---

## Spec 0.3 — `src/lib/api-auth.ts`
**Archivo**: `src/lib/api-auth.ts`

### Comportamiento esperado
Exporta la función `requireAdmin(request: Request)` para ser usada al inicio de cada Route Handler admin. Si la sesión es válida, retorna los datos del admin. Si no, retorna un `NextResponse` con status 401 listo para ser devuelto por el handler. El llamador DEBE verificar el tipo de retorno y hacer early return si es `NextResponse`.

### Escenarios

**Escenario 1: Cookie de sesión válida y no expirada**
- Given: La request tiene una cookie con nombre `env.SESSION_COOKIE_NAME` cuyo valor es un ID de sesión existente en la tabla `Session` con `expiresAt > now()`
- When: Se llama `requireAdmin(request)`
- Then: Retorna `{ id: string; email: string; createdAt: Date }` (el objeto admin).

**Escenario 2: Sin cookie**
- Given: La request no tiene cookie de sesión
- When: Se llama `requireAdmin(request)`
- Then: Retorna `NextResponse.json({ error: "Unauthorized" }, { status: 401 })`.

**Escenario 3: Cookie con ID de sesión inexistente**
- Given: La request tiene cookie con valor que no corresponde a ninguna sesión en DB
- When: Se llama `requireAdmin(request)`
- Then: Retorna `NextResponse.json({ error: "Unauthorized" }, { status: 401 })`.

**Escenario 4: Sesión expirada**
- Given: La request tiene cookie válida, la sesión existe en DB pero `expiresAt < now()`
- When: Se llama `requireAdmin(request)`
- Then: Retorna `NextResponse.json({ error: "Unauthorized" }, { status: 401 })`.

**Escenario 5: Uso correcto en un Route Handler**
- Given: Un route handler admin importa `requireAdmin`
- When: El handler llama `const result = await requireAdmin(request)` y hace `if (result instanceof NextResponse) return result`
- Then: Si el usuario no está autenticado, el handler retorna 401 automáticamente. Si está autenticado, el código continúa con el objeto admin.

### Tipos / Interfaces relevantes

```typescript
import { NextResponse } from "next/server";

type AdminUser = {
  id: string;
  email: string;
  createdAt: Date;
};

export async function requireAdmin(
  request: Request
): Promise<AdminUser | NextResponse>;
```

### Restricciones
- MUST: Leer la cookie desde `request.headers.get("cookie")` parseando manualmente, O usar `import { cookies } from "next/headers"` — cualquiera es válido pero DEBE funcionar en el contexto de Route Handlers (no Server Components).
- MUST: Consultar `prisma.session` incluyendo `user` via `include` o `select` anidado.
- MUST: Verificar `session.expiresAt > new Date()`.
- MUST: Importar `prisma` desde `@/lib/prisma`.
- MUST: Importar `env` desde `@/lib/env` para el nombre de la cookie.
- SHOULD: Preferir el helper `getCookieFromRequest(request, name)` internamente para extraer el valor de cookie del header `Cookie`.
- MUST NOT: Borrar ni modificar la cookie en esta función.

---

## MÓDULO 1: Schema Prisma

---

## Spec 1.1 — `prisma/schema.prisma` (adición de modelos)
**Archivo**: `prisma/schema.prisma`

### Comportamiento esperado
Agregar los modelos `Product`, `Order` y `OrderItem` al schema existente. Los modelos existentes (`Post`, `GalleryImage`, `Booking`, `AdminUser`, `Session`) NO deben modificarse.

### Escenarios

**Escenario 1: Crear un producto**
- Given: El schema contiene el modelo `Product`
- When: Se ejecuta `prisma.product.create({ data: { name: "Remera", slug: "remera-negra", price: 2500, ... } })`
- Then: Se crea un registro con todos los campos requeridos. `price` almacenado como entero (centavos).

**Escenario 2: Slug único**
- Given: Ya existe un producto con `slug: "remera-negra"`
- When: Se intenta crear otro producto con `slug: "remera-negra"`
- Then: Prisma lanza un error de constraint único.

**Escenario 3: Crear una orden con items**
- Given: Existen productos en DB
- When: Se crea un `Order` con `items` via `create` con `include: { items: true }`
- Then: La orden se crea con los `OrderItem` relacionados. `Order.total` almacenado en centavos.

**Escenario 4: Cascade delete en OrderItems**
- Given: Existe una `Order` con `OrderItem`s relacionados
- When: Se elimina la `Order`
- Then: Los `OrderItem`s relacionados son eliminados automáticamente (cascade).

### Tipos / Interfaces relevantes

```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  price       Int      // centavos, ej: 2500 = $25.00
  imageUrl    String?
  category    String?
  stock       Int      @default(0)
  isPublished Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  orderItems  OrderItem[]

  @@index([isPublished, createdAt])
  @@index([category])
  @@index([slug])
}

model Order {
  id              String      @id @default(cuid())
  stripeSessionId String      @unique
  status          String      @default("pending")
  // valores: "pending" | "paid" | "cancelled"
  customerEmail   String?
  total           Int         // centavos
  items           OrderItem[]
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@index([stripeSessionId])
  @@index([status, createdAt])
  @@index([createdAt])
}

model OrderItem {
  id        String   @id @default(cuid())
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  quantity  Int
  unitPrice Int      // centavos, snapshot del precio al momento de compra
  createdAt DateTime @default(now())

  @@index([orderId])
  @@index([productId])
}
```

### Restricciones
- MUST: `price` y `unitPrice` y `total` son `Int` (centavos). NUNCA `Float` ni `Decimal`.
- MUST: `Product.slug` es `@unique`.
- MUST: `Order.stripeSessionId` es `@unique`.
- MUST: `OrderItem` tiene `onDelete: Cascade` en la relación con `Order`.
- MUST: Agregar `@@index` en campos consultados frecuentemente (`isPublished`, `slug`, `stripeSessionId`).
- MUST: `Order.status` es `String` con valores posibles documentados en comentario.
- SHOULD: Correr `npx prisma migrate dev --name add_merch_models` después de modificar el schema.
- MUST NOT: Modificar modelos existentes (`Post`, `GalleryImage`, `Booking`, `AdminUser`, `Session`).

---

## MÓDULO 2: Seguridad — Rutas admin existentes

---

## Spec 2.1 — Proteger rutas admin existentes con `requireAdmin()`
**Archivos a modificar**:
- `src/app/api/admin/bookings/route.ts`
- `src/app/api/admin/bookings/[id]/route.ts`
- `src/app/api/admin/gallery/route.ts`
- `src/app/api/admin/gallery/[id]/route.ts`
- `src/app/api/admin/posts/route.ts`
- `src/app/api/admin/posts/[id]/route.ts`
- `src/app/api/gallery/upload/route.ts`

### Comportamiento esperado
Cada uno de estos Route Handlers DEBE llamar `requireAdmin(request)` como primera operación y retornar 401 si el resultado es `NextResponse`. El resto de la lógica existente se mantiene sin cambios.

### Escenarios

**Escenario 1: Request sin autenticación a ruta protegida**
- Given: Un cliente no autenticado hace `GET /api/admin/bookings`
- When: El handler ejecuta `const authResult = await requireAdmin(request); if (authResult instanceof NextResponse) return authResult`
- Then: Retorna HTTP 401 con body `{ "error": "Unauthorized" }`. No consulta la DB.

**Escenario 2: Request autenticada pasa la guarda**
- Given: Un admin autenticado hace `GET /api/admin/bookings` con cookie de sesión válida
- When: El handler ejecuta `requireAdmin` y el resultado es el objeto admin
- Then: La ejecución continúa, consulta la DB y retorna los bookings normalmente.

**Escenario 3: PATCH /api/admin/bookings/[id] sin auth**
- Given: Request sin cookie a `PATCH /api/admin/bookings/[id]`
- When: Handler ejecuta requireAdmin
- Then: Retorna 401, no llama `prisma.booking.update`.

**Escenario 4: POST /api/gallery/upload sin auth**
- Given: Request sin cookie a `POST /api/gallery/upload`
- When: Handler ejecuta requireAdmin
- Then: Retorna 401, no llama `put()` de Vercel Blob.

### Patrón de implementación para CADA handler

```typescript
import { requireAdmin } from "@/lib/api-auth";

export async function GET(request: Request) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;
  // ... lógica existente sin cambios
}
```

Para handlers con `params` (como `[id]/route.ts`):

```typescript
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;
  // ... lógica existente
}
```

### Restricciones
- MUST: `requireAdmin(request)` DEBE ser la PRIMERA llamada en cada handler, antes de cualquier parsing de body o consulta DB.
- MUST: El check `instanceof NextResponse` DEBE hacer early return inmediato.
- MUST: La lógica de negocio existente NO debe ser modificada en ningún handler.
- MUST: Los handlers que actualmente usan `getCurrentAdmin()` para auth (como `admin/bookings/page.tsx`) son Server Components y NO son Route Handlers — NO modificarlos.
- MUST: `src/app/api/gallery/upload/route.ts` también DEBE ser protegido (es upload público actualmente).
- SHOULD: En `src/app/api/admin/gallery/route.ts` y `[id]/route.ts`, reemplazar los stubs actuales con implementación real (ver Spec 3 como referencia de patrón).

---

## MÓDULO 3: API de Productos

---

## Spec 3.1 — `src/app/api/merch/route.ts`
**Archivo**: `src/app/api/merch/route.ts`

### Comportamiento esperado
- `GET`: Público. Retorna todos los productos publicados (`isPublished: true`), ordenados por `createdAt desc`. Soporta query param `?category=string` para filtrar.
- `POST`: Solo admin. Crea un nuevo producto. Requiere `requireAdmin()`.

### Escenarios

**Escenario 1: GET retorna productos publicados**
- Given: Existen 5 productos en DB: 3 con `isPublished: true` y 2 con `isPublished: false`
- When: `GET /api/merch` (sin autenticación)
- Then: Retorna `{ products: [...] }` con los 3 productos publicados. HTTP 200. Los productos tienen todos los campos del modelo excepto relaciones.

**Escenario 2: GET con filtro de categoría**
- Given: Existen productos publicados con `category: "remeras"` y `category: "accesorios"`
- When: `GET /api/merch?category=remeras`
- Then: Retorna solo los productos publicados con `category: "remeras"`.

**Escenario 3: POST sin autenticación**
- Given: Request sin cookie de sesión
- When: `POST /api/merch` con body JSON válido
- Then: HTTP 401 `{ "error": "Unauthorized" }`.

**Escenario 4: POST autenticado con datos válidos**
- Given: Admin autenticado. Body: `{ name, slug, price, description?, imageUrl?, category?, stock?, isPublished? }`
- When: `POST /api/merch`
- Then: Crea el producto en DB. Retorna `{ product: { ...campos } }` con HTTP 201. `price` llega en centavos como `Int`.

**Escenario 5: POST con slug duplicado**
- Given: Ya existe un producto con `slug: "remera-negra"`
- When: `POST /api/merch` con `{ slug: "remera-negra", ... }`
- Then: HTTP 409 `{ "error": "Slug already exists" }`.

**Escenario 6: POST con datos inválidos (campos requeridos faltantes)**
- Given: Body sin `name` o sin `slug` o sin `price`
- When: `POST /api/merch`
- Then: HTTP 400 `{ "error": "Missing required fields" }`.

**Escenario 7: POST con price no entero o negativo**
- Given: Body con `price: 19.99` o `price: -100`
- When: `POST /api/merch`
- Then: HTTP 400 `{ "error": "Price must be a positive integer (cents)" }`.

### Tipos / Interfaces relevantes

```typescript
type CreateProductBody = {
  name: string;
  slug: string;
  price: number;         // centavos, Int
  description?: string;
  imageUrl?: string;
  category?: string;
  stock?: number;
  isPublished?: boolean;
};

type ProductDTO = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;         // centavos
  imageUrl: string | null;
  category: string | null;
  stock: number;
  isPublished: boolean;
  createdAt: string;     // ISO string
  updatedAt: string;     // ISO string
};
```

### Restricciones
- MUST: `GET` no requiere autenticación.
- MUST: `POST` DEBE llamar `requireAdmin(request)` primero.
- MUST: Validar que `price` sea un entero positivo: `Number.isInteger(price) && price > 0`.
- MUST: `slug` normalizado: lowercase, solo `a-z`, `0-9`, guiones. Usar función utilitaria similar a `normalizeSlug` de `@/lib/validation/posts.ts`.
- MUST: Capturar error de Prisma de constraint único (código `P2002`) y retornar 409.
- MUST: `export const dynamic = "force-dynamic"` al inicio del archivo.
- SHOULD: Seleccionar campos explícitamente en `prisma.product.findMany` (no `select *` implícito, excluir `orderItems`).

---

## Spec 3.2 — `src/app/api/merch/[id]/route.ts`
**Archivo**: `src/app/api/merch/[id]/route.ts`

### Comportamiento esperado
- `PATCH`: Solo admin. Actualiza campos parciales de un producto por ID.
- `DELETE`: Solo admin. Elimina un producto por ID.

### Escenarios

**Escenario 1: PATCH sin autenticación**
- Given: Request sin cookie
- When: `PATCH /api/merch/clxxx`
- Then: HTTP 401.

**Escenario 2: PATCH producto existente con datos parciales**
- Given: Admin autenticado. Producto `clxxx` existe con `price: 2500`
- When: `PATCH /api/merch/clxxx` con body `{ "price": 3000, "isPublished": true }`
- Then: Actualiza solo los campos enviados. Retorna `{ product: { ...updatedFields } }` HTTP 200.

**Escenario 3: PATCH producto inexistente**
- Given: Admin autenticado. No existe producto con ID `clzzz`
- When: `PATCH /api/merch/clzzz`
- Then: HTTP 404 `{ "error": "Product not found" }`.

**Escenario 4: PATCH con price inválido**
- Given: Admin autenticado
- When: `PATCH /api/merch/clxxx` con body `{ "price": 19.99 }`
- Then: HTTP 400 `{ "error": "Price must be a positive integer (cents)" }`.

**Escenario 5: DELETE sin autenticación**
- Given: Request sin cookie
- When: `DELETE /api/merch/clxxx`
- Then: HTTP 401.

**Escenario 6: DELETE producto existente**
- Given: Admin autenticado. Producto `clxxx` existe.
- When: `DELETE /api/merch/clxxx`
- Then: Elimina el producto de DB. Retorna `{ ok: true }` HTTP 200.

**Escenario 7: DELETE producto inexistente**
- Given: Admin autenticado. No existe producto con ID `clzzz`
- When: `DELETE /api/merch/clzzz`
- Then: HTTP 404 `{ "error": "Product not found" }`.

### Tipos / Interfaces relevantes

```typescript
type UpdateProductBody = Partial<{
  name: string;
  slug: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
  category: string | null;
  stock: number;
  isPublished: boolean;
}>;
```

### Restricciones
- MUST: Ambos handlers llaman `requireAdmin(request)` como primera operación.
- MUST: Si `price` está en el body del PATCH, validar que sea entero positivo.
- MUST: Capturar error Prisma `P2025` (record not found) y retornar 404.
- MUST: `params` tipados como `{ params: Promise<{ id: string }> }` — await antes de usar (patrón del proyecto).
- SHOULD: En PATCH, filtrar campos `undefined` del body antes de pasarlos a Prisma `data`.

---

## Spec 3.3 — `src/app/api/merch/upload/route.ts`
**Archivo**: `src/app/api/merch/upload/route.ts`

### Comportamiento esperado
Route Handler para subir imágenes de productos a Vercel Blob. Solo admin. Sigue exactamente el mismo patrón que `src/app/api/gallery/upload/route.ts` pero protegido con `requireAdmin`.

### Escenarios

**Escenario 1: POST sin autenticación**
- Given: Request sin cookie
- When: `POST /api/merch/upload` con formData con archivo
- Then: HTTP 401. No llama Vercel Blob.

**Escenario 2: POST con archivo válido y admin autenticado**
- Given: Admin autenticado. FormData con campo `"file"` de tipo `File` (imagen)
- When: `POST /api/merch/upload`
- Then: Sube el archivo a Vercel Blob con `access: "public"`. Retorna `{ url: string, filename: string, mime: string, size: number }` HTTP 200. El `filename` es sanitizado con timestamp (función `safeName` idéntica a gallery upload).

**Escenario 3: POST sin campo file**
- Given: Admin autenticado. FormData vacía o sin campo `"file"`
- When: `POST /api/merch/upload`
- Then: HTTP 400 `{ "error": "Missing file" }`.

**Escenario 4: Error en Vercel Blob**
- Given: Admin autenticado. Archivo válido pero `put()` lanza error
- When: `POST /api/merch/upload`
- Then: HTTP 500 `{ "error": "Upload failed" }`.

### Tipos / Interfaces relevantes

```typescript
type UploadResponse = {
  url: string;
  filename: string;
  mime: string;
  size: number;
};
```

### Restricciones
- MUST: `export const runtime = "nodejs"` al inicio del archivo.
- MUST: `requireAdmin(request)` como primera operación.
- MUST: Función `safeName` idéntica a la de `gallery/upload/route.ts`: sanitiza el nombre, agrega timestamp en base36, lowercase.
- MUST: Usar `put(filename, file, { access: "public" })` de `@vercel/blob`.
- MUST: Verificar `file instanceof File` antes de subir.
- SHOULD: Guardar imágenes en subfolder `merch/` del blob: `put(\`merch/${filename}\`, ...)`.

---

## MÓDULO 4: Panel Admin de Merch

---

## Spec 4.1 — `src/app/admin/(protected)/merch/page.tsx`
**Archivo**: `src/app/admin/(protected)/merch/page.tsx`

### Comportamiento esperado
Server Component que consulta todos los productos (publicados y no publicados) y pasa los datos al componente cliente `MerchAdmin`. Sigue el patrón de `gallery/page.tsx`.

### Escenarios

**Escenario 1: Carga inicial de la página admin de merch**
- Given: Admin autenticado (protegido por el layout `(protected)/layout.tsx`)
- When: Navega a `/admin/merch`
- Then: El Server Component consulta `prisma.product.findMany({ orderBy: { createdAt: "desc" } })` y renderiza `<MerchAdmin initialProducts={dto} />`.

**Escenario 2: Serialización de fechas para Client Component**
- Given: Los productos tienen campos `createdAt: Date` y `updatedAt: Date`
- When: El Server Component mapea los productos a DTO
- Then: `createdAt` y `updatedAt` son convertidos a `.toISOString()` antes de pasar al Client Component (los Client Components no aceptan `Date` de Server Components).

### Tipos / Interfaces relevantes

```typescript
export type ProductAdminDTO = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;         // centavos
  imageUrl: string | null;
  category: string | null;
  stock: number;
  isPublished: boolean;
  createdAt: string;     // ISO string
  updatedAt: string;     // ISO string
};
```

### Restricciones
- MUST: `export const dynamic = "force-dynamic"` en la parte superior del archivo.
- MUST: Importar `prisma` desde `@/lib/prisma`.
- MUST: NO tiene `"use client"` — es Server Component.
- MUST: El layout `(protected)/layout.tsx` existente ya maneja la protección de sesión — NO duplicar auth check aquí.
- SHOULD: El `select` de Prisma excluir `orderItems` (relación no necesaria en el panel).

---

## Spec 4.2 — `src/components/admin/MerchAdmin.client.tsx`
**Archivo**: `src/components/admin/MerchAdmin.client.tsx`

### Comportamiento esperado
Client Component que renderiza el panel de administración de productos. Permite crear, editar (precio/stock/publicado) y eliminar productos. Sigue el patrón de `GalleryAdmin.client.tsx`.

### Escenarios

**Escenario 1: Renderización inicial con productos existentes**
- Given: `initialProducts` contiene N productos
- When: El componente monta
- Then: Renderiza una tabla o grilla con todos los productos mostrando: nombre, slug, precio formateado (dividir centavos por 100 con 2 decimales, prefijo "$"), categoría, stock, estado (published/draft), imagen thumbnail si `imageUrl` existe.

**Escenario 2: Crear nuevo producto — flujo completo**
- Given: Admin está en el panel con el formulario de creación visible
- When: Completa los campos (nombre requerido, slug requerido, precio en pesos/UI → convertir a centavos antes de enviar, imagen opcional via upload previo, categoría opcional, stock, isPublished) y hace submit
- Then: 
  1. Si hay archivo de imagen seleccionado: `POST /api/merch/upload` con FormData primero. Obtiene `{ url }`.
  2. `POST /api/merch` con `{ name, slug, price: Math.round(priceUI * 100), imageUrl: url ?? null, ... }`.
  3. Si status 201: agrega el producto al estado local. Limpia el formulario.
  4. Si error: muestra `alert(errorMessage)`.

**Escenario 3: Formulario — slug se auto-genera desde el nombre**
- Given: Admin escribe en el campo `name`
- When: El campo `name` cambia y el campo `slug` no ha sido editado manualmente
- Then: El campo `slug` se autocompleta con `normalizeSlug(name)` en tiempo real (mismo algoritmo: lowercase, a-z/0-9/guiones, sin espacios).

**Escenario 4: Precio en UI vs precio en DB**
- Given: Admin ingresa `"25.00"` en el campo precio (pesos/euros, UI humano-legible)
- When: Se hace submit
- Then: El body enviado a la API tiene `price: 2500` (multiplicado por 100, `Math.round`).

**Escenario 5: Toggle publicado**
- Given: Existe un producto con `isPublished: false`
- When: Admin hace click en botón "Publicar" (o toggle) del producto
- Then: `PATCH /api/merch/{id}` con `{ isPublished: true }`. Actualiza el estado local optimísticamente o post-fetch.

**Escenario 6: Eliminar producto**
- Given: Existe un producto en la lista
- When: Admin hace click en "Delete" y confirma el `confirm()` dialog
- Then: `DELETE /api/merch/{id}`. Si ok: remueve el producto del estado local. Si error: restaura y muestra alert.

**Escenario 7: Filtrar productos**
- Given: Hay productos con distintas categorías y estados
- When: Admin escribe en campo de búsqueda
- Then: Filtra los productos localmente por `name`, `slug`, `category` (case insensitive, sin llamada API).

**Escenario 8: Precio en display**
- Given: Producto tiene `price: 2500` en DB/estado
- When: Se renderiza en la tabla
- Then: Muestra `"$25.00"` (dividir por 100, toFixed(2), prefijo "$").

### Tipos / Interfaces relevantes

```typescript
// Re-usar ProductAdminDTO de la page
type ProductAdminDTO = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  category: string | null;
  stock: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

// Estado del formulario de creación
type ProductFormState = {
  name: string;
  slug: string;
  priceDisplay: string;  // lo que el usuario escribe, ej "25.00"
  description: string;
  category: string;
  stock: string;         // string para input, parsear a Int al submit
  isPublished: boolean;
  imageFile: File | null;
  imageUrl: string;      // URL resultante del upload previo
};
```

### Restricciones
- MUST: Primera línea del archivo: `"use client"`.
- MUST: El archivo se llama `MerchAdmin.client.tsx` (sufijo `.client.tsx`).
- MUST: Precio de UI (`priceDisplay`) es un string en el form. Al submit: `price = Math.round(parseFloat(priceDisplay) * 100)`. Validar que sea `> 0` y `Number.isFinite`.
- MUST: Slug auto-generado con la misma lógica que `normalizeSlug` de `@/lib/validation/posts.ts`. Se puede duplicar la función localmente o importar desde `@/lib/validation/posts.ts`.
- MUST: `confirm()` antes de DELETE (igual que en `GalleryAdmin.client.tsx`).
- MUST NOT: Enviar decimales a la API. Siempre `Math.round(x * 100)`.
- SHOULD: Mostrar estado de carga (`busyUpload`, `busyDeleteId`) igual que el patrón en `GalleryAdmin.client.tsx`.
- SHOULD: El campo de precio en el formulario tiene `type="number"` con `step="0.01"` y `min="0"`.

---

## Spec 4.3 — Modificar `src/components/admin/AdminShell.client.tsx`
**Archivo**: `src/components/admin/AdminShell.client.tsx`

### Comportamiento esperado
Agregar la entrada "Merch" al array `NAV` y actualizar el título dinámico en el header interno.

### Escenarios

**Escenario 1: "Merch" aparece en el sidebar**
- Given: Admin navega al panel
- When: Renderiza `AdminShell`
- Then: El sidebar muestra "Merch" como ítem de navegación con `href: "/admin/merch"` y `desc: "Productos y stock"`.

**Escenario 2: "Merch" se marca activo en la ruta correcta**
- Given: El pathname es `/admin/merch` o `/admin/merch/algo`
- When: `isActive(pathname, "/admin/merch")` evalúa
- Then: Retorna `true` y el ítem se renderiza con clase activa (`bg-gray-900 text-white`).

**Escenario 3: Título dinámico en header interno**
- Given: Admin está en `/admin/merch`
- When: El header interno evalúa `pathname.startsWith("/admin/merch")`
- Then: Muestra el texto `"Merch"` en el header.

### Tipos / Interfaces relevantes

El array NAV debe quedar:
```typescript
const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", desc: "Resumen rápido" },
  { href: "/admin/bookings", label: "Bookings", desc: "Reservas y estados" },
  { href: "/admin/posts", label: "Posts", desc: "Blog editorial" },
  { href: "/admin/gallery", label: "Gallery", desc: "Imágenes y metadata" },
  { href: "/admin/merch", label: "Merch", desc: "Productos y stock" },  // NUEVO
];
```

Los quick links del header deben agregar "Merch":
```typescript
<Link href="/admin/merch" className="rounded-xl border px-3 py-2 text-xs font-medium hover:bg-gray-50">
  Merch
</Link>
```

El título dinámico del header debe agregar el caso:
```typescript
: pathname.startsWith("/admin/merch")
? "Merch"
```

### Restricciones
- MUST: Mantener `"use client"` en la primera línea.
- MUST: No romper ningún ítem de navegación existente.
- MUST: El nuevo ítem sigue el mismo patrón visual que los existentes.

---

## MÓDULO 5: Catálogo Público

---

## Spec 5.1 — `src/app/merch/page.tsx`
**Archivo**: `src/app/merch/page.tsx`

### Comportamiento esperado
Server Component (página pública). Lista todos los productos publicados. Soporta filtro por categoría via search params.

### Escenarios

**Escenario 1: Catálogo con productos publicados**
- Given: Existen 3 productos con `isPublished: true`
- When: Usuario navega a `/merch`
- Then: Renderiza los 3 productos usando `<ProductCard>`. Cada card muestra nombre, precio formateado, imagen (o placeholder), categoría.

**Escenario 2: Filtro por categoría**
- Given: Productos con `category: "remeras"` y `category: "accesorios"`
- When: Usuario navega a `/merch?category=remeras`
- Then: Renderiza solo los productos publicados con `category: "remeras"`. El filtro de categoría activo está visualmente seleccionado.

**Escenario 3: Sin productos publicados**
- Given: No hay productos con `isPublished: true`
- When: Usuario navega a `/merch`
- Then: Renderiza un mensaje vacío, por ejemplo: `"No hay productos disponibles todavía."`.

**Escenario 4: Lista de categorías para filtro**
- Given: Existen productos publicados con distintas categorías
- When: Se renderiza la página
- Then: Muestra una lista de botones/links de categorías únicas para filtrar (`ALL`, `remeras`, `accesorios`, etc.) derivada de los datos de DB.

### Tipos / Interfaces relevantes

```typescript
// Props del Server Component
type SearchParams = { category?: string | string[] };
```

### Restricciones
- MUST: `export const dynamic = "force-dynamic"` en la parte superior.
- MUST: Consultar solo `isPublished: true` en la query Prisma.
- MUST: `searchParams` es `Promise<SearchParams>` en Next.js App Router — DEBE ser awaited antes de usar.
- MUST: Importar `prisma` desde `@/lib/prisma`.
- MUST NOT: Usar `"use client"` en este archivo.
- SHOULD: Metadata de la página: `export const metadata = { title: "Tienda | Miko Jester", description: "..." }`.

---

## Spec 5.2 — `src/app/merch/[slug]/page.tsx`
**Archivo**: `src/app/merch/[slug]/page.tsx`

### Comportamiento esperado
Server Component de detalle de producto. Muestra toda la información del producto y el botón "Agregar al carrito" (Client Component). Si el slug no existe o el producto no está publicado, retorna 404.

### Escenarios

**Escenario 1: Producto publicado existe**
- Given: Producto `slug: "remera-negra"` existe con `isPublished: true`
- When: Usuario navega a `/merch/remera-negra`
- Then: Renderiza imagen grande, nombre, precio formateado, descripción, categoría, stock disponible, y `<AddToCartButton product={productDTO} />`.

**Escenario 2: Slug no existe**
- Given: No existe producto con `slug: "producto-fantasma"`
- When: Usuario navega a `/merch/producto-fantasma`
- Then: Llama `notFound()` de `next/navigation`. Next.js renderiza la página 404.

**Escenario 3: Producto existe pero no está publicado**
- Given: Producto `slug: "borrador"` existe con `isPublished: false`
- When: Usuario navega a `/merch/borrador`
- Then: Llama `notFound()`. El producto no es accesible públicamente.

**Escenario 4: Stock agotado**
- Given: Producto existe con `isPublished: true` y `stock: 0`
- When: Usuario navega a la página
- Then: Muestra badge o texto "Sin stock". El `AddToCartButton` DEBE estar deshabilitado o no renderizarse.

**Escenario 5: generateStaticParams (opcional ISR)**
- Given: Productos publicados en DB
- When: Next.js hace build
- Then: `generateStaticParams` retorna `[{ slug: "remera-negra" }, ...]` para pre-generar páginas.

### Tipos / Interfaces relevantes

```typescript
type ProductDetailDTO = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;         // centavos
  imageUrl: string | null;
  category: string | null;
  stock: number;
  isPublished: boolean;
};
```

### Restricciones
- MUST: `export const dynamic = "force-dynamic"` o usar `generateStaticParams` + `revalidate`. Para simplificar, usar `force-dynamic`.
- MUST: Query con `where: { slug, isPublished: true }`. Si null → `notFound()`.
- MUST: `AddToCartButton` recibe el `productDTO` como prop — es el único Client Component en esta página.
- MUST: Mostrar precio con formato `"$25.00"` (centavos / 100, toFixed(2)).
- SHOULD: Metadata dinámica: `export async function generateMetadata({ params })` que retorna `title: product.name`.

---

## Spec 5.3 — `src/app/merch/components/ProductCard.tsx`
**Archivo**: `src/app/merch/components/ProductCard.tsx`

### Comportamiento esperado
Server Component (sin interactividad). Renderiza la tarjeta de un producto en el catálogo. Link a la página de detalle.

### Escenarios

**Escenario 1: Producto con imagen**
- Given: Producto tiene `imageUrl: "https://blob.vercel.com/merch/remera.jpg"` y `price: 2500`
- When: Se renderiza `<ProductCard product={p} />`
- Then: Muestra `<Image>` de Next.js con la URL, nombre del producto, precio `"$25.00"`, categoría si existe. Wrapeado en `<Link href="/merch/{slug}">`.

**Escenario 2: Producto sin imagen**
- Given: Producto tiene `imageUrl: null`
- When: Se renderiza `<ProductCard product={p} />`
- Then: Muestra un placeholder (div con color de fondo o ícono SVG). No rompe el layout.

**Escenario 3: Producto sin stock**
- Given: Producto tiene `stock: 0`
- When: Se renderiza `<ProductCard product={p} />`
- Then: Muestra badge "Sin stock" sobre la imagen o debajo del nombre.

### Tipos / Interfaces relevantes

```typescript
type ProductCardProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;      // centavos
    imageUrl: string | null;
    category: string | null;
    stock: number;
  };
};
```

### Restricciones
- MUST NOT: `"use client"` en este archivo.
- MUST: Usar `next/image` para imágenes. El dominio de Vercel Blob (`*.public.blob.vercel.storage`) DEBE estar configurado en `next.config.ts` bajo `images.remotePatterns` (nota para el implementador: agregar al config).
- MUST: Precio formateado como `"$" + (price / 100).toFixed(2)`.
- MUST: Link a `/merch/{product.slug}` usando `next/link`.

---

## Spec 5.4 — `src/app/merch/components/AddToCartButton.client.tsx`
**Archivo**: `src/app/merch/components/AddToCartButton.client.tsx`

### Comportamiento esperado
Client Component. Botón que agrega el producto al carrito via el `CartContext`. Se muestra deshabilitado si `stock === 0`.

### Escenarios

**Escenario 1: Click agrega al carrito**
- Given: Producto con `stock > 0`. CartContext disponible en el árbol.
- When: Usuario hace click en "Agregar al carrito"
- Then: Llama `cartContext.addItem({ id, name, price, imageUrl, slug, quantity: 1 })`. El botón muestra feedback visual breve (ej: texto "Agregado!" por 1 segundo).

**Escenario 2: Producto sin stock**
- Given: Producto con `stock: 0`
- When: El componente renderiza
- Then: El botón está `disabled` y muestra "Sin stock". No llama `addItem` si se clickea.

**Escenario 3: Producto ya en carrito — suma quantity**
- Given: El carrito ya tiene el producto `id: "abc"` con `quantity: 1`
- When: Usuario hace click nuevamente en "Agregar al carrito"
- Then: El Context incrementa la cantidad del item existente (no duplica). El `addItem` del Context maneja esta lógica internamente.

### Tipos / Interfaces relevantes

```typescript
type AddToCartButtonProps = {
  product: {
    id: string;
    name: string;
    price: number;       // centavos
    imageUrl: string | null;
    slug: string;
    stock: number;
  };
};
```

### Restricciones
- MUST: Primera línea: `"use client"`.
- MUST: Nombre del archivo con sufijo `.client.tsx`.
- MUST: Usar `useCart()` hook del `CartContext`.
- MUST: Deshabilitar botón cuando `product.stock === 0`.

---

## MÓDULO 6: Carrito

---

## Spec 6.1 — `src/context/CartContext.tsx`
**Archivo**: `src/context/CartContext.tsx`

### Comportamiento esperado
Contexto React que provee el estado del carrito y sus operaciones. El estado se persiste en `localStorage` bajo la key `"miko_cart"`. Se inicializa leyendo `localStorage` en el cliente.

### Escenarios

**Escenario 1: Persistencia en localStorage**
- Given: Usuario agrega items al carrito y recarga la página
- When: `CartProvider` monta
- Then: Lee `localStorage.getItem("miko_cart")`, parsea el JSON y restaura el estado. Si el item es inválido/corrupto, inicializa con array vacío.

**Escenario 2: addItem — producto nuevo**
- Given: El carrito está vacío
- When: `addItem({ id: "p1", name: "Remera", price: 2500, imageUrl: null, slug: "remera", quantity: 1 })`
- Then: El carrito tiene `[{ id: "p1", name: "Remera", price: 2500, imageUrl: null, slug: "remera", quantity: 1 }]`. Se actualiza `localStorage`.

**Escenario 3: addItem — producto existente incrementa quantity**
- Given: Carrito tiene `[{ id: "p1", quantity: 1 }]`
- When: `addItem({ id: "p1", ..., quantity: 1 })`
- Then: Carrito queda `[{ id: "p1", quantity: 2 }]`. No duplica el item.

**Escenario 4: removeItem**
- Given: Carrito tiene items incluyendo `id: "p1"`
- When: `removeItem("p1")`
- Then: El item es removido del array. Se actualiza `localStorage`.

**Escenario 5: updateQuantity**
- Given: Carrito tiene `[{ id: "p1", quantity: 2 }]`
- When: `updateQuantity("p1", 5)`
- Then: Carrito queda `[{ id: "p1", quantity: 5 }]`.

**Escenario 6: updateQuantity a 0 remueve el item**
- Given: Carrito tiene `[{ id: "p1", quantity: 2 }]`
- When: `updateQuantity("p1", 0)`
- Then: El item es removido del carrito.

**Escenario 7: clearCart**
- Given: Carrito tiene items
- When: `clearCart()`
- Then: El carrito queda `[]`. Se limpia `localStorage`.

**Escenario 8: totalItems — cuenta total de unidades**
- Given: Carrito con `[{ quantity: 2 }, { quantity: 3 }]`
- When: Se accede a `cart.totalItems`
- Then: Retorna `5`.

**Escenario 9: totalPrice — suma de precios en centavos**
- Given: Carrito con `[{ price: 2500, quantity: 2 }, { price: 1000, quantity: 1 }]`
- When: Se accede a `cart.totalPrice`
- Then: Retorna `6000` (en centavos).

**Escenario 10: SSR — sin acceso a localStorage en servidor**
- Given: El componente se renderiza en el servidor (SSR)
- When: El Context intenta leer `localStorage`
- Then: No lanza error. Inicializa con estado vacío. El `useEffect` se encarga de leer localStorage solo en el cliente.

### Tipos / Interfaces relevantes

```typescript
export type CartItem = {
  id: string;
  name: string;
  price: number;       // centavos
  imageUrl: string | null;
  slug: string;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
  totalItems: number;  // suma de quantities
  totalPrice: number;  // suma de price * quantity en centavos
};

export type CartContextValue = CartState & {
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

export function useCart(): CartContextValue;
export function CartProvider({ children }: { children: React.ReactNode }): JSX.Element;
```

### Restricciones
- MUST: Primera línea: `"use client"`.
- MUST: Usar `useEffect` para leer/escribir `localStorage`, nunca en el cuerpo del componente ni en `useState` initializer directamente (puede causar hidration mismatch). Patrón correcto: `useState([])` + `useEffect(() => { /* leer localStorage */ }, [])`.
- MUST: Escribir a `localStorage` en cada cambio de estado (otro `useEffect` que dependa de `items`).
- MUST: Key de localStorage: `"miko_cart"`.
- MUST: `useCart()` lanza error si se usa fuera de `CartProvider`: `if (!context) throw new Error("useCart must be used within CartProvider")`.
- MUST: `totalItems` y `totalPrice` son valores derivados calculados en el contexto, no almacenados.
- SHOULD: Envolver el parse de localStorage en try/catch para manejar JSON corrupto.

---

## Spec 6.2 — `src/app/merch/components/CartDrawer.client.tsx`
**Archivo**: `src/app/merch/components/CartDrawer.client.tsx`

### Comportamiento esperado
Client Component. Panel lateral (drawer) que muestra los items del carrito y permite modificar cantidades, eliminar items e iniciar el checkout. Se abre/cierra por estado externo o propio.

### Escenarios

**Escenario 1: Drawer cerrado por defecto**
- Given: El componente monta
- When: Estado inicial
- Then: El drawer está oculto (`hidden` o `translate-x-full`). No visible en la UI.

**Escenario 2: Abrir drawer**
- Given: Drawer está cerrado
- When: `isOpen` prop cambia a `true` o el estado interno `open` se activa
- Then: El drawer se muestra (transición CSS). Muestra los items del carrito.

**Escenario 3: Carrito vacío**
- Given: `cart.items` es `[]`
- When: Drawer está abierto
- Then: Muestra mensaje "Tu carrito está vacío." Sin botón de checkout.

**Escenario 4: Lista de items**
- Given: Carrito tiene 2 items
- When: Drawer está abierto
- Then: Renderiza cada item con: imagen thumbnail (o placeholder), nombre, precio unitario formateado, controls de cantidad (`-` / `+` o input number), precio subtotal (price * quantity / 100), botón eliminar.

**Escenario 5: Cambiar cantidad**
- Given: Item con `quantity: 2` en el drawer
- When: Usuario hace click en `+`
- Then: Llama `updateQuantity(id, 3)`. El total se recalcula.

**Escenario 6: Reducir cantidad a 0 — elimina item**
- Given: Item con `quantity: 1` en el drawer
- When: Usuario hace click en `-`
- Then: Llama `removeItem(id)` (o `updateQuantity(id, 0)`, el Context maneja el remove). El item desaparece.

**Escenario 7: Botón Checkout — inicia sesión de Stripe**
- Given: Carrito tiene items. Botón "Checkout" visible.
- When: Usuario hace click en "Checkout"
- Then:
  1. El botón muestra estado de carga ("Procesando...").
  2. Hace `POST /api/checkout` con body `{ items: cart.items.map(i => ({ productId: i.id, quantity: i.quantity })) }`.
  3. Si respuesta `{ url: string }`: hace `window.location.href = url` (redirect a Stripe Hosted).
  4. Si error: muestra `alert("Error al iniciar checkout")`. Restaura botón.

**Escenario 8: Total del carrito**
- Given: Carrito con items
- When: Drawer está abierto
- Then: Muestra `cart.totalPrice / 100` formateado como `"$XX.XX"` como total.

### Tipos / Interfaces relevantes

```typescript
type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};
```

### Restricciones
- MUST: Primera línea: `"use client"`.
- MUST: Usar `useCart()` del CartContext.
- MUST: El body enviado a `/api/checkout` es `{ items: Array<{ productId: string; quantity: number }> }`. NUNCA enviar precios desde el cliente.
- MUST: Overlay de fondo (semitransparente) que al clickearse llame `onClose()`.
- SHOULD: Transición CSS `transition-transform duration-300` para abrir/cerrar suavemente.
- SHOULD: Accesibilidad: `aria-label="Carrito de compras"`, `role="dialog"`, `aria-modal="true"`.

---

## Spec 6.3 — `src/app/merch/components/CartIcon.client.tsx`
**Archivo**: `src/app/merch/components/CartIcon.client.tsx`

### Comportamiento esperado
Client Component pequeño. Icono de carrito en el header que muestra el número total de items y abre el `CartDrawer` al hacer click.

### Escenarios

**Escenario 1: Carrito vacío — sin badge**
- Given: `cart.totalItems === 0`
- When: Se renderiza `CartIcon`
- Then: Muestra icono de carrito sin badge de número (o badge con "0" oculto).

**Escenario 2: Carrito con items — muestra badge**
- Given: `cart.totalItems === 3`
- When: Se renderiza `CartIcon`
- Then: Muestra icono de carrito con badge circular rojo/neon con el número `3`.

**Escenario 3: Click abre el drawer**
- Given: CartDrawer está cerrado
- When: Usuario hace click en el `CartIcon`
- Then: El estado `isOpen` del drawer pasa a `true`. Se renderiza `<CartDrawer isOpen={true} onClose={...} />`.

### Tipos / Interfaces relevantes

```typescript
// CartIcon no recibe props — maneja su propio estado de drawer
export default function CartIcon(): JSX.Element;
```

### Restricciones
- MUST: Primera línea: `"use client"`.
- MUST: Gestiona el estado `isOpen` del drawer internamente con `useState`.
- MUST: Renderiza `<CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />` condicionalmente.
- MUST: Usar `useCart()` para obtener `totalItems`.
- SHOULD: Ícono SVG de carrito (o emoji carrito como fallback). No depender de librería de iconos externa a menos que ya esté en el proyecto.

---

## Spec 6.4 — Modificar `src/app/layout.tsx`
**Archivo**: `src/app/layout.tsx`

### Comportamiento esperado
Envolver el contenido con `<CartProvider>` para que el contexto del carrito esté disponible en toda la aplicación.

### Escenarios

**Escenario 1: CartProvider en el árbol**
- Given: El layout raíz renderiza
- When: Cualquier componente en el árbol usa `useCart()`
- Then: Tiene acceso al contexto sin error.

### Patrón de implementación

```typescript
import { CartProvider } from "@/context/CartContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fontDisplay.variable} ${fontBody.variable}`}>
      <body className="min-h-screen bg-sand text-ink antialiased">
        <CartProvider>
          <LayoutShell>{children}</LayoutShell>
        </CartProvider>
      </body>
    </html>
  );
}
```

### Restricciones
- MUST: `CartProvider` DEBE envolver `LayoutShell`, no al revés.
- MUST: El layout sigue siendo un Server Component (no agregar `"use client"`). `CartProvider` tiene `"use client"` internamente, lo cual es válido en App Router.
- MUST: No romper la estructura existente del layout.

---

## Spec 6.5 — Modificar `src/components/SiteHeader.tsx`
**Archivo**: `src/components/SiteHeader.tsx`

### Comportamiento esperado
Agregar `<CartIcon />` en el área de navegación del header, a la derecha del menú.

### Escenarios

**Escenario 1: CartIcon visible en el header**
- Given: Usuario navega al sitio
- When: Se renderiza el header
- Then: El `CartIcon` aparece visible junto al menú de navegación en el lado derecho.

### Patrón de implementación

```typescript
import CartIcon from "@/app/merch/components/CartIcon.client";

// En el <nav>:
<nav className="hidden items-center gap-6 text-sm font-semibold md:flex">
  <Link className="hover:opacity-80" href="/designs">Tatuajes</Link>
  <Link className="hover:opacity-80" href="/merch">Tienda</Link>
  <Link className="hover:opacity-80" href="/blog">Blog</Link>
  <Link href="/book" className="rounded-full bg-neon px-5 py-2 font-semibold text-ink shadow-soft hover:opacity-90">
    Reservar
  </Link>
  <CartIcon />  {/* NUEVO */}
</nav>
```

### Restricciones
- MUST: `SiteHeader.tsx` es un Server Component — NO agregar `"use client"`. Importar `CartIcon` (que sí es client) es válido.
- MUST: `CartIcon` debe estar dentro del `<nav>` existente o adyacente a él, manteniendo el layout actual.
- MUST NOT: Romper el menú de navegación existente.

---

## MÓDULO 7: Checkout y Webhooks

---

## Spec 7.1 — `src/app/api/checkout/route.ts`
**Archivo**: `src/app/api/checkout/route.ts`

### Comportamiento esperado
Route Handler público (no requiere admin auth). Recibe `{ items: Array<{ productId, quantity }> }`, valida contra DB, crea una Stripe Checkout Session y retorna la URL de redirect.

### Escenarios

**Escenario 1: Checkout exitoso**
- Given: Body `{ items: [{ productId: "clxxx", quantity: 2 }] }`. Producto existe, `isPublished: true`, `stock >= 2`, `price: 2500`.
- When: `POST /api/checkout`
- Then:
  1. Consulta DB: `prisma.product.findUnique({ where: { id: "clxxx", isPublished: true } })`.
  2. Verifica `product.stock >= quantity`.
  3. Llama `stripe.checkout.sessions.create(...)` con `line_items` construidos desde DB (precio de DB, nunca del cliente).
  4. Retorna `{ url: session.url }` HTTP 200.

**Escenario 2: Body inválido — items vacío o faltante**
- Given: Body `{}` o `{ items: [] }`
- When: `POST /api/checkout`
- Then: HTTP 400 `{ "error": "Items are required" }`.

**Escenario 3: Producto no encontrado o no publicado**
- Given: Body con `productId` que no existe o tiene `isPublished: false`
- When: `POST /api/checkout`
- Then: HTTP 404 `{ "error": "Product not found: {productId}" }`.

**Escenario 4: Stock insuficiente**
- Given: Producto con `stock: 1`. Body con `quantity: 3`.
- When: `POST /api/checkout`
- Then: HTTP 409 `{ "error": "Insufficient stock for: {productName}" }`.

**Escenario 5: Construcción correcta de line_items**
- Given: Dos productos en el carrito
- When: Se construyen los `line_items` para Stripe
- Then: Cada item tiene:
  ```typescript
  {
    price_data: {
      currency: "usd",  // o "ars" según configuración
      product_data: { name: product.name, images: product.imageUrl ? [product.imageUrl] : [] },
      unit_amount: product.price  // centavos directamente desde DB
    },
    quantity: item.quantity
  }
  ```

**Escenario 6: Configuración del Checkout Session**
- Given: Items válidos
- When: Se crea la Checkout Session
- Then: La session tiene:
  - `mode: "payment"`
  - `success_url: \`${env.SITE_URL}/merch/success?session_id={CHECKOUT_SESSION_ID}\``
  - `cancel_url: \`${env.SITE_URL}/merch\``
  - `metadata: { productIds: JSON.stringify(items.map(i => i.productId)) }` (opcional para webhook)

**Escenario 7: Error de Stripe**
- Given: Stripe lanza un error (ej: API key inválida)
- When: `POST /api/checkout`
- Then: HTTP 500 `{ "error": "Checkout session creation failed" }`. El error se loguea en consola.

### Tipos / Interfaces relevantes

```typescript
type CheckoutItem = {
  productId: string;
  quantity: number;
};

type CheckoutRequestBody = {
  items: CheckoutItem[];
};
```

### Restricciones
- MUST: Importar `stripe` desde `@/lib/stripe`. NUNCA instanciar Stripe en este archivo.
- MUST: Importar `env` desde `@/lib/env` para `SITE_URL`.
- MUST: Precios tomados EXCLUSIVAMENTE de DB. NUNCA confiar en precios del cliente.
- MUST: Verificar stock antes de crear la session.
- MUST: Verificar `isPublished: true` al consultar el producto.
- MUST: `export const dynamic = "force-dynamic"`.
- MUST: `export const runtime = "nodejs"` (Stripe requiere Node.js runtime, no Edge).
- SHOULD: `currency` configurable. Usar `"usd"` como default si `env.CURRENCY` no existe. Documentar que el implementador puede agregar `CURRENCY` a `env.ts` si es necesario.
- MUST NOT: Crear la `Order` en DB aquí — eso lo hace el webhook cuando el pago se confirma.

---

## Spec 7.2 — `src/app/api/webhooks/stripe/route.ts`
**Archivo**: `src/app/api/webhooks/stripe/route.ts`

### Comportamiento esperado
Route Handler que recibe eventos de Stripe. Verifica la firma del webhook usando `req.text()`. Maneja el evento `checkout.session.completed` para crear la `Order` y sus `OrderItem`s en DB.

### Escenarios

**Escenario 1: Verificación de firma exitosa**
- Given: Stripe envía una request con header `stripe-signature` válido
- When: El handler verifica con `stripe.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET)`
- Then: El evento se procesa. Retorna HTTP 200 `{ received: true }`.

**Escenario 2: Firma inválida**
- Given: Request con `stripe-signature` incorrecto o ausente
- When: `constructEvent` lanza error
- Then: HTTP 400 `{ "error": "Webhook signature verification failed" }`. No procesa nada.

**Escenario 3: Evento `checkout.session.completed` — crea orden**
- Given: Stripe envía `checkout.session.completed` con `session.id` válido, `session.payment_status: "paid"`, `session.customer_email`, y `session.metadata` con los productIds
- When: El handler procesa el evento
- Then:
  1. Recupera el checkout session completo con line_items: `stripe.checkout.sessions.retrieve(session.id, { expand: ["line_items"] })`.
  2. Por cada line_item, asocia con el producto via `productId` de `session.metadata` (o via `price_data.product_data.name` como fallback).
  3. Crea `Order` con `stripeSessionId`, `status: "paid"`, `customerEmail`, `total`.
  4. Crea `OrderItem`s relacionados con `quantity` y `unitPrice` (snapshot del precio de DB al momento).
  5. El proceso es idempotente: si ya existe una `Order` con ese `stripeSessionId`, no duplica.

**Escenario 4: Idempotencia — sesión ya procesada**
- Given: Ya existe `Order` con `stripeSessionId: "cs_test_xxx"`
- When: Stripe re-envía el mismo evento
- Then: El handler detecta que ya existe la orden (upsert o check previo) y retorna HTTP 200 sin crear duplicados.

**Escenario 5: Evento desconocido (no es `checkout.session.completed`)**
- Given: Stripe envía evento tipo `payment_intent.created`
- When: El handler procesa
- Then: Retorna HTTP 200 `{ received: true }` sin hacer nada (ignorar eventos no manejados).

**Escenario 6: Error al crear la Order en DB**
- Given: Evento válido pero Prisma lanza error
- When: El handler intenta `prisma.order.create`
- Then: Loguea el error. Retorna HTTP 500 para que Stripe reintente.

### Tipos / Interfaces relevantes

```typescript
// No se definen tipos custom aquí — usar los tipos de Stripe directamente
import Stripe from "stripe";
// stripe.webhooks.constructEvent retorna Stripe.Event
// session es Stripe.Checkout.Session
```

### Restricciones
- MUST: `export const runtime = "nodejs"`.
- MUST: Leer el body con `const body = await req.text()` — NUNCA `req.json()`. Stripe necesita el body raw para verificar la firma.
- MUST: `const sig = req.headers.get("stripe-signature") ?? ""`.
- MUST: Usar try/catch alrededor de `constructEvent`. Si falla → 400.
- MUST: `export const dynamic = "force-dynamic"`.
- MUST: Importar `stripe` desde `@/lib/stripe` y `env` desde `@/lib/env`.
- MUST: `prisma.order.create` con `upsert` o check previo `findUnique({ where: { stripeSessionId } })` para idempotencia.
- MUST NOT: Usar `export const config = { api: { bodyParser: false } }` — eso es Pages Router. En App Router, `req.text()` ya funciona correctamente.
- SHOULD: Log de eventos procesados: `console.log("[Stripe Webhook]", event.type, session.id)`.
- MUST: Deshabilitar el bodyParser automático de Next.js NO es necesario en App Router — `req.text()` es suficiente.

### Nota sobre metadata y line_items
Para recuperar los `productId`s al momento del webhook, existen dos estrategias. La RECOMENDADA es almacenar en `metadata` del checkout session al crearlo (Spec 7.1):
```typescript
metadata: { 
  items: JSON.stringify(items.map(i => ({ productId: i.productId, quantity: i.quantity })))
}
```
El webhook parsea `JSON.parse(session.metadata.items)` para obtener los `productId`s y `quantities`.

---

## Spec 7.3 — `src/app/merch/success/page.tsx`
**Archivo**: `src/app/merch/success/page.tsx`

### Comportamiento esperado
Server Component. Página de confirmación post-compra. Recibe `?session_id=cs_xxx` en los search params, consulta Stripe para verificar el pago, y limpia el carrito del usuario.

### Escenarios

**Escenario 1: Pago exitoso — muestra confirmación**
- Given: URL `/merch/success?session_id=cs_test_xxx`. La session en Stripe tiene `payment_status: "paid"`.
- When: Se renderiza la página
- Then: Muestra mensaje de éxito con el email del cliente (`session.customer_email`), total pagado (`session.amount_total / 100` formateado), y lista de items comprados. Incluye un `<ClearCartOnMount />` Client Component que llama `clearCart()` del contexto.

**Escenario 2: Sin session_id en URL**
- Given: URL `/merch/success` sin query param
- When: Se renderiza la página
- Then: Redirect a `/merch` o muestra mensaje de error "Sesión de pago no encontrada".

**Escenario 3: session_id inválido o pago no completado**
- Given: `session_id` no corresponde a una session válida o `payment_status !== "paid"`
- When: Se consulta Stripe
- Then: Muestra mensaje de error "El pago no fue completado" con link a volver a la tienda.

**Escenario 4: Limpiar carrito post-compra**
- Given: Pago exitoso. Carrito tiene items.
- When: La página renderiza
- Then: Un pequeño Client Component (`ClearCartOnMount`) ejecuta `useEffect(() => { clearCart() }, [])` para limpiar el localStorage del carrito.

### Tipos / Interfaces relevantes

```typescript
// Client Component auxiliar para limpiar el carrito
// src/app/merch/success/ClearCartOnMount.client.tsx
"use client";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

export default function ClearCartOnMount() {
  const { clearCart } = useCart();
  useEffect(() => { clearCart(); }, []); // eslint-disable-line
  return null;
}
```

### Restricciones
- MUST: `export const dynamic = "force-dynamic"`.
- MUST: Importar `stripe` desde `@/lib/stripe`.
- MUST: Verificar `session.payment_status === "paid"` antes de mostrar confirmación.
- MUST: `searchParams` es `Promise<{ session_id?: string }>` — DEBE ser awaited.
- MUST: El Client Component `ClearCartOnMount` DEBE estar en un archivo separado con sufijo `.client.tsx` (o inline como el patrón lo permita — preferir archivo separado).
- MUST NOT: Mostrar información sensible de Stripe (API keys, etc.).
- SHOULD: Link a `/merch` para seguir comprando y link a `/` para volver al inicio.
- SHOULD: Mostrar el número de orden interno si existe (`Order.id` de DB), o el `session_id` de Stripe como referencia.

---

## Resumen de dependencias entre módulos

```
Módulo 0 (env, stripe, api-auth)
  └── requerido por Módulo 2 (seguridad rutas existentes)
  └── requerido por Módulo 3 (API merch)
  └── requerido por Módulo 7 (checkout, webhooks)

Módulo 1 (Schema Prisma)
  └── requerido por Módulo 3 (API merch)
  └── requerido por Módulo 4 (Admin panel)
  └── requerido por Módulo 5 (catálogo público)
  └── requerido por Módulo 7 (webhook crea Order)

Módulo 3 (API merch)
  └── requerido por Módulo 4 (MerchAdmin llama estas APIs)
  └── requerido por Módulo 5 (ProductCard, AddToCartButton)

Módulo 6 (CartContext)
  └── requerido por Módulo 5 (AddToCartButton usa useCart)
  └── requerido por CartDrawer, CartIcon
  └── requerido por Módulo 7 (success page limpia carrito)
```

**Orden de implementación recomendado**: 0.1 → 0.2 → 0.3 → 1.1 (migrate) → 2 → 3.1 → 3.2 → 3.3 → 4 → 5 → 6 → 7

---

### Critical Files for Implementation
- `/c/Users/Irguing/Documents/React/Tattoo/prisma/schema.prisma`
- `/c/Users/Irguing/Documents/React/Tattoo/src/lib/env.ts`
- `/c/Users/Irguing/Documents/React/Tattoo/src/lib/api-auth.ts`
- `/c/Users/Irguing/Documents/React/Tattoo/src/app/api/webhooks/stripe/route.ts`
- `/c/Users/Irguing/Documents/React/Tattoo/src/context/CartContext.tsx`