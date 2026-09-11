import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const CAMPOS_METRICAS = [
  "vistas",
  "likes",
  "comentarios",
  "compartidos",
  "guardados",
] as const;

export async function GET() {
  try {
    const posts = await prisma.contentPost.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return NextResponse.json(posts);
  } catch (e) {
    console.error("Error GET /api/history:", e);
    return NextResponse.json({ error: "No se pudo cargar el historial." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, publicado, enUso, favorito, ...resto } = body || {};
    if (!id) return NextResponse.json({ error: "Falta el id." }, { status: 400 });

    const data: Record<string, unknown> = {};
    if (typeof publicado === "boolean") {
      data.publicado = publicado;
      data.fechaPublicacion = publicado ? new Date() : null;
    }
    if (typeof enUso === "boolean") {
      data.enUso = enUso;
    }
    if (typeof favorito === "boolean") {
      data.favorito = favorito;
    }
    for (const campo of CAMPOS_METRICAS) {
      const valor = resto[campo];
      if (typeof valor === "number" && valor >= 0 && Number.isInteger(valor)) {
        data[campo] = valor;
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Sin campos para actualizar." }, { status: 400 });
    }

    const post = await prisma.contentPost.update({ where: { id }, data });
    return NextResponse.json(post);
  } catch (e) {
    console.error("Error PATCH /api/history:", e);
    return NextResponse.json({ error: "No se pudo actualizar." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Falta el id." }, { status: 400 });
    await prisma.contentPost.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Error DELETE /api/history:", e);
    return NextResponse.json({ error: "No se pudo eliminar." }, { status: 500 });
  }
}