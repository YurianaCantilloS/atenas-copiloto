"use client";

import { useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clapperboard,
  Flame,
  GraduationCap,
  HeartHandshake,
  Images,
  ImagePlus,
  Layers,
  Music2,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Video,
  X,
} from "lucide-react";
import type { GenerateRequest, ResultadoGeneracion } from "@/lib/client";

interface Props {
  onGenerar: (req: GenerateRequest) => void;
  cargando: boolean;
  ultimoResultado: ResultadoGeneracion | null;
  solicitudInicial?: GenerateRequest | null;
  modoEdicion?: boolean;
}

type Icone = typeof ShoppingBag;

const OBJETIVOS: { value: string; label: string; Icon: Icone; hint: string }[] = [
  { value: "venta", label: "Vender", Icon: ShoppingBag, hint: "conversión y deseo" },
  { value: "ensenar", label: "Enseñar", Icon: GraduationCap, hint: "dato útil y guardados" },
  { value: "entretener", label: "Entretener", Icon: Clapperboard, hint: "humor y sorpresa" },
  { value: "conectar", label: "Conectar", Icon: HeartHandshake, hint: "storytelling y comunidad" },
  { value: "viralidad", label: "Viralizar", Icon: Flame, hint: "que lo compartan" },
];

const FORMATOS: { value: string; label: string; Icon: Icone; hint: string }[] = [
  { value: "tiktok", label: "TikTok", Icon: Music2, hint: "rápido y vertical" },
  { value: "reel", label: "Reel", Icon: Video, hint: "vertical cuidado" },
  { value: "carrusel", label: "Carrusel", Icon: Images, hint: "slide a slide" },
  { value: "historias", label: "Historias", Icon: Layers, hint: "efímero cercano" },
];

const AUDIENCIAS: { value: string; label: string }[] = [
  { value: "consumidoras", label: "Consumidoras" },
  { value: "minoristas", label: "Minoristas" },
  { value: "mayoristas", label: "Mayoristas" },
  { value: "ambas", label: "Ambas" },
];

const NIVELES = [
  { value: "sutil", label: "Sutil" },
  { value: "equilibrado", label: "Equilibrado" },
  { value: "comercial", label: "Comercial" },
];

const DURACIONES = [
  { value: "corta", label: "Corta (≤20 s)" },
  { value: "media", label: "Media (20–40 s)" },
  { value: "larga", label: "Larga (40 s+)" },
];

const PRESENCIAS = [
  { value: "hablando", label: "Hablando a cámara" },
  { value: "vozoff", label: "Voz en off" },
  { value: "texto", label: "Solo texto" },
  { value: "demostracion", label: "Demostración" },
  { value: "manos", label: "Manos / producto" },
  { value: "combinacion", label: "Combinación" },
];

const MAX_IDEA = 400;

const inputCls =
  "w-full rounded-xl border border-[#f3cfe6] bg-white px-3 py-2.5 text-sm text-[#3d2a3b] outline-none transition focus:border-[#a5146b] focus:ring-2 focus:ring-[#fbe5f0]";
const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-[#8a3f6b]";

function Kicker({ n, texto }: { n: string; texto: string }) {
  return (
    <p className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[#c2709c]">
      <span className="inline-flex h-5 items-center justify-center rounded-full bg-gradient-to-r from-[#a5146b] to-[#ec4899] px-2 text-[9px] text-white">
        {n}
      </span>
      {texto}
    </p>
  );
}

export default function GeneratorForm({
  onGenerar,
  cargando,
  ultimoResultado,
  solicitudInicial,
  modoEdicion = false,
}: Props) {
  const [idea, setIdea] = useState(solicitudInicial?.idea ?? "");
  const [sinIdea, setSinIdea] = useState(solicitudInicial ? !solicitudInicial.idea : false);
  const [objetivo, setObjetivo] = useState(solicitudInicial?.objetivo ?? "venta");
  const [formato, setFormato] = useState(solicitudInicial?.formato ?? "tiktok");
  const [audiencia, setAudiencia] = useState<string>(solicitudInicial?.audiencia ?? "consumidoras");
  const [datosOpcionales, setDatosOpcionales] = useState(solicitudInicial?.datosOpcionales ?? "");
  const [nivelMarca, setNivelMarca] = useState<GenerateRequest["nivelMarca"]>(
    solicitudInicial?.nivelMarca ?? "equilibrado"
  );
  const [duracion, setDuracion] = useState<GenerateRequest["duracion"]>(solicitudInicial?.duracion ?? "media");
  const [presencia, setPresencia] = useState(solicitudInicial?.presencia ?? "combinacion");
  const [extrasAbiertos, setExtrasAbiertos] = useState(false);
  const [imagenReferencia, setImagenReferencia] = useState<string | null>(null);
  const [avisoImagen, setAvisoImagen] = useState<string | null>(null);
  const inputImagenRef = useRef<HTMLInputElement>(null);

  const puedeEnviar = !cargando && (sinIdea || idea.trim().length > 0);

  const alElegirImagen = (file: File | undefined | null) => {
    setAvisoImagen(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setAvisoImagen("El archivo no es una imagen.");
      return;
    }
    if (file.size > 2.5 * 1024 * 1024) {
      setAvisoImagen("La imagen pesa más de 2,5 MB; usa una más liviana.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImagenReferencia(String(reader.result));
    reader.readAsDataURL(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!puedeEnviar) return;
    onGenerar({
      idea: sinIdea ? "" : idea.trim(),
      objetivo,
      audiencia: audiencia as GenerateRequest["audiencia"],
      formato,
      datosOpcionales: datosOpcionales.trim(),
      nivelMarca: nivelMarca as GenerateRequest["nivelMarca"],
      duracion: duracion as GenerateRequest["duracion"],
      presencia,
      ...(imagenReferencia ? { imagenReferencia } : {}),
    });
  };

  const obj = OBJETIVOS.find((o) => o.value === objetivo);

  return (
    <form onSubmit={submit} className="relative">
      {/* ============ 01 · IDEA ============ */}
      <section className="card relative overflow-hidden p-6 sm:p-10">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#fbe5f0] blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-[#ece0fa] blur-3xl"
          aria-hidden
        />
        <div className="relative">
          <Kicker n="01" texto="Idea" />
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="font-display text-2xl font-bold leading-tight text-[#2b2330] sm:text-3xl">
                Cuéntanos la idea
              </h2>
              <p className="mt-1 max-w-md text-sm text-[#96718a]">
                El punto de partida de todo: qué quieres crear, mostrar o decir. Aquí nace la magia.
              </p>
            </div>
            <span
              className={`text-xs font-bold tabular-nums ${
                idea.length > MAX_IDEA - 40 ? "text-amber-600" : "text-[#b18b9d]"
              }`}
            >
              {idea.length}/{MAX_IDEA}
            </span>
          </div>

          {sinIdea ? (
            <div className="mt-5 rounded-2xl border border-dashed border-[#8b5cf6]/50 bg-white/70 px-6 py-8 text-center">
              <Sparkles size={20} className="mx-auto mb-2 text-[#8b5cf6]" />
              <p className="text-sm font-semibold text-[#6d4b8a]">
                Perfecto: la estratega propone una idea en tendencia acorde a tu negocio y al objetivo que elijas.
              </p>
            </div>
          ) : (
            <div className="mt-5">
              <textarea
                id="idea"
                className="w-full resize-none rounded-2xl border border-[#f3cfe6] bg-white/95 px-6 py-5 font-display text-lg leading-relaxed text-[#3d2a3b] shadow-[0_10px_30px_-18px_rgba(165,20,107,0.35)] outline-none transition placeholder:text-[#cba8bd] focus:border-[#ec4899] focus:ring-4 focus:ring-[#fbe5f0]"
                placeholder="Ej. mostrar la nueva colección de accesorios…"
                rows={4}
                maxLength={MAX_IDEA}
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
              />
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSinIdea((v) => !v)}
              className={`btn-sub inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition ${
                sinIdea
                  ? "border-transparent bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white shadow-md shadow-[#8b5cf6]/30"
                  : "border-[#f0dcec] bg-white/80 text-[#6d4b8a] hover:border-[#8b5cf6] hover:-translate-y-0.5"
              }`}
            >
              <Sparkles size={14} />
              No tengo idea, sorpréndeme
            </button>

            <button
              type="button"
              onClick={() => inputImagenRef.current?.click()}
              title="Adjuntar una imagen como referencia visual"
              className={`btn-sub inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition ${
                imagenReferencia
                  ? "border-transparent bg-gradient-to-r from-[#a5146b] to-[#ec4899] text-white shadow-md shadow-[#ec4899]/30"
                  : "border-[#f0dcec] bg-white/80 text-[#8a3f6b] hover:border-[#a5146b] hover:-translate-y-0.5"
              }`}
            >
              <ImagePlus size={14} />
              {imagenReferencia ? "Imagen adjunta" : "Usar imagen como referencia"}
            </button>
            <input
              ref={inputImagenRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                alElegirImagen(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </div>

          {sinIdea && imagenReferencia && (
            <p className="mt-2 text-xs text-[#6d4b8a]">
              La imagen de referencia también se tendrá en cuenta.
            </p>
          )}

          {imagenReferencia && (
            <div className="mt-3 flex items-start gap-3 rounded-2xl border border-[#f3cfe6] bg-white/80 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagenReferencia}
                alt="Referencia visual"
                className="h-20 w-20 rounded-xl object-cover shadow-sm"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[#7a2a5c]">Referencia visual</p>
                <p className="text-xs text-[#96718a]">
                  La IA analizará la imagen: estilo, escenario, objetos y vibra para inspirar la propuesta.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setImagenReferencia(null)}
                title="Quitar imagen"
                className="btn-sub rounded-full p-1.5 text-[#c2709c] transition hover:bg-[#fbe5f0] hover:text-[#a5146b]"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {avisoImagen && <p className="mt-2 text-xs font-semibold text-red-500">{avisoImagen}</p>}
        </div>
      </section>

      {/* ============ 02 · OBJETIVO ============ */}
      <section className="card mt-4 p-6 sm:p-8">
        <Kicker n="02" texto="Objetivo" />
        <h3 className="font-display text-lg font-bold text-[#2b2330]">¿Qué quieres lograr?</h3>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {OBJETIVOS.map((o) => {
            const activo = objetivo === o.value;
            return (
              <button
                key={o.value}
                type="button"
                title={o.hint}
                onClick={() => setObjetivo(o.value)}
                className={`btn-sub group relative inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  activo
                    ? "border-transparent bg-gradient-to-r from-[#a5146b] to-[#ec4899] text-white shadow-lg shadow-[#ec4899]/35 -translate-y-0.5"
                    : "border-[#f0dcec] bg-white text-[#8a4a6b] hover:-translate-y-0.5 hover:border-[#ec4899] hover:shadow-md hover:shadow-[#ec4899]/10"
                }`}
              >
                <o.Icon size={16} className={activo ? "text-white" : "text-[#a5146b]"} />
                {o.label}
                {activo && <Check size={14} className="opacity-90" />}
              </button>
            );
          })}
        </div>
        <p className="mt-2.5 text-xs text-[#b18b9d]">{obj?.hint}</p>
      </section>

      {/* ============ 03 · FORMATO ============ */}
      <section className="card mt-4 p-6 sm:p-8">
        <Kicker n="03" texto="Formato" />
        <h3 className="font-display text-lg font-bold text-[#2b2330]">¿Dónde lo publicamos?</h3>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {FORMATOS.map((f) => {
            const activo = formato === f.value;
            return (
              <button
                key={f.value}
                type="button"
                title={f.hint}
                onClick={() => setFormato(f.value)}
                className={`btn-sub group relative rounded-2xl border p-4 text-left transition-all duration-200 ${
                  activo
                    ? "border-transparent bg-gradient-to-br from-[#a5146b] to-[#ec4899] text-white shadow-lg shadow-[#ec4899]/30 -translate-y-1"
                    : "border-[#f0dcec] bg-white text-[#8a4a6b] hover:-translate-y-1 hover:border-[#ec4899] hover:shadow-lg hover:shadow-[#ec4899]/10"
                }`}
              >
                <span
                  className={`mb-2.5 flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                    activo ? "bg-white/20 text-white" : "bg-[#fbe5f0] text-[#a5146b]"
                  }`}
                >
                  <f.Icon size={20} />
                </span>
                <span className="flex items-center justify-between">
                  <span className="text-sm font-bold">{f.label}</span>
                  {activo && <Check size={14} className="opacity-90" />}
                </span>
                <span className={`mt-0.5 block text-[11px] ${activo ? "text-white/80" : "text-[#b18b9d]"}`}>
                  {f.hint}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ============ 04 · AUDIENCIA ============ */}
      <section className="card mt-4 p-6 sm:p-8">
        <Kicker n="04" texto="Audiencia" />
        <h3 className="font-display text-lg font-bold text-[#2b2330]">¿A quién le hablamos?</h3>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {AUDIENCIAS.map((a) => {
            const activo = audiencia === a.value;
            return (
              <button
                key={a.value}
                type="button"
                onClick={() => setAudiencia(a.value)}
                className={`btn-sub inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  activo
                    ? "border-transparent bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white shadow-md shadow-[#8b5cf6]/30 -translate-y-0.5"
                    : "border-[#f0dcec] bg-white text-[#6d4b8a] hover:-translate-y-0.5 hover:border-[#8b5cf6] hover:shadow-md"
                }`}
              >
                {a.label}
                {activo && <Check size={14} className="opacity-90" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* ============ 05 · AJUSTES OPCIONALES ============ */}
      <section className="card mt-4 overflow-hidden p-6 sm:p-8">
        <button
          type="button"
          onClick={() => setExtrasAbiertos((v) => !v)}
          className="flex w-full items-center justify-between gap-2 text-left"
        >
          <span className="inline-flex items-center gap-2">
          <span className="inline-flex h-5 items-center justify-center rounded-full bg-gradient-to-r from-[#a5146b] to-[#ec4899] px-2 text-[9px] font-bold text-white">
            05
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#c2709c]">Extras</span>
        </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f0dcec] bg-white px-3 py-1.5 text-xs font-bold text-[#8a3f6b]">
              <SlidersHorizontal size={13} />
              Ajustes opcionales
            </span>
            <ChevronDown size={16} className={`text-[#8a3f6b] transition-transform ${extrasAbiertos ? "rotate-180" : ""}`} />
          </span>
        </button>
        {extrasAbiertos && (
          <div className="space-y-4 border-t border-[#fbe9f4] pt-4" style={{ marginTop: "1rem" }}>
            <div>
              <label className={labelCls}>Notas extra (precio, promos, lugares…)</label>
              <textarea
                className={`${inputCls} min-h-[56px] resize-y`}
                placeholder="Precio, combo, envíos, contra entrega, colores…"
                value={datosOpcionales}
                onChange={(e) => setDatosOpcionales(e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Aparición de marca</label>
              <div className="flex flex-wrap gap-2">
                {NIVELES.map((n) => (
                  <button
                    key={n.value}
                    type="button"
                    onClick={() => setNivelMarca(n.value as GenerateRequest["nivelMarca"])}
                    className={`btn-sub rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
                      nivelMarca === n.value
                        ? "border-transparent bg-gradient-to-r from-[#a5146b] to-[#ec4899] text-white shadow-md shadow-[#ec4899]/30"
                        : "border-[#f0dcec] bg-white text-[#8a4a6b] hover:border-[#ec4899]"
                    }`}
                  >
                    {n.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelCls}>Duración deseada</label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {DURACIONES.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDuracion(d.value as GenerateRequest["duracion"])}
                    className={`btn-sub rounded-xl border px-3 py-2 text-xs font-bold transition ${
                      duracion === d.value
                        ? "border-transparent bg-gradient-to-r from-[#a5146b] to-[#ec4899] text-white shadow-md shadow-[#ec4899]/30"
                        : "border-[#f0dcec] bg-white text-[#8a4a6b] hover:border-[#ec4899]"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelCls}>Presencia en cámara</label>
              <select className={inputCls} value={presencia} onChange={(e) => setPresencia(e.target.value)}>
                {PRESENCIAS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </section>

      {modoEdicion && (
        <p className="mt-3 rounded-xl border border-[#8b5cf6]/40 bg-[#f3ebfe] px-4 py-2 text-xs font-bold text-[#6d4b8a]">
          Editando propuesta: ajusta lo que necesites y vuelve a generar.
        </p>
      )}

      {/* ============ CTA ============ */}
      <button
        type="submit"
        disabled={!puedeEnviar}
        className="btn-grad btn-sub group relative mt-5 inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl px-6 py-4.5 text-base font-extrabold text-white shadow-xl shadow-[#ec4899]/40 transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-[#ec4899]/50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-[#a5146b] via-[#ec4899] to-[#8b5cf6] opacity-90" />
        <span className="relative flex items-center gap-2.5">
          <Sparkles size={18} />
          {cargando ? "El cerebro está trabajando…" : modoEdicion ? "Actualizar propuesta" : "Generar propuesta"}
          {!cargando && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
        </span>
      </button>

      {ultimoResultado?.demo && (
        <p className="mt-3 text-center text-xs text-[#b18b9d]">
          Modo demo (sin OPENAI_API_KEY): las propuestas son ejemplos de calidad.
        </p>
      )}
    </form>
  );
}