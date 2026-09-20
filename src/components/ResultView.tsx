"use client";

import { useEffect, useState } from "react";
import { BookOpen, Download, FileText, Pencil, RefreshCw, Sparkles, Star } from "lucide-react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { api, type Evaluacion, type Propuesta, type ResultadoGeneracion } from "@/lib/client";

const pesoCriterios: { key: keyof Evaluacion; label: string; peso: number }[] = [
  { key: "fuerzaHook", label: "Fuerza del hook", peso: 25 },
  { key: "retencion", label: "Retención", peso: 20 },
  { key: "originalidad", label: "Originalidad", peso: 15 },
  { key: "identificacion", label: "Identificación", peso: 15 },
  { key: "marca", label: "Adecuación a marca", peso: 10 },
  { key: "claridad", label: "Claridad", peso: 10 },
  { key: "cta", label: "CTA", peso: 5 },
];

const HOOKS_FAV_KEY = "atenas-hooks-fav";

export default function ResultView({
  resultado,
  onGenerarOtra,
  onNuevaIdea,
  onEditar,
}: {
  resultado: ResultadoGeneracion;
  onGenerarOtra: () => void;
  onNuevaIdea: () => void;
  onEditar: () => void;
}) {
  const { propuesta: p, evaluacion, revisada, demo, contenidoId } = resultado;
  const [favorito, setFavorito] = useState(false);
  const [guardandoFav, setGuardandoFav] = useState(false);
  const [descargando, setDescargando] = useState(false);
  const [errorPdf, setErrorPdf] = useState<string | null>(null);
  const [hooksFav, setHooksFav] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(HOOKS_FAV_KEY) || "[]");
    } catch {
      return [];
    }
  });

  const toggleFavorito = async () => {
    if (!contenidoId || guardandoFav) return;
    const nuevo = !favorito;
    setGuardandoFav(true);
    try {
      await api(`/api/history`, { method: "PATCH", body: JSON.stringify({ id: contenidoId, favorito: nuevo }) });
      setFavorito(nuevo);
    } catch {
      /* noop */
    } finally {
      setGuardandoFav(false);
    }
  };

  const toggleHookFav = (hook: string) => {
    setHooksFav((prev) => {
      const next = prev.includes(hook) ? prev.filter((x) => x !== hook) : [...prev, hook];
      try {
        localStorage.setItem(HOOKS_FAV_KEY, JSON.stringify(next));
      } catch {
        /* noop */
      }
      return next;
    });
  };

  const descargar = async () => {
    if (descargando) return;
    setDescargando(true);
    setErrorPdf(null);
    try {
      const bytes = await buildPdf(p);
      const url = URL.createObjectURL(new Blob([bytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `propuesta-atena-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.pdf`;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        a.remove();
        URL.revokeObjectURL(url);
      }, 1000);
    } catch (e) {
      setErrorPdf(e instanceof Error ? e.message : "No se pudo generar el PDF.");
    } finally {
      setDescargando(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra de acciones del documento */}
      <div className="card fade-up flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#fbe5f0] to-[#ece0fa]">
            <FileText size={18} className="text-[#a5146b]" />
          </span>
          <div>
            <p className="text-sm font-bold text-[#a5146b]">Documento generado</p>
            <p className="text-xs text-[#96718a]">propuesta-atena · descargable en PDF</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={descargar}
            disabled={descargando}
            className="btn-sub inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-[#8b5cf6]/30 disabled:opacity-60"
          >
            <Download size={14} />
            {descargando ? "Generando PDF…" : "Descargar PDF"}
          </button>
          {errorPdf && <span className="w-full text-xs font-semibold text-red-600">{errorPdf}</span>}
          <button
            type="button"
            onClick={toggleFavorito}
            disabled={!contenidoId || guardandoFav}
            title={contenidoId ? "Guardar en favoritos" : "Disponible tras la generación"}
            className={`btn-sub inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition ${
              favorito
                ? "border-transparent bg-gradient-to-r from-amber-400 to-[#f59e0b] text-white shadow-md shadow-amber-500/30"
                : "border-[#f3cfe6] bg-white/80 text-[#8a3f6b] hover:border-[#f59e0b] hover:text-[#b45309]"
            }`}
          >
            <Star size={14} className={favorito ? "fill-current" : ""} />
            {favorito ? "En favoritos" : "Favorito"}
          </button>
          <button
            type="button"
            onClick={onEditar}
            className="btn-sub inline-flex items-center gap-1.5 rounded-full border border-[#f3cfe6] bg-white/80 px-3 py-1.5 text-xs font-bold text-[#a5146b] hover:border-[#a5146b]"
          >
            <Pencil size={14} />
            Editar
          </button>
          <button
            type="button"
            onClick={onGenerarOtra}
            className="btn-sub inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#a5146b] to-[#ec4899] px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-[#ec4899]/30"
          >
            <RefreshCw size={14} />
            Generar otra
          </button>
          <button
            type="button"
            onClick={onNuevaIdea}
            className="btn-sub inline-flex items-center gap-1.5 rounded-full bg-[#a5146b] px-3 py-1.5 text-xs font-bold text-white"
          >
            <Sparkles size={14} />
            Nueva idea
          </button>
        </div>
      </div>

      {demo && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Resultado de ejemplo (modo demo). Configura <code className="rounded bg-amber-100 px-1">OPENAI_API_KEY</code> en
          <code className="rounded bg-amber-100 px-1">.env</code> para generación real.
        </div>
      )}
      {revisada && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-700">
          Se aplicó una revisión interna para mejorar la propuesta.
        </div>
      )}

      {/* Resumen */}
      <section className="card fade-up p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="chip">Objetivo: {p.objetivo}</span>
          <span className="chip">Audiencia: {p.audiencia}</span>
          <span className="chip">Pilar: {p.pilar}</span>
        </div>
        <h2 className="text-balance text-xl font-bold leading-snug text-[#2b2330]">{p.concepto}</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg bg-[#faf3f7] px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8a7f92]">Ángulo creativo</p>
            <p className="text-sm font-medium text-[#463a4c]">{p.anguloCreativo}</p>
          </div>
          <div className="rounded-lg bg-[#faf3f7] px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8a7f92]">Estructura</p>
            <p className="text-sm font-medium text-[#463a4c]">{p.estructura.nombre}</p>
            <p className="mt-0.5 text-xs text-[#8a7f92]">{p.estructura.razon}</p>
          </div>
        </div>
        {p.serie && (
          <div className="mt-3 rounded-lg bg-[#faf3f7] px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8a7f92]">Oportunidad de serie</p>
            <p className="text-sm font-medium text-[#463a4c]">{p.serie}</p>
          </div>
        )}
      </section>

      {/* Hook recomendado */}
      <section className="card fade-up p-5">
        <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-[#a5146b]">Hook recomendado</h3>
        <p className="text-balance rounded-lg bg-gradient-to-r from-[#fbe5f0] to-white px-4 py-3 text-lg font-semibold text-[#2b2330]">
          “{p.hookRecomendado}”
        </p>
        <HookStar hook={p.hookRecomendado} activo={hooksFav.includes(p.hookRecomendado)} onToggle={toggleHookFav} />
      </section>

      {/* Hooks */}
      <HooksSection title="Hooks (5–8, de mecanismos diferentes)" hooks={p.hooks} recomendado={p.hookRecomendado} hooksFav={hooksFav} onToggleFav={toggleHookFav} />

      {/* Guion */}
      <section className="card fade-up p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="text-sm font-bold uppercase tracking-wide text-[#a5146b]">Guion completo</h3>
          <CopyButton text={p.guion} label="Copiar guion" />
        </div>
        <p className="prose-guion">{p.guion}</p>
      </section>

      {/* Storyboard */}
      <section className="card fade-up p-5">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#a5146b]">
          Storyboard <span className="font-medium normal-case text-[#8a7f92]">· tomas para grabar con celular</span>
        </h3>
        <div className="space-y-3">
          {p.storyboard.map((shot, i) => (
            <div key={i} className="rounded-xl border border-[#f0e4ea] bg-[#fdfbfc] p-4">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-[#a5146b] px-2 py-0.5 text-xs font-bold text-white">{shot.toma}</span>
                <span className="text-xs font-semibold text-[#8a7f92]">{shot.tiempo}</span>
                <span className="ml-auto rounded-md bg-[#f0e4ea] px-2 py-0.5 text-[11px] font-medium text-[#8a7f92]">
                  {shot.plano}
                </span>
              </div>
              <dl className="grid gap-x-4 gap-y-1.5 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-[11px] font-semibold uppercase text-[#8a7f92]">Visual</dt>
                  <dd className="text-[#463a4c]">{shot.visual}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase text-[#8a7f92]">Acción</dt>
                  <dd className="text-[#463a4c]">{shot.accion}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[11px] font-semibold uppercase text-[#8a7f92]">Voz</dt>
                  <dd className="text-[#463a4c]">{shot.voz}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[11px] font-semibold uppercase text-[#8a7f92]">Texto en pantalla</dt>
                  <dd className="rounded-md bg-[#faf3f7] px-2 py-1 text-[#a5146b]">{shot.textoPantalla}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </section>

      {/* Textos en pantalla */}
      {p.textosPantalla.length > 0 && (
        <section className="card fade-up p-5">
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-[#a5146b]">Textos en pantalla</h3>
          <div className="flex flex-wrap gap-2">
            {p.textosPantalla.map((t, i) => (
              <span key={i} className="rounded-lg bg-[#fbe5f0] px-3 py-1.5 text-xs font-semibold text-[#a5146b]">
                {t}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* CTA + captions + portadas + audio */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card fade-up p-5">
          <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-[#a5146b]">CTA</h3>
          <p className="text-sm text-[#463a4c]">{p.cta}</p>
        </section>
        <section className="card fade-up p-5">
          <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-[#a5146b]">Idea de audio / ambiente</h3>
          <p className="text-sm text-[#463a4c]">{p.audio}</p>
        </section>
      </div>

      <section className="card fade-up p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="text-sm font-bold uppercase tracking-wide text-[#a5146b]">Caption</h3>
          <CopyButton text={p.caption} label="Copiar caption" />
        </div>
        <p className="prose-guion whitespace-pre-wrap text-sm">{p.caption}</p>
      </section>

      {p.portadas.length > 0 && (
        <section className="card fade-up p-5">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#a5146b]">Texto de portada</h3>
          <div className="space-y-2">
            {p.portadas.map((port, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-[#f0e4ea] px-3 py-2">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#a5146b] text-xs font-bold text-white">
                  {i + 1}
                </span>
                <p className="text-sm font-medium text-[#463a4c]">{port}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Variaciones */}
      <section className="card fade-up p-5">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#a5146b]">Variaciones del concepto</h3>
        <div className="space-y-2">
          <div className="rounded-xl bg-[#faf3f7] p-3">
            <p className="mb-0.5 text-[11px] font-bold uppercase tracking-wide text-[#a5146b]">Variación A</p>
            <p className="text-sm text-[#463a4c]">{p.variacionA}</p>
          </div>
          <div className="rounded-xl bg-[#faf3f7] p-3">
            <p className="mb-0.5 text-[11px] font-bold uppercase tracking-wide text-[#a5146b]">Variación B</p>
            <p className="text-sm text-[#463a4c]">{p.variacionB}</p>
          </div>
        </div>
      </section>

      {p.serie && (
        <section className="card fade-up border-dashed p-5">
          <h3 className="mb-1 flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-[#a5146b]">
            <BookOpen size={14} />
            Oportunidad de serie
          </h3>
          <p className="text-sm text-[#463a4c]">{p.serie}</p>
        </section>
      )}

      {/* Evaluación interna */}
      {evaluacion && (
        <section className="card fade-up p-5">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#a5146b]">Evaluación interna</h3>
          <EvaluacionScore eval={evaluacion} />
        </section>
      )}

      {contenidoId && (
        <p className="pb-4 text-center text-xs text-[#b3a8bd]">
          Guardado en el historial · id {contenidoId.slice(0, 8)}
        </p>
      )}
    </div>
  );
}

function HookStar({
  hook,
  activo,
  onToggle,
}: {
  hook: string;
  activo: boolean;
  onToggle: (hook: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(hook)}
      title={activo ? "Quitar de hooks favoritos" : "Marcar hook como favorito"}
      className={`btn-sub mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold transition ${
        activo
          ? "border-transparent bg-gradient-to-r from-amber-400 to-[#f59e0b] text-white shadow-md shadow-amber-500/30"
          : "border-[#f3cfe6] bg-white/80 text-[#8a3f6b] hover:border-[#f59e0b] hover:text-[#b45309]"
      }`}
    >
      <Star size={13} className={activo ? "fill-current" : ""} />
      {activo ? "Hook favorito" : "Favorito"}
    </button>
  );
}

function HooksSection({
  title,
  hooks,
  recomendado,
  hooksFav,
  onToggleFav,
}: {
  title: string;
  hooks: string[];
  recomendado: string;
  hooksFav: string[];
  onToggleFav: (hook: string) => void;
}) {
  return (
    <section className="card fade-up p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold uppercase tracking-wide text-[#a5146b]">{title}</h3>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#96718a]">
          <Star size={12} />
          guarda tus hooks favoritos
        </span>
      </div>
      <ol className="space-y-2">
        {hooks.map((h, i) => {
          const esRecomendado = h === recomendado;
          const esFav = hooksFav.includes(h);
          return (
            <li
              key={i}
              className={`rounded-xl border px-3 py-2 text-sm ${
                esRecomendado
                  ? "border-[#a5146b] bg-[#fbe5f0] text-[#2b2330]"
                  : "border-[#f0e4ea] bg-[#fdfbfc] text-[#463a4c]"
              }`}
            >
              <div className="flex items-start gap-2">
                <span
                  className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                    esRecomendado ? "bg-[#a5146b] text-white" : "bg-[#f0e4ea] text-[#8a7f92]"
                  }`}
                >
                  {i + 1}
                </span>
                <p className="flex-1">{h}</p>
                <button
                  type="button"
                  onClick={() => onToggleFav(h)}
                  title={esFav ? "Quitar de favoritos" : "Marcar como favorito"}
                  className={`btn-sub flex-shrink-0 rounded-full p-1.5 transition ${
                    esFav ? "text-amber-500" : "text-[#c9a6ba] hover:text-amber-500"
                  }`}
                >
                  <Star size={15} className={esFav ? "fill-current" : ""} />
                </button>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function EvaluacionScore({ eval: e }: { eval: Evaluacion }) {
  const mostrar = (e.promedio ?? 0) > 0;
  return (
    <div>
      {mostrar ? (
        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm font-bold text-[#2b2330]">Promedio</span>
            <span
              className={`rounded-full px-3 py-0.5 text-sm font-extrabold ${
                e.promedio >= 75
                  ? "bg-emerald-100 text-emerald-700"
                  : e.promedio >= 55
                    ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {e.promedio}/100
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-[#f0e4ea]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#a5146b] to-[#e14b9f]"
              style={{ width: `${e.promedio}%` }}
            />
          </div>
        </div>
      ) : null}

      <div className="space-y-1.5 text-sm">
        {pesoCriterios.map((c) => (
          <div key={c.key} className="flex items-center justify-between gap-2">
            <span className="text-[#8a7f92]">
              {c.label} <span className="text-xs">({c.peso}%)</span>
            </span>
            <span className="font-semibold text-[#463a4c]">{e[c.key]}/100</span>
          </div>
        ))}
      </div>

      {e.comentarios?.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {e.comentarios.map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-[#8a7f92]">
              <span className="mt-0.5 text-[#a5146b]">○</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copiado, setCopiado] = useState(false);
  useEffect(() => {
    if (!copiado) return;
    const t = setTimeout(() => setCopiado(false), 1800);
    return () => clearTimeout(t);
  }, [copiado]);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopiado(true);
        } catch {
          /* clipboard no disponible */
        }
      }}
      className="btn-sub rounded-lg border border-[#f0e4ea] bg-white px-3 py-1.5 text-xs font-semibold text-[#a5146b]"
    >
      {copiado ? "¡Copiado!" : label}
    </button>
  );
}

function buildPdf(p: Propuesta): Promise<Uint8Array> {
  return (async () => {
    const pdf = await PDFDocument.create();
    pdf.setTitle(`Propuesta de contenido — ${p.concepto}`);
    pdf.setAuthor("Copiloto creativo · Atenas Style Shop");
    pdf.setCreator("atenas-copiloto");

    const helvetica = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
    const italic = await pdf.embedFont(StandardFonts.HelveticaOblique);

    const MAGENTA = rgb(0.647, 0.078, 0.42);
    const ROSA = rgb(0.925, 0.655, 0.804);
    const DARK = rgb(0.24, 0.16, 0.23);
    const GRIS = rgb(0.54, 0.5, 0.57);
    const LINEA = rgb(0.91, 0.87, 0.9);

    const PAGE = { w: 595.28, h: 841.89 };
    const MARGEN = 48;
    const ANCHO = PAGE.w - MARGEN * 2;
    const LINEA_ALTA = 14;

    let page = pdf.addPage([PAGE.w, PAGE.h]);
    let y = PAGE.h - 100;
    let numPagina = 1;

    const pie = () => {
      page.drawLine({ start: { x: MARGEN, y: 50 }, end: { x: PAGE.w - MARGEN, y: 50 }, thickness: 0.5, color: ROSA });
      page.drawText("Generado con Copiloto creativo · Atenas Style Shop", { x: MARGEN, y: 36, size: 7, font: helvetica, color: GRIS });
      const pg = `Pág. ${numPagina}`;
      page.drawText(pg, { x: PAGE.w - MARGEN - helvetica.widthOfTextAtSize(pg, 7), y: 36, size: 7, font: helvetica, color: GRIS });
    };

    const nuevaPagina = () => {
      page = pdf.addPage([PAGE.w, PAGE.h]);
      numPagina += 1;
      // Cabecera de marca en cada página
      page.drawRectangle({ x: 0, y: PAGE.h - 46, width: PAGE.w, height: 46, color: MAGENTA });
      page.drawText("PROPUESTA DE CONTENIDO", { x: MARGEN, y: PAGE.h - 43, size: 7.5, font: bold, color: rgb(1, 1, 1) });
      const superT = "ATENAS STYLE SHOP · COPILOTO CREATIVO";
      page.drawText(superT, {
        x: PAGE.w - MARGEN - helvetica.widthOfTextAtSize(superT, 7.5),
        y: PAGE.h - 43,
        size: 7.5,
        font: helvetica,
        color: rgb(1, 1, 1),
      });
      page.drawLine({ start: { x: MARGEN, y: PAGE.h - 60 }, end: { x: PAGE.w - MARGEN, y: PAGE.h - 60 }, thickness: 0.75, color: ROSA });
      pie();
      return PAGE.h - 84;
    };

    const asegurarEspacio = (alto: number) => {
      if (y - alto < 64) y = nuevaPagina();
    };

    const separador = () => {
      y -= 8;
      page.drawLine({ start: { x: MARGEN, y }, end: { x: PAGE.w - MARGEN, y }, thickness: 0.5, color: LINEA });
      y -= 16;
    };

    const heading = (num: string, texto: string) => {
      asegurarEspacio(62);
      page.drawRectangle({ x: MARGEN, y: y - 19, width: ANCHO, height: 24, color: rgb(0.96, 0.93, 0.96), opacity: 0.75 });
      page.drawRectangle({ x: MARGEN, y: y - 19, width: 3.6, height: 24, color: MAGENTA });
      page.drawText(sanitizar(`${num}  ${texto}`, bold), { x: MARGEN + 12, y: y - 14, size: 11, font: bold, color: MAGENTA });
      y -= 33;
    };

    const body = (texto: string, estilo: "regular" | "quote" = "regular") => {
      const fuente = estilo === "quote" ? italic : helvetica;
      const tamaño = estilo === "quote" ? 13 : 10.5;
      const lapos = wrap(texto, fuente, tamaño, estilo === "quote" ? ANCHO - 16 : ANCHO);
      asegurarEspacio(lapos.length * LINEA_ALTA + 8);
      if (estilo === "quote") {
        const fondo = rgb(0.97, 0.94, 0.97);
        const alto = lapos.length * LINEA_ALTA + 16;
        page.drawRectangle({ x: MARGEN, y: y - alto, width: ANCHO, height: alto, color: fondo, opacity: 0.6 });
        y -= alto - 12;
      }
      for (const linea of lapos) {
        page.drawText(linea, { x: estilo === "quote" ? MARGEN + 10 : MARGEN, y: y - 10.5, size: tamaño, font: fuente, color: DARK, maxWidth: estilo === "quote" ? ANCHO - 20 : ANCHO });
        y -= LINEA_ALTA;
      }
      y -= 8;
    };

    const bullets = (items: string[], numerada = false) => {
      const fuente = helvetica;
      const tamaño = 10;
      items.forEach((item, idx) => {
        const prefijo = numerada ? `${idx + 1}.` : "•";
        const anchoNum = numerada ? 17 : 13;
        const lapos = wrap(item, fuente, tamaño, ANCHO - anchoNum - 6);
        asegurarEspacio(lapos.length * LINEA_ALTA + 4);
        page.drawText(prefijo, { x: MARGEN, y: y - 11, size: tamaño, font: bold, color: MAGENTA });
        for (const linea of lapos) {
          page.drawText(linea, { x: MARGEN + anchoNum, y: y - 11, size: tamaño, font: fuente, color: DARK, maxWidth: ANCHO - anchoNum });
          y -= LINEA_ALTA;
        }
        y -= 2;
      });
      y -= 8;
    };

    const campoEtiquetado = (label: string, texto: string) => {
      const LBL = 54;
      const lapos = wrap(texto, helvetica, 10, ANCHO - LBL - 8);
      const alto = Math.max(lapos.length, 1) * 13 + 6;
      asegurarEspacio(alto);
      page.drawText(sanitizar(label.toUpperCase(), bold), { x: MARGEN, y: y - 8.5, size: 7, font: bold, color: MAGENTA });
      for (const linea of lapos) {
        page.drawText(linea, { x: MARGEN + LBL, y: y - 8.5, size: 10, font: helvetica, color: DARK });
        y -= 13;
      }
      y -= 4;
    };

    const claveValor = (claves: [string, string][]) => {
      let filas = 0;
      claves.forEach(([, v]) => {
        const n = Math.ceil(wrap(v, helvetica, 10.5, (ANCHO - 60) / 2).length);
        filas += n || 1;
      });
      asegurarEspacio(filas * 15 + 10);
      const col = (PAGE.w - MARGEN * 2) / 2;
      for (let i = 0; i < claves.length; i++) {
        const [k, v] = claves[i];
        const x = MARGEN + (i % 2) * (col + 6);
        page.drawText(k.toUpperCase(), { x, y: y - 9, size: 6.5, font: bold, color: GRIS });
        const lineas = wrap(v, helvetica, 10, col - 12);
        y -= 14;
        for (const linea of lineas) {
          page.drawText(linea, { x, y: y - 9, size: 10, font: helvetica, color: DARK, maxWidth: col - 12 });
          y -= 12.5;
        }
        if (i % 2 === 1) y -= 8;
      }
      y += (filas % 2 === 1 ? 6 : 0);
      y -= 6;
      separador();
    };

    // ── Portada ─────────────────────────────────────────────
    page.drawRectangle({ x: 0, y: 0, width: PAGE.w, height: PAGE.h, color: rgb(1, 0.988, 0.993) });
    page.drawRectangle({ x: 0, y: PAGE.h - 210, width: PAGE.w, height: 210, color: ROSA, opacity: 0.28 });
    page.drawRectangle({ x: 0, y: PAGE.h - 46, width: PAGE.w, height: 46, color: MAGENTA });
    page.drawText("PROPUESTA DE CONTENIDO", { x: MARGEN, y: PAGE.h - 43, size: 7.5, font: bold, color: rgb(1, 1, 1) });
    const superT = "ATENAS STYLE SHOP · COPILOTO CREATIVO";
    page.drawText(superT, {
      x: PAGE.w - MARGEN - helvetica.widthOfTextAtSize(superT, 7.5),
      y: PAGE.h - 43,
      size: 7.5,
      font: helvetica,
      color: rgb(1, 1, 1),
    });
    page.drawText("ESTRATEGIA Y CREACIÓN DE CONTENIDO", { x: MARGEN, y: PAGE.h - 156, size: 9, font: bold, color: GRIS });
    const t = wrap(p.concepto, bold, 24, ANCHO);
    t.forEach((linea, i) => page.drawText(linea, { x: MARGEN, y: PAGE.h - 176 - i * 30, size: 24, font: bold, color: MAGENTA }));
    y = PAGE.h - 176 - t.length * 30 - 18;
    separador();

    claveValor([
      ["Objetivo", p.objetivo],
      ["Audiencia", p.audiencia],
      ["Pilar", p.pilar],
      ["Ángulo creativo", p.anguloCreativo],
      ["Estructura", p.estructura.nombre],
    ]);
    pie();

    heading("01", "Ángulo creativo");
    body(p.anguloCreativo);

    heading("02", `Estructura · ${p.estructura.nombre}`);
    body(p.estructura.razon);

    heading("03", "Hook recomendado");
    body(`“${p.hookRecomendado}”`, "quote");

    const otrosHooks = p.hooks.filter((h) => h !== p.hookRecomendado);
    if (otrosHooks.length > 0) {
      heading("04", "Otras opciones de hook");
      bullets(otrosHooks, true);
    }

    heading("05", "Guion completo");
    body(p.guion);

    if (p.storyboard.length > 0) {
      heading("06", "Storyboard para grabar");
      for (const shot of p.storyboard) {
        const sub = sanitizar(`${shot.toma} · ${shot.tiempo} · ${shot.plano}`, bold);
        asegurarEspacio(150);
        page.drawRectangle({ x: MARGEN, y: y - 12, width: ANCHO, height: 16, color: rgb(0.94, 0.83, 0.89), opacity: 0.5 });
        page.drawText(sub, { x: MARGEN + 7, y: y - 10.5, size: 9.5, font: bold, color: DARK });
        y -= 24;
        campoEtiquetado("Visual", shot.visual);
        campoEtiquetado("Acción", shot.accion);
        campoEtiquetado("Voz", shot.voz);
        campoEtiquetado("Texto pantalla", shot.textoPantalla);
        separador();
      }
    }

    if (p.textosPantalla.length > 0) {
      heading("07", "Textos en pantalla");
      bullets(p.textosPantalla, true);
    }

    heading("08", "Llamado a la acción (CTA)");
    body(p.cta);

    heading("09", "Caption");
    body(p.caption);

    if (p.portadas.length > 0) {
      heading("10", "Texto de portada");
      bullets(p.portadas.map((port, i) => `${i + 1}. ${port}`), true);
    }

    heading("11", "Idea de audio / ambiente");
    body(p.audio);

    heading("12", "Variaciones del concepto");
    bullets([`Variación A: ${p.variacionA}`, `Variación B: ${p.variacionB}`]);

    if (p.serie) {
      heading("13", "Oportunidad de serie");
      body(p.serie);
    }

    y -= 8;
    return pdf.save();
  })();
}

function sanitizar(texto: string, font: { encodeText: (t: string) => unknown }): string {
  let res = "";
  for (const ch of texto) {
    try {
      font.encodeText(ch);
      res += ch;
    } catch {
      res += ch === "→" || ch === "←" ? "->" : "?";
    }
  }
  return res;
}

function wrap(texto: string, font: { widthOfTextAtSize: (t: string, s: number) => number }, size: number, maxWidth: number): string[] {
  const out: string[] = [];
  for (const para of texto.split(/\r?\n/)) {
    const limpio = sanitizar(para, font as unknown as { encodeText: (t: string) => unknown });
    const palabras = limpio.split(/\s+/).filter(Boolean);
    if (palabras.length === 0) {
      out.push("");
      continue;
    }
    let cur = "";
    for (const word of palabras) {
      const prueba = cur ? `${cur} ${word}` : word;
      if (font.widthOfTextAtSize(prueba, size) > maxWidth) {
        if (cur) out.push(cur);
        cur = word;
      } else {
        cur = prueba;
      }
    }
    if (cur) out.push(cur);
  }
  return out;
}