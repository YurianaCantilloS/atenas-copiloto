"use client";

import {
  CheckCircle2,
  Clapperboard,
  Flame,
  GraduationCap,
  HeartHandshake,
  Images,
  Layers,
  Music2,
  ShoppingBag,
  Sparkles,
  Star,
  TrendingUp,
  Video,
} from "lucide-react";
import type { HistorialItem } from "@/lib/client";

const OBJETIVO_LABELS: Record<string, { label: string; Icon: typeof ShoppingBag }> = {
  venta: { label: "Vender", Icon: ShoppingBag },
  ensenar: { label: "Enseñar", Icon: GraduationCap },
  entretener: { label: "Entretener", Icon: Clapperboard },
  conectar: { label: "Conectar", Icon: HeartHandshake },
  viralidad: { label: "Viralizar", Icon: Flame },
};

const FORMATO_LABELS: Record<string, { label: string; Icon: typeof ShoppingBag }> = {
  tiktok: { label: "TikTok", Icon: Music2 },
  reel: { label: "Reel", Icon: Video },
  carrusel: { label: "Carrusel", Icon: Images },
  historias: { label: "Historias", Icon: Layers },
};

function interacciones(it: HistorialItem): number {
  return (
    (it.vistas ?? 0) +
    (it.likes ?? 0) +
    (it.comentarios ?? 0) +
    (it.compartidos ?? 0) +
    (it.guardados ?? 0)
  );
}

export default function MetricsPanel({ items }: { items: HistorialItem[] }) {
  const enUso = items.filter((i) => i.enUso);
  const favoritos = items.filter((i) => i.favorito);
  const totalInteracciones = items.reduce((acc, i) => acc + interacciones(i), 0);

  const conMetricas = items.filter((i) => interacciones(i) > 0);

  /* Por objetivo */
  const porObjetivo = new Map<string, { count: number; inter: number }>();
  for (const it of items) {
    const clave = it.objetivoClave || it.objetivo;
    const curr = porObjetivo.get(clave) ?? { count: 0, inter: 0 };
    curr.count += 1;
    curr.inter += interacciones(it);
    porObjetivo.set(clave, curr);
  }

  /* Por formato */
  const porFormato = new Map<string, { count: number; inter: number }>();
  for (const it of items) {
    const curr = porFormato.get(it.formato) ?? { count: 0, inter: 0 };
    curr.count += 1;
    curr.inter += interacciones(it);
    porFormato.set(it.formato, curr);
  }

  /* Estructuras usadas (en uso) */
  const estructuras = new Map<string, { count: number; inter: number }>();
  for (const it of enUso) {
    const curr = estructuras.get(it.estructura) ?? { count: 0, inter: 0 };
    curr.count += 1;
    curr.inter += interacciones(it);
    estructuras.set(it.estructura, curr);
  }

  const mejorRendimiento = [...items]
    .filter((i) => interacciones(i) > 0)
    .sort((a, b) => interacciones(b) - interacciones(a))
    .slice(0, 5);

  const maxInter = Math.max(
    1,
    ...porObjetivo.values().map((v) => v.inter),
    ...porFormato.values().map((v) => v.inter),
    ...estructuras.values().map((v) => v.inter)
  );

  const kpis = [
    { label: "Contenidos creados", valor: items.length, Icon: Sparkles, color: "text-[#a5146b]", bg: "bg-[#fbe5f0]" },
    { label: "En uso", valor: enUso.length, Icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Favoritos", valor: favoritos.length, Icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Interacciones totales", valor: totalInteracciones, Icon: TrendingUp, color: "text-[#8b5cf6]", bg: "bg-[#efe9ff]" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#a5146b]">Métricas y aprendizaje</h2>
          <p className="mt-1 max-w-xl text-sm text-[#96718a]">
            Lo que marcas “en uso” cuenta como estructura usada; agrega las interacciones
            y acá ves qué funciona. La IA lo usa para crear mejor contenido.
          </p>
        </div>
        <p className="rounded-full border border-[#f3cfe6] bg-white/80 px-3 py-1 text-xs font-bold text-[#8a3f6b]">
          {conMetricas.length} con métricas · {enUso.length} en uso
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="card p-4">
            <span className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl ${k.bg}`}>
              <k.Icon size={18} className={k.color} />
            </span>
            <p className={`text-2xl font-extrabold ${k.color}`}>{k.valor.toLocaleString("es-CO")}</p>
            <p className="text-xs font-semibold text-[#96718a]">{k.label}</p>
          </div>
        ))}
      </div>

      {enUso.length === 0 ? (
        <div className="card p-8 text-center">
          <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#fbe5f0]">
            <CheckCircle2 size={22} className="text-[#a5146b]" />
          </span>
          <h3 className="font-display text-lg font-bold text-[#7a2a5c]">Todavía no hay contenido en uso</h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-[#96718a]">
            En el historial, abre una propuesta y marca <span className="font-semibold">“En uso”</span> cuando
            la publiques. Después agrega sus interacciones y verás aquí qué formatos, objetivos
            y estructuras te funcionan.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Por objetivo */}
          <section className="card p-5">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#a5146b]">Por objetivo</h3>
            <div className="space-y-3">
              {[...porObjetivo.entries()].map(([clave, v]) => {
                const meta = OBJETIVO_LABELS[clave];
                const label = meta?.label ?? clave;
                const Icon = meta?.Icon ?? ShoppingBag;
                return (
                  <BarraClave key={clave} label={label} Icon={Icon} valor={v.inter} count={v.count} max={maxInter} />
                );
              })}
            </div>
          </section>

          {/* Por formato */}
          <section className="card p-5">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#a5146b]">Por formato</h3>
            <div className="space-y-3">
              {[...porFormato.entries()].map(([clave, v]) => {
                const meta = FORMATO_LABELS[clave];
                const label = meta?.label ?? clave;
                const Icon = meta?.Icon ?? Music2;
                return (
                  <BarraClave key={clave} label={label} Icon={Icon} valor={v.inter} count={v.count} max={maxInter} />
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* Estructuras usadas */}
      {estructuras.size > 0 && (
        <section className="card p-5">
          <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-[#a5146b]">Estructuras que usaste</h3>
          <p className="mb-3 text-xs text-[#96718a]">Lo que marcaste “en uso”, ordenado por interacciones.</p>
          <div className="space-y-3">
            {[...estructuras.entries()]
              .sort((a, b) => b[1].inter - a[1].inter)
              .map(([estructura, v]) => (
                <BarraClave key={estructura} label={estructura} Icon={Sparkles} valor={v.inter} count={v.count} max={maxInter} />
              ))}
          </div>
        </section>
      )}

      {/* Mejor desempeño */}
      {mejorRendimiento.length > 0 && (
        <section className="card p-5">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#a5146b]">Las que más te rinden</h3>
          <div className="space-y-3">
            {mejorRendimiento.map((it, i) => (
              <div key={it.id} className="flex items-start gap-3 rounded-xl border border-[#f6e3ee] bg-[#fffbfd] px-3 py-2.5">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#a5146b] to-[#ec4899] text-xs font-bold text-white">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#3d2a3b]">{it.concepto || it.request}</p>
                  <p className="truncate text-xs text-[#96718a]">
                    {FORMATO_LABELS[it.formato]?.label ?? it.formato} · {it.objetivo}
                  </p>
                  {it.enUso && (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                      <CheckCircle2 size={11} />
                      en uso
                    </span>
                  )}
                </div>
                <span className="flex-shrink-0 rounded-full bg-[#fbe5f0] px-2.5 py-1 text-xs font-extrabold text-[#a5146b]">
                  {interacciones(it).toLocaleString("es-CO")}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function BarraClave({
  label,
  Icon,
  valor,
  count,
  max,
}: {
  label: string;
  Icon: typeof ShoppingBag;
  valor: number;
  count: number;
  max: number;
}) {
  const pct = Math.round((valor / max) * 100);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#463a4c]">
          <Icon size={14} className="text-[#a5146b]" />
          {label}
        </span>
        <span className="text-xs font-bold text-[#8a3f6b]">
          {valor.toLocaleString("es-CO")} <span className="font-medium text-[#b18b9d]">· {count}</span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#f6e3ee]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#a5146b] to-[#ec4899] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}