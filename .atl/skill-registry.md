# Skill Registry — Tattoo

Generado: 2026-04-06

## Skills de Usuario (`~/.claude/skills/`)

| Skill | Trigger |
|-------|---------|
| `nextjs-patterns` | Al escribir código en Next.js App Router, crear páginas, layouts, rutas API o Server Actions |
| `prisma-patterns` | Al escribir queries de Prisma, crear migraciones, manejar tipos de Prisma o hacer seeding |
| `vitest-nextjs` | Al escribir tests, crear archivos de test, mockear Next.js internals o testear componentes/actions |
| `vercel-deploy` | Al deployar en Vercel, corregir errores de build, configurar env vars o preparar la DB de producción |
| `stripe-integration` | Al implementar pagos con Stripe, crear flujos de checkout, manejar webhooks o configurar Stripe |
| `branch-pr` | Al crear un pull request, abrir un PR o preparar cambios para revisión |
| `issue-creation` | Al crear un issue en GitHub, reportar un bug o solicitar una feature |
| `judgment-day` | Cuando el usuario dice "judgment day", "review adversarial", "doble review", "juzgar" |
| `skill-creator` | Al crear una nueva skill, agregar instrucciones para agentes o documentar patrones para IA |

## Skills de SDD (`~/.claude/skills/`)

| Skill | Propósito |
|-------|-----------|
| `sdd-init` | Inicializar contexto SDD en un proyecto |
| `sdd-explore` | Investigar una idea; lee el codebase, compara enfoques |
| `sdd-propose` | Crear una propuesta de cambio con intención, alcance y enfoque |
| `sdd-spec` | Escribir especificaciones con requerimientos y escenarios |
| `sdd-design` | Crear documento de diseño técnico con decisiones de arquitectura |
| `sdd-tasks` | Descomponer un cambio en un checklist de tareas de implementación |
| `sdd-apply` | Implementar tareas del cambio |
| `sdd-verify` | Validar implementación contra specs |
| `sdd-archive` | Sincronizar specs delta con specs principales y archivar el cambio |

## Skills de Proyecto

Ninguna detectada.

## Reglas Compactas

### nextjs-patterns
- `"use client"` lo más abajo posible en el árbol — fetching en Server Components
- Agregar `export const dynamic = "force-dynamic"` a páginas que lean de la DB
- Server Actions para mutaciones desde la UI; Route Handlers para webhooks/APIs externas
- SIEMPRE llamar `revalidatePath` después de mutaciones
- Sufijo `.client.tsx` para archivos con `"use client"`

### prisma-patterns
- SIEMPRE importar desde `@/lib/prisma` — nunca instanciar PrismaClient directamente
- Manejar `string | null` con `??` o guards explícitos
- Preferir `select` sobre `include` para performance
- Usar `migrate dev` localmente, `migrate deploy` en producción

### vitest-nextjs
- Mockear `next/navigation`, `next/cache` y `@/lib/prisma` con `vi.mock()`
- Server Components no testeables directamente con jsdom
- Co-locar tests junto al archivo que testean (`.test.tsx`)
- Castear con `vi.mocked()` para tipos correctos en mocks

### vercel-deploy
- `export const dynamic = "force-dynamic"` en TODAS las páginas con acceso a DB
- `postinstall: prisma generate` debe estar en package.json
- Usar `migrate deploy` en producción, nunca `migrate dev`
- Verificar `tsc --noEmit` y `lint` localmente antes de hacer push

### branch-pr
- Seguir workflow issue-first: la branch referencia un issue existente
- Formato del título del PR: `type(scope): descripción corta`
- Incluir plan de tests en el body del PR

### stripe-integration
- Cliente de Stripe SOLO en servidor (`src/lib/stripe.ts`)
- Handler de webhook DEBE usar `req.text()` (no `req.json()`) para verificar la firma
- Usar idempotency keys para operaciones críticas
- Variables `STRIPE_SECRET_KEY` y `STRIPE_WEBHOOK_SECRET` solo en servidor
