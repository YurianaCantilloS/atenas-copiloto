import { NextResponse } from "next/server";
import { generateRequestSchema } from "@/lib/atenas/schemas";
import { generarContenido } from "@/lib/atenas/service";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = generateRequestSchema.parse(body);
    const resultado = await generarContenido(parsed);
    return NextResponse.json(resultado);
  } catch (e) {
    const enmascarar = (s: string) =>
      s
        .replace(/sk-proj-[A-Za-z0-9_-]+/g, "sk-proj-••••••")
        .replace(/Bearer\s+\S+/g, "Bearer (clave oculta)");
    const causa = e instanceof Error && (e as { cause?: { message?: string } }).cause?.message;
    let mensaje =
      e instanceof Error
        ? e.message.startsWith("Invalid `prisma")
          ? "Error de base de datos."
          : e.message
        : "Error inesperado.";
    if (causa) mensaje += ` (causa: ${enmascarar(causa)})`;
    console.error("Error en /api/generate:", e);
    return NextResponse.json({ error: enmascarar(mensaje) }, { status: 500 });
  }
}