# Tattoo Studio (Next.js)

Proyecto web para estudio de tattoo/ilustración con Next.js (App Router) y Prisma.

## Desarrollo local

```bash
npm install
npm run dev
```

## Variables recomendadas

- `DATABASE_URL`: conexión PostgreSQL para Prisma.
- `SITE_URL`: URL pública usada para SEO/sitemap.
- `SESSION_COOKIE_NAME`: nombre cookie de sesión admin (opcional).
- `OBSERVABILITY_MODE`: activa logs debug estructurados (`true|1|on`).

## Modo observabilidad

Este proyecto incluye un modo de observabilidad enfocado en producción:

- Se asigna/propaga `x-request-id` en cada request desde `src/proxy.ts`.
- Los logs estructurados incluyen `scope`, `requestId` y payload JSON.
- Los errores de healthcheck y secciones críticas del home se loguean con contexto.
- `src/app/error.tsx` muestra `digest` en UI para correlación con logs.

Activar:

```bash
OBSERVABILITY_MODE=true npm run dev
```

En Vercel, añade `OBSERVABILITY_MODE=true` en Environment Variables para tener trazas debug adicionales.

## Build

```bash
npm run build
npm run start
```
