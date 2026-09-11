import { prisma } from "../db";

export interface MemoriaContenidos {
  hooksUsados: string[];
  angulosUsados: string[];
  estructurasUsadas: string[];
  productosCubiertos: string[];
  conceptosRecientes: string[];
  totalContenidos: number;
  estructurasQueFuncionan: string[];
  mejoresHooks: string[];
}

/**
 * Consulta el historial de contenidos para evitar repetición (sección 19)
 * y para que la IA aprenda qué estructuras y hooks ya funcionaron (métricas).
 */
export async function getMemoria(limit = 80): Promise<MemoriaContenidos> {
  const posts = await prisma.contentPost.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      hook: true,
      anguloCreativo: true,
      estructura: true,
      productoNombre: true,
      concepto: true,
      enUso: true,
      vistas: true,
      likes: true,
      comentarios: true,
      compartidos: true,
      guardados: true,
    },
  });

  const unique = (arr: (string | null)[]) =>
    Array.from(new Set(arr.filter((x): x is string => Boolean(x))));

  const interacciones = (p: (typeof posts)[number]) =>
    (p.vistas ?? 0) +
    (p.likes ?? 0) +
    (p.comentarios ?? 0) +
    (p.compartidos ?? 0) +
    (p.guardados ?? 0);

  const funcionaron = posts.filter((p) => p.enUso && interacciones(p) > 0);

  return {
    hooksUsados: unique(posts.map((p) => p.hook)),
    angulosUsados: unique(posts.map((p) => p.anguloCreativo)),
    estructurasUsadas: unique(posts.map((p) => p.estructura)),
    productosCubiertos: unique(posts.map((p) => p.productoNombre)).slice(0, 30),
    conceptosRecientes: unique(posts.map((p) => p.concepto)).slice(0, 8),
    totalContenidos: posts.length,
    estructurasQueFuncionan: unique(funcionaron.map((p) => p.estructura)).slice(0, 12),
    mejoresHooks: funcionaron
      .sort((a, b) => interacciones(b) - interacciones(a))
      .slice(0, 8)
      .map((p) => p.hook),
  };
}