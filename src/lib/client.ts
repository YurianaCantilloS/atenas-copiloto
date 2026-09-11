export type { GenerateRequest, Propuesta, ResultadoGeneracion, Evaluacion } from "./atenas/types";

export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  precio: number | null;
  promocion: string | null;
  descripcion: string | null;
  caracteristicas: string[] | null;
  colores: string[] | null;
  alPorMayor: boolean;
  disponible: boolean;
  createdAt: string;
  _count?: { contents: number };
}

export interface HistorialItem {
  id: string;
  request: string;
  objetivo: string;
  objetivoClave: string | null;
  audiencia: string;
  formato: string;
  productoNombre: string | null;
  concepto: string;
  pilar: string;
  anguloCreativo: string;
  estructura: string;
  hook: string;
  cta: string;
  caption: string;
  serie: string | null;
  publicado: boolean;
  fechaPublicacion: string | null;
  enUso: boolean;
  favorito: boolean;
  vistas: number | null;
  likes: number | null;
  comentarios: number | null;
  compartidos: number | null;
  guardados: number | null;
  createdAt: string;
  resultadoRaw?: {
    evaluacion?: { promedio?: number };
  } | null;
}

export async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || `Error ${res.status}`);
  }
  return data as T;
}