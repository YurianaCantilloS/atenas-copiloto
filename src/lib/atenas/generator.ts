import OpenAI from "openai";
import { propuestaSchema } from "./schemas";
import { SYSTEM_PROMPT } from "./systemPrompt";
import { getModelo } from "./openai";
import type { GenerateRequest, Propuesta } from "./types";
import type { MemoriaContenidos } from "./memory";

function buildUserPrompt(request: GenerateRequest, memoria: MemoriaContenidos): string {
  return JSON.stringify(
    {
      solicitud: {
        idea: request.idea,
        sin_idea: !request.idea.trim(),
        objetivo: request.objetivo,
        audiencia: request.audiencia,
        formato: request.formato,
        datosOpcionales: request.datosOpcionales,
        nivelMarca: request.nivelMarca,
        duracion: request.duracion,
        presencia: request.presencia,
        imagen_referencia: request.imagenReferencia ? "adjunta (analízala: estilo, escenario, objetos, colores, texto visible, vibra)" : null,
      },
      memoria_para_evitar_repeticion: memoria,
    },
    null,
    2
  );
}

function userMessages(
  request: GenerateRequest,
  memoria: MemoriaContenidos
): OpenAI.Chat.ChatCompletionMessageParam[] {
  const texto: OpenAI.Chat.ChatCompletionMessageParam = {
    role: "user",
    content: buildUserPrompt(request, memoria),
  };
  const img = request.imagenReferencia;
  if (img && img.startsWith("data:image")) {
    return [
      {
        role: "user",
        content: [
          { type: "text", text: (texto.content as string) + "\n\nAnaliza la imagen de referencia y úsala para darle vida y detalles concretos a la propuesta (escenario, outfit, objetos, detalles de marca si se ven)." },
          { type: "image_url", image_url: { url: img } },
        ],
      },
    ];
  }
  return [texto];
}

export async function generarPropuesta(
  client: OpenAI,
  request: GenerateRequest,
  memoria: MemoriaContenidos
): Promise<Propuesta> {
  const res = await client.chat.completions.create({
    model: getModelo(),
    response_format: { type: "json_object" },
    temperature: 0.85,
    max_tokens: 3500,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...userMessages(request, memoria),
    ],
  });

  const raw = res.choices?.[0]?.message?.content;
  if (!raw) throw new Error("El modelo no devolvió contenido.");
  const parsed = JSON.parse(raw);
  return propuestaSchema.parse(parsed);
}

function buildRevisionPrompt(
  request: GenerateRequest,
  memoria: MemoriaContenidos,
  previa: Propuesta,
  evaluacion: { comentarios: string[]; promedio: number }
): string {
  return JSON.stringify(
    {
      instruccion:
        "Tu propuesta anterior fue evaluada y obtuvo una puntuación baja. Reescríbela corrigiendo las observaciones. Mantén la estructura JSON exacta y las mismas claves. No repitas hooks ni ángulos ya usados en la memoria.",
      solicitud: request,
      evaluacion_anterior: {
        promedio: evaluacion.promedio,
        comentarios: evaluacion.comentarios,
      },
      propuesta_anterior: previa,
      memoria_para_evitar_repeticion: memoria,
    },
    null,
    2
  );
}

export async function revisarPropuesta(
  client: OpenAI,
  request: GenerateRequest,
  memoria: MemoriaContenidos,
  previa: Propuesta,
  evaluacion: { comentarios: string[]; promedio: number }
): Promise<Propuesta> {
  const res = await client.chat.completions.create({
    model: getModelo(),
    response_format: { type: "json_object" },
    temperature: 0.9,
    max_tokens: 3500,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildRevisionPrompt(request, memoria, previa, evaluacion) },
    ],
  });

  const raw = res.choices?.[0]?.message?.content;
  if (!raw) throw new Error("El modelo no devolvió contenido en la revisión.");
  return propuestaSchema.parse(JSON.parse(raw));
}