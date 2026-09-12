# Atenas Copiloto — Documento de contexto completo

Guía para entender, usar y alimentar el copiloto de contenido de **Atenas Style Shop**
(moda y belleza para mujeres, venta al por mayor y al detal, envíos nacionales en Colombia).

---

## 1. Qué es

Una app web que crea **propuestas de contenido para redes sociales** (TikTok, Reel,
Carrusel, Historias) con inteligencia artificial. No es un generador genérico: decide un
ángulo creativo, un hook que detenga el dedo, un guion grabable con celular, storyboard,
captions y CTA, pensado en la audiencia y el objetivo de cada contenido.

Cada propuesta pasa por:

1. **Generación** (gpt-4o-mini) → propuesta completa en JSON.
2. **Evaluación** automática con estos pesos: hook 25%, retención 20%, originalidad 15%,
   identificación 15%, marca 10%, claridad 10%, CTA 5%.
3. **Revisión y re-generación** si el promedio sale bajo 65/100.
4. **Guardado** en la base de datos (historial → Métricas). También se puede descargar en **PDF**.

---

## 2. Cómo funciona por dentro

```
Tú (formulario)                      Nube (Vercel)                 OpenAI
─────────────────                    ──────────────────            ───────────
idea + objetivo + formato            /api/generate                  gpt-4o-mini
+ audiencia + imagen de ref.   ───▶  valida datos   ───────────────▶  propuesta
                                     + MEMORIA (historial)          + evaluación
                                     + systemPrompt (personalidad)
                                     guarda en PostgreSQL (Neon) ◀── JSON validado
```

Piezas principales del código:

| Archivo | Para qué sirve |
|---|---|
| `src/lib/atenas/systemPrompt.ts` | **La personalidad y el tono de la IA** (lo más importante para que suene humana y no robótica) |
| `src/lib/atenas/memory.ts` | Lee el historial para NO repetir y para usar lo que ya funcionó |
| `src/lib/atenas/generator.ts` | Arma el mensaje final y lee la respuesta de OpenAI |
| `src/lib/atenas/evaluator.ts` | Evalúa la propuesta (0–100) |
| `src/lib/atenas/schemas.ts` | Valida que la respuesta esté bien formada |
| `prisma/schema.prisma` | Modelo de datos (contenidos, métricas) |
| `src/app/api/generate/route.ts` | Endpoint de generación |
| `src/app/api/history/route.ts` | Historial + guardar "en uso", favoritos e interacciones |

---

## 3. Qué le puedes pedir (el formulario)

- **Idea**: cuanto más específica, mejor resultado (máx. 400 caracteres). Si no tienes,
  el botón **"No tengo idea, sorpréndeme"** y la IA propone una en tendencia.
- **Objetivo**: venta, enseñar, entretener, conectar, viralidad.
- **Formato**: tiktok, reel, carrusel, historias.
- **Audiencia**: consumidoras, minoristas, mayoristas o ambas.
- **Imagen de referencia**: sube la foto del producto/flyer (hasta 2,5 MB) y la IA la ve.
- Opciones extra: nivel de aparición de la marca (sutil/equilibrado/comercial), duración,
  preferencia de presencia (hablando, voz en off, texto en pantalla, demostración, manos…).

**Para mejores resultados**: escribe ideas con escena (qué pasa, dónde, quién), menciona
el producto real y si conoces el precio escribe `[ej. $XX.XXX]` (la IA usa ese dato sin
inventarlo). Adjunta una foto de referencia siempre que puedas.

---

## 4. Cómo se alimenta (aprende de ti) — LO MÁS IMPORTANTE

La IA **no se queda igual**: usa tu historial para no repetir y para apoyarse en lo que ya
funcionó. Haz esto después de publicar:

1. En **Historial**, abre el contenido.
2. Márcalo como **"En uso"** cuando lo publiques. Solo los contenidos "en uso" cuentan.
3. **Registra las interacciones reales**: vistas, likes, comentarios, guardados (los que
   tenga la publicación real). Con números reales, no estimaciones.
4. Si un hook te encantó, márcalo como **favorito**.

Con eso, la memoria (`memory.ts`) entrega al cerebro: `estructurasQueFuncionan` y
`mejoresHooks` — las arquitecturas y hooks que de verdad te están dando resultados. El
nuevo contenido **se apoya en eso y lo mejora** en lugar de repetirlo. Si hay poco
historial, escribe con libertad creativa.

> Regla de oro: **no generes por generar**. Cada idea que marques como "en uso" con
> interacciones reales enseña a la IA qué le funciona a TU audiencia.

El panel **Métricas** te muestra: contenidos totales, cuántos están "en uso", favoritos,
interacciones, los objetivos y formatos que mejor responden, el top 5 y las estructuras
más usadas.

---

## 5. El tono (cómo evitar que suene a robot)

Todo el tono vive en `src/lib/atenas/systemPrompt.ts`. La sección **"ESCRIBE ASÍ"**
incluye reglas duras aprobadas:

- Escribir como **voz-nota entre amigas** (frases cortas, colombiano hablado, pequeñas
  imperfecciones).
- **Trabajar con lo concreto**: escenas visibles, objetos, momentos, lugares.
- **Tocar una fibra**: la emoción o situación real que conecta (miedo de arrancar a
  revender, plata que no alcanza, ilusión de estrenar, orgullo del negocio propio…).
- **Uso del momento** (quincena, estreno, diciembre, 14 de febrero) sin inventar que un
  audio/trend está en tendencia.
- **Prohibido** el vocabulario de IA: "descubre el poder de", "eleva tu marca", "contenido
  de valor", "te invito a", "en este video te enseñaré", "¿sabías que…?" y similares.

Si más adelante quieres otro tono (más sobrio, más humor, más directo), se cambia
exactamente en ese archivo, sección "ESCRIBE ASÍ" / "PERSONA".

---

## 6. Reglas de venta (no mentir)

- No inventa precios, descuentos, urgencia ni resultados garantizados.
- Si falta un dato usa placeholders `[ej. $XX.XXX]`.
- Explica el beneficio antes del precio.
- Aprovecha combos y "varias unidades" cuando aplica (minoristas/mayoristas).

---

## 7. Costo

- Se usa el modelo **gpt-4o-mini** (generador y evaluador), el más barato.
- Cada propuesta cuesta aprox. **US$0,002–0,006** → $5 rinden ~1.000 propuestas.
- El "modo demo" (respuestas de ejemplo gratis) solo actúa si no hay `OPENAI_API_KEY`.
- Consumo real visible en https://platform.openai.com/usage

---

## 8. Despliegue y datos

- **App**: Vercel (dominio del proyecto).
- **Código**: GitHub (`YurianaCantilloS/atenas-copiloto`). Todo lo que se sube a
  GitHub se despliega solo en Vercel.
- **Base de datos**: PostgreSQL gratis en **Neon** (la misma para tu computadora y para la
  web → los mismos datos en ambos lados).
- **Variables de entorno necesarias** (Vercel): `DATABASE_URL` (link de Neon),
  `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_EVALUATOR_MODEL`.
- **Local**: edita `.env` con esos mismos valores (`.env` nunca se sube a GitHub).
- Los cambios al esquema de datos se aplican con `npx prisma db push`.

### Guía rápida de cambios frecuentes

| Quiero… | Dónde |
|---|---|
| Cambiar el tono / la personalidad | `src/lib/atenas/systemPrompt.ts` |
| Cambiar el número de hooks generados | `systemPrompt.ts` (sección HOOKS) |
| Cambiar el modelo IA | `.env` / Vercel: `OPENAI_MODEL` |
| Añadir un objetivo/audiencia/formato | `schemas.ts` + `HistoryPanel.tsx` |
| Cambiar el umbral de revisión | `service.ts` → `UMBRAL` (65) |
| Ver rendimiento | Panel Métricas (en la app) |

---

## 9. Solución de problemas

| Error | Causa más común | Solución |
|---|---|---|
| `DATABASE_URL resolved to an empty string` | La variable está con nombre pero sin valor en Vercel | Edit → pegar el link completo de Neon → Redeploy |
| `Connection error.` al generar | Caída momentánea entre Vercel y OpenAI (típico de serverless) | Ya tiene reintento automático; si persiste, revisar Logs → Runtime Logs |
| Historial vacío en web | Se usó otra base antes | Los datos quedan en la base de Neon compartida |
| Error al levantarlo local | Caché de Next/Prisma vieja | `rm -rf .next` y volver a `npm run dev` |
| No encuentra "index" | (sin reproducir: los archivos están intactos y el build pasa) | Copiar el texto exacto del error si reaparece |

---

## 10. Cómo involucrarme en cambios

Esto es código real: para modificar el tono, los formatos, el PDF o cualquier regla,
editar los archivos de la sección 2 y subir el cambio a GitHub (Vercel lo actualiza solo).
Puedes pedírmelo en lenguaje natural (ej.: "que los hooks sean más cortos", "que al final
siempre pregunte algo con stickers") y yo lo implemento.