# Copiloto de contenido — Atenas Style Shop

Generador estratégico de contenido para Atenas Style Shop: conceptos, hooks,
guiones, storyboards, captions y variaciones con voz humana y colombiana.
Sigue la especificación completa del modelo de IA (marcar, objetivos,
audiencias, motor de ideas, evaluador interno, memoria anti-repetición, etc.).

## Stack

- Next.js 16 (App Router, TypeScript, Tailwind)
- OpenAI (salida JSON estructurada) para generación y evaluación
- Prisma + SQLite (productos, historial/memoria)
- Modo demo sin API key

## Puesta en marcha

```bash
cd atenas-copiloto
npm install
npx prisma generate
npm run dev
```

Abre http://localhost:3000

1. Copia `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```
2. Sin `OPENAI_API_KEY` la app funciona en **modo demo**: la propuesta sale de un
   ejemplo de calidad para probar la interfaz.
3. Con `OPENAI_API_KEY` configurada, la app usa el modelo real:
   - `OPENAI_MODEL` → modelo de generación (por defecto `gpt-4o-mini`)
   - `OPENAI_EVALUATOR_MODEL` → modelo del evaluador interno (por defecto `gpt-4o-mini`)

## Base de datos

```bash
npx prisma migrate dev --name init   # crea las tablas (ya hecha)
node prisma/seed.mjs                 # carga 6 productos de ejemplo
```

La DB se guarda en `prisma/dev.db` (ignorada por git).

## Flujo de una generación

1. La usuaria escribe una idea + objetivo + audiencia + formato + producto.
2. Se consulta la **memoria** (historial) para evitar repetir hooks/ángulos/estructuras.
3. El modelo genera la propuesta estructurada (sección 21 de la especificación).
4. El **evaluador interno** puntúa (hook 25 %, retención 20 %, originalidad 15 %,
   identificación 15 %, marca 10 %, claridad 10 %, CTA 5 %).
5. Si el puntaje es bajo (< 65), se hace una revisión automática.
6. Todo queda guardado en el historial para alimentar la memoria.

## Estructura

```
src/lib/atenas/
  systemPrompt.ts      # conocimiento de marca + reglas creativas
  evaluatorPrompt.ts   # prompt del evaluador interno
  generator.ts         # llamada de generación (+ revisión)
  evaluator.ts         # puntuación
  service.ts           # orquestación
  memory.ts            # consulta de memoria anti-repetición
  schemas.ts           # validación con Zod
  mock.ts              # propuesta demo (sin API key)
src/app/api/
  generate/route.ts    # POST  → genera y guarda contenido
  history/route.ts     # GET/PATCH/DELETE → memoria e historial
  products/route.ts    # GET/POST/DELETE → catálogo
src/components/        # interfaz (formulario, resultados, historial, catálogo)
```# atenas-copiloto
