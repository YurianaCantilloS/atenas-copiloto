import { z } from "zod";

export const generateRequestSchema = z.object({
  idea: z.string().default(""),
  objetivo: z.enum(["venta", "ensenar", "entretener", "conectar", "viralidad"]).default("venta"),
  audiencia: z.enum(["consumidoras", "minoristas", "mayoristas", "ambas"]).default("ambas"),
  formato: z.enum(["tiktok", "reel", "carrusel", "historias"]).default("tiktok"),
  datosOpcionales: z.string().optional().default(""),
  nivelMarca: z.enum(["sutil", "equilibrado", "comercial"]).default("equilibrado"),
  duracion: z.enum(["corta", "media", "larga"]).default("media"),
  presencia: z.string().optional().default("combinacion"),
  imagenReferencia: z.string().optional(),
});

export const storyboardShotSchema = z.object({
  toma: z.string().default(""),
  tiempo: z.string().default(""),
  visual: z.string().default(""),
  accion: z.string().default(""),
  voz: z.string().default(""),
  textoPantalla: z.string().default(""),
  plano: z.string().default(""),
});

export const propuestaSchema = z.object({
  concepto: z.string().min(1),
  objetivo: z.string().min(1),
  audiencia: z.string().min(1),
  pilar: z.string().min(1),
  anguloCreativo: z.string().min(1),
  estructura: z.object({
    nombre: z.string(),
    razon: z.string(),
  }),
  hooks: z.array(z.string().min(1)).min(1).max(12),
  hookRecomendado: z.string().min(1),
  guion: z.string().min(1),
  storyboard: z.array(storyboardShotSchema).min(1),
  textosPantalla: z.array(z.string().min(1)).default([]),
  cta: z.string().min(1),
  caption: z.string().min(1),
  portadas: z.array(z.string().min(1)).default([]),
  audio: z.string().default(""),
  variacionA: z.string().default(""),
  variacionB: z.string().default(""),
  serie: z.union([z.string(), z.null()]).catch(null),
});

export const evaluacionSchema = z.object({
  fuerzaHook: z.number().min(0).max(100),
  retencion: z.number().min(0).max(100),
  originalidad: z.number().min(0).max(100),
  identificacion: z.number().min(0).max(100),
  marca: z.number().min(0).max(100),
  claridad: z.number().min(0).max(100),
  cta: z.number().min(0).max(100),
  comentarios: z.array(z.string()).default([]),
});

export function promedioEvaluacion(e: {
  fuerzaHook: number;
  retencion: number;
  originalidad: number;
  identificacion: number;
  marca: number;
  claridad: number;
  cta: number;
}): number {
  return Math.round(
    (e.fuerzaHook * 25 +
      e.retencion * 20 +
      e.originalidad * 15 +
      e.identificacion * 15 +
      e.marca * 10 +
      e.claridad * 10 +
      e.cta * 5) /
      100
  );
}