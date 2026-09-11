"use client";

import { useState } from "react";
import {
  Bookmark,
  CheckCircle2,
  Circle,
  Eye,
  MessageCircle,
  Pencil,
  Repeat,
  Star,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { api, type HistorialItem } from "@/lib/client";

const CAMPOS_METRICAS = [
  { campo: "vistas", label: "Vistas", Icon: Eye },
  { campo: "likes", label: "Likes", Icon: ThumbsUp },
  { campo: "comentarios", label: "Comentarios", Icon: MessageCircle },
  { campo: "compartidos", label: "Compartidos", Icon: Repeat },
  { campo: "guardados", label: "Guardados", Icon: Bookmark },
] as const;

type CampoMetrica = (typeof CAMPOS_METRICAS)[number]["campo"];

function interacciones(it: HistorialItem): number {
  return (
    (it.vistas ?? 0) +
    (it.likes ?? 0) +
    (it.comentarios ?? 0) +
    (it.compartidos ?? 0) +
    (it.guardados ?? 0)
  );
}

export default function HistoryPanel({
  items,
  onCambio,
}: {
  items: HistorialItem[];
  onCambio: () => void;
}) {
  const [expandido, setExpandido] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("");
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const [soloUso, setSoloUso] = useState(false);

  const filtrados = items.filter((it) => {
    const texto = [it.request, it.concepto, it.hook, it.estructura, it.objetivo]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(filtro.toLowerCase()));
    return texto && (soloFavoritos ? it.favorito : true) && (soloUso ? it.enUso : true);
  });

  const patch = async (id: string, cambios: Record<string, unknown>) => {
    await api(`/api/history`, { method: "PATCH", body: JSON.stringify({ id, ...cambios }) });
    onCambio();
  };

  const eliminar = async (it: HistorialItem) => {
    if (!confirm("¿Eliminar este contenido del historial?")) return;
    try {
      await api(`/api/history`, { method: "DELETE", body: JSON.stringify({ id: it.id }) });
      onCambio();
    } catch {
      /* noop */
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#a5146b]">Memoria de contenido</h2>
          <p className="mt-1 max-w-xl text-sm text-[#96718a]">
            Marca como <span className="font-semibold">en uso</span> lo que publiques y
            agrega sus interacciones: así la IA aprende qué funciona y qué no.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <input
            className="w-full rounded-xl border border-[#f3cfe6] bg-white/90 px-3 py-2 text-sm outline-none focus:border-[#a5146b] sm:w-64"
            placeholder="Buscar en el historial…"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
          <div className="flex gap-2">
            <FiltroBtn activo={soloFavoritos} onClick={() => setSoloFavoritos((v) => !v)}>
              <Star size={13} />
              Favoritos
            </FiltroBtn>
            <FiltroBtn activo={soloUso} onClick={() => setSoloUso((v) => !v)}>
              <CheckCircle2 size={13} />
              En uso
            </FiltroBtn>
          </div>
        </div>
      </div>

      {filtrados.length === 0 ? (
        <div className="card p-10 text-center text-sm text-[#96718a]">
          {items.length === 0
            ? "Aún no hay contenido generado. Crea tu primera propuesta."
            : "Sin resultados para tu búsqueda o filtros."}
        </div>
      ) : (
        <div className="space-y-3">
          {filtrados.map((it) => (
            <HistoryCard key={it.id} item={it} expandido={expandido === it.id} onToggle={() => setExpandido(expandido === it.id ? null : it.id)} onPatch={patch} onEliminar={() => eliminar(it)} />
          ))}
        </div>
      )}
    </div>
  );
}

function FiltroBtn({
  activo,
  onClick,
  children,
}: {
  activo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn-sub inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:flex-none ${
        activo
          ? "border-transparent bg-gradient-to-r from-[#a5146b] to-[#ec4899] text-white shadow-md shadow-[#ec4899]/30"
          : "border-[#f3cfe6] bg-white/80 text-[#8a3f6b] hover:border-[#ec4899]"
      }`}
    >
      {children}
    </button>
  );
}

function HistoryCard({
  item,
  expandido,
  onToggle,
  onPatch,
  onEliminar,
}: {
  item: HistorialItem;
  expandido: boolean;
  onToggle: () => void;
  onPatch: (id: string, cambios: Record<string, unknown>) => void;
  onEliminar: () => void;
}) {
  const [metrica, setMetrica] = useState<Record<CampoMetrica, string>>({
    vistas: item.vistas?.toString() ?? "",
    likes: item.likes?.toString() ?? "",
    comentarios: item.comentarios?.toString() ?? "",
    compartidos: item.compartidos?.toString() ?? "",
    guardados: item.guardados?.toString() ?? "",
  });
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const total = interacciones(item);

  const guardarMetricas = async () => {
    const data: Record<string, number> = {};
    for (const { campo } of CAMPOS_METRICAS) {
      const n = Number(metrica[campo]);
      if (Number.isInteger(n) && n >= 0) data[campo] = n;
    }
    setGuardando(true);
    try {
      await onPatch(item.id, data);
      setEditando(false);
    } finally {
      setGuardando(false);
    }
  };

  const highlight = item.favorito || item.enUso;

  return (
    <article className={`card overflow-hidden transition ${highlight ? "ring-2 ring-[#ec4899]/40" : ""}`}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full flex-wrap items-center gap-3 px-4 py-3 text-left"
      >
        <span className="flex items-center gap-1.5 text-[#a5146b]">
          <Star
            size={16}
            className={item.favorito ? "fill-amber-400 text-amber-500" : "text-[#e0b9d2]"}
          />
        </span>
        <span className="min-w-[200px] flex-1">
          <span className="block text-sm font-semibold text-[#3d2a3b]">
            {item.concepto || item.request}
          </span>
          <span className="mt-0.5 block truncate text-xs text-[#96718a]">
            {new Date(item.createdAt).toLocaleDateString("es-CO")} · {item.audiencia} ·{" "}
            {item.objetivo}
          </span>
        </span>
        <span className="flex items-center gap-2">
          {item.enUso && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
              <CheckCircle2 size={11} />
              en uso
            </span>
          )}
          {total > 0 && (
            <span className="rounded-full bg-[#fbe5f0] px-2.5 py-0.5 text-xs font-bold text-[#a5146b]">
              {total.toLocaleString("es-CO")} interacciones
            </span>
          )}
          {item.resultadoRaw?.evaluacion?.promedio != null && (
            <span className="rounded-full border border-[#f3cfe6] px-2 py-0.5 text-xs text-[#96718a]">
              {item.resultadoRaw.evaluacion.promedio}/100
            </span>
          )}
        </span>
        <span className={`text-xs ${item.publicado ? "font-semibold text-emerald-600" : "text-[#b18b9d]"}`}>
          {item.publicado ? "✓ publicado" : "borrador"}
        </span>
      </button>

      <div style={{ display: expandido ? "block" : "none" }} className="border-t border-[#f6e3ee] bg-[#fffbfd]/80 px-4 py-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-[#96718a]">Hook usado</p>
            <p className="text-sm font-medium text-[#463a4c]">{item.hook}</p>
          </div>
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-[#96718a]">Ángulo · Estructura</p>
            <p className="text-sm text-[#463a4c]">
              {item.anguloCreativo} · <span className="font-semibold">{item.estructura}</span>
            </p>
          </div>
        </div>
        <p className="mb-1 mt-3 text-[11px] font-bold uppercase tracking-wide text-[#96718a]">Caption</p>
        <p className="whitespace-pre-wrap text-sm text-[#463a4c]">{item.caption}</p>

        {/* Estado: publicado + en uso + favorito */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Chip activo={item.publicado} onClick={() => onPatch(item.id, { publicado: !item.publicado })}>
            {item.publicado ? <CheckCircle2 size={14} /> : <Circle size={14} />}
            {item.publicado ? "Publicado" : "Marcar publicado"}
          </Chip>
          <Chip activo={item.enUso} onClick={() => onPatch(item.id, { enUso: !item.enUso })}>
            {item.enUso ? <CheckCircle2 size={14} /> : <Circle size={14} />}
            En uso
          </Chip>
          <Chip activo={item.favorito} onClick={() => onPatch(item.id, { favorito: !item.favorito })}>
            <Star size={14} />
            Favorito
          </Chip>
          <button
            type="button"
            onClick={onEliminar}
            className="btn-sub inline-flex items-center gap-1.5 rounded-full border border-[#f3cfe6] bg-white/80 px-3 py-1.5 text-xs font-semibold text-red-500 hover:border-red-300"
          >
            <Trash2 size={14} />
            Eliminar
          </button>
        </div>

        {/* Métricas */}
        <div className="mt-4 rounded-2xl border border-[#f3cfe6] bg-white/70 p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#96718a]">
              Interacciones {editando ? "(edición)" : ""}
            </p>
            <button
              type="button"
              onClick={() => (editando ? guardarMetricas() : setEditando(true))}
              disabled={guardando}
              className="btn-sub inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#a5146b] to-[#ec4899] px-3 py-1 text-xs font-bold text-white disabled:opacity-60"
            >
              <Pencil size={12} />
              {editando ? (guardando ? "Guardando…" : "Guardar") : total > 0 ? "Editar" : "Agregar"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {CAMPOS_METRICAS.map(({ campo, label, Icon }) => (
              <div key={campo}>
                <label className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-[#96718a]">
                  <Icon size={12} />
                  {label}
                </label>
                <input
                  className="w-full rounded-lg border border-[#f3cfe6] bg-white px-2 py-1.5 text-sm outline-none focus:border-[#a5146b]"
                  inputMode="numeric"
                  value={metrica[campo]}
                  disabled={!editando}
                  onChange={(e) => setMetrica((m) => ({ ...m, [campo]: e.target.value }))}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function Chip({
  activo,
  onClick,
  children,
}: {
  activo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn-sub inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
        activo
          ? "border-transparent bg-gradient-to-r from-[#a5146b] to-[#ec4899] text-white shadow-md shadow-[#ec4899]/30"
          : "border-[#f3cfe6] bg-white/80 text-[#8a3f6b] hover:border-[#ec4899]"
      }`}
    >
      {children}
    </button>
  );
}