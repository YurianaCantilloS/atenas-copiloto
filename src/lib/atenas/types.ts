export type Audiencia = "consumidoras" | "minoristas" | "mayoristas" | "ambas";
export type NivelMarca = "sutil" | "equilibrado" | "comercial";
export type Duracion = "corta" | "media" | "larga";

export const OBJETIVOS = [
  "venta",
  "ensenar",
  "entretener",
  "conectar",
  "viralidad",
] as const;

export const FORMATOS = ["tiktok", "reel", "carrusel", "historias"] as const;

export const PRESENCIAS = [
  "hablando",
  "vozoff",
  "texto",
  "demostracion",
  "manos",
  "combinacion",
] as const;

export interface GenerateRequest {
  idea: string;
  objetivo: string;
  audiencia: Audiencia;
  formato: string;
  datosOpcionales?: string;
  nivelMarca: NivelMarca;
  duracion: Duracion;
  presencia: string;
  imagenReferencia?: string;
}

export interface StoryboardShot {
  toma: string;
  tiempo: string;
  visual: string;
  accion: string;
  voz: string;
  textoPantalla: string;
  plano: string;
}

export interface Propuesta {
  concepto: string;
  objetivo: string;
  audiencia: string;
  pilar: string;
  anguloCreativo: string;
  estructura: { nombre: string; razon: string };
  hooks: string[];
  hookRecomendado: string;
  guion: string;
  storyboard: StoryboardShot[];
  textosPantalla: string[];
  cta: string;
  caption: string;
  portadas: string[];
  audio: string;
  variacionA: string;
  variacionB: string;
  serie: string | null;
}

export interface Evaluacion {
  fuerzaHook: number;
  retencion: number;
  originalidad: number;
  identificacion: number;
  marca: number;
  claridad: number;
  cta: number;
  promedio: number;
  comentarios: string[];
}

export interface ResultadoGeneracion {
  propuesta: Propuesta;
  evaluacion: Evaluacion;
  revisada: boolean;
  demo: boolean;
  contenidoId?: string;
}