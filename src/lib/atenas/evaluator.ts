import OpenAI from "openai";
import { evaluacionSchema, promedioEvaluacion } from "./schemas";
import { EVALUATOR_PROMPT } from "./evaluatorPrompt";
import { getModeloEvaluador } from "./openai";
import type { Evaluacion, GenerateRequest, Propuesta } from "./types";

export async function evaluar(
  client: OpenAI,
  request: GenerateRequest,
  propuesta: Propuesta
): Promise<Evaluacion> {
  const res = await client.chat.completions.create({
    model: getModeloEvaluador(),
    response_format: { type: "json_object" },
    temperature: 0.2,
    max_tokens: 900,
    messages: [
      { role: "system", content: EVALUATOR_PROMPT },
      {
        role: "user",
        content: JSON.stringify({ solicitud: request, propuesta }, null, 2),
      },
    ],
  });

  const raw = res.choices?.[0]?.message?.content;
  if (!raw) throw new Error("El evaluador no devolvió contenido.");
  const parsed = evaluacionSchema.parse(JSON.parse(raw));

  const promedio = Math.max(
    0,
    Math.min(100, promedioEvaluacion(parsed))
  );

  return {
    fuerzaHook: parsed.fuerzaHook,
    retencion: parsed.retencion,
    originalidad: parsed.originalidad,
    identificacion: parsed.identificacion,
    marca: parsed.marca,
    claridad: parsed.claridad,
    cta: parsed.cta,
    promedio,
    comentarios: parsed.comentarios,
  };
}