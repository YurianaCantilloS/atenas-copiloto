import OpenAI from "openai";

export function getClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({
    apiKey,
    maxRetries: 4,
    timeout: 120000,
  });
}

export function getModelo(): string {
  return process.env.OPENAI_MODEL || "gpt-4o-mini";
}

export function getModeloEvaluador(): string {
  return process.env.OPENAI_EVALUATOR_MODEL || "gpt-4o-mini";
}