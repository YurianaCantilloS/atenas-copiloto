"use client";

import { useEffect, useState } from "react";
import { Brain, FileText, Sparkle } from "lucide-react";

const PENSAMIENTOS = [
  "hook",
  "carrusel",
  "storytelling",
  "trending",
  "venta",
  "unboxing",
  "captions",
  "guion",
  "viral",
  "estreno",
];

const MENSAJES = [
  "El cerebro está buscando el gancho perfecto…",
  "Pensando algo que las haga decir «eso me pasó»…",
  "Trazando el mapa del contenido mientras el café enfría…",
  "Cazando la idea en tendencia que sí le sirve a Atenas…",
  "Estilizando las frases para que no suenen a catálogo…",
  "Recordando qué estructuras ya le funcionaron a tu marca…",
  "Casi listo, la propuesta está tomando forma…",
];

type Chip = {
  palabra: string;
  style: React.CSSProperties;
  tono: "rosa" | "lila" | "durazno";
};

const CHIPS: Chip[] = [
  { palabra: "hook", style: { left: "4%", top: "10%" }, tono: "rosa" },
  { palabra: "trending", style: { right: "5%", top: "14%" }, tono: "lila" },
  { palabra: "storytelling", style: { left: "7%", top: "52%" }, tono: "durazno" },
  { palabra: "venta", style: { right: "7%", top: "56%" }, tono: "rosa" },
  { palabra: "unboxing", style: { left: "16%", bottom: "7%" }, tono: "lila" },
  { palabra: "carrusel", style: { right: "18%", bottom: "9%" }, tono: "durazno" },
  { palabra: "viral", style: { left: "70%", top: "2%" }, tono: "lila" },
  { palabra: "estreno", style: { left: "2%", top: "30%" }, tono: "rosa" },
];

const TONO_CHIP: Record<Chip["tono"], string> = {
  rosa: "border-[#f6d4e7] bg-[#fbe5f0] text-[#a5146b]",
  lila: "border-[#ddd2f5] bg-[#ece0fa] text-[#6d4b8a]",
  durazno: "border-[#f8e0c8] bg-[#ffefdd] text-[#a2603f]",
};

export default function CreativeBrain() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % MENSAJES.length), 1700);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="card fade-up pop-in relative flex min-h-[420px] flex-col items-center justify-center overflow-hidden p-8 sm:p-10">
      {/* Fondos suaves */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#fbe5f0] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-[#ece0fa] blur-3xl"
        aria-hidden
      />

      {/* Palabras pensadas siempre visibles, flotando */}
      {CHIPS.map((c, idx) => (
        <span
          key={c.palabra}
          className={`floaty absolute z-10 rounded-full border px-3 py-1.5 text-xs font-bold shadow-sm ${TONO_CHIP[c.tono]}`}
          style={{ ...c.style, animationDelay: `${idx * 0.35}s` }}
        >
          {c.palabra}
        </span>
      ))}

      {/* Escenario central del cerebro */}
      <div className="relative flex h-72 w-72 items-center justify-center">
        {/* Órbitas girando */}
        <div className="spin-slow absolute inset-0 rounded-full border-2 border-dashed border-[#ec4899]/25">
          <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-[#ec4899]" />
          <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#8b5cf6]" />
        </div>
        <div
          className="spin-reverse absolute inset-3 rounded-full border border-[#a5146b]/15"
          style={{ animationDuration: "11s" }}
        >
          <span className="absolute right-2 top-6 text-[#8b5cf6]">
            <Sparkle size={13} fill="currentColor" />
          </span>
          <span className="absolute bottom-8 left-1 text-[#ec4899]">
            <Sparkle size={10} fill="currentColor" />
          </span>
        </div>

        {/* Anillos de pulso */}
        <div className="brain-ring inset-2" />
        <div className="brain-ring inset-5" style={{ animationDelay: "1.2s", borderColor: "rgba(139,92,246,0.35)" }} />
        <div className="brain-ring inset-8" style={{ animationDelay: "0.6s", borderColor: "rgba(236,114,153,0.3)" }} />

        {/* Núcleo */}
        <div className="brain-core flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-[#fff3f9] via-[#fbe5f0] to-[#e7ddfc] shadow-[0_24px_55px_-20px_rgba(236,72,153,0.75)] ring-8 ring-white/70">
          <Brain size={60} strokeWidth={1.3} className="text-[#a5146b]" />
        </div>
      </div>

      {/* Estado */}
      <div className="relative z-10 mt-4 flex flex-col items-center gap-3 text-center">
        <div className="h-1.5 w-44 overflow-hidden rounded-full bg-[#f3e0ec]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#a5146b] to-[#8b5cf6]"
            style={{ width: `${((i + 1) / MENSAJES.length) * 100}%`, transition: "width 0.5s ease" }}
          />
        </div>
        <p className="font-display max-w-md text-lg font-semibold italic text-[#4c2a43]">{MENSAJES[i]}</p>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#f3cfe6] bg-white/95 px-4 py-1.5 text-xs font-bold text-[#a5146b] shadow-sm">
          <FileText size={14} className="animate-bounce" />
          Produciendo tu documento…
        </div>
      </div>
    </div>
  );
}