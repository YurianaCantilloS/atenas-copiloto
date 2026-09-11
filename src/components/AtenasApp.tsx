"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BarChart3, Clock, Sparkle, Sparkles } from "lucide-react";
import BrainLogo from "./BrainLogo";
import GeneratorForm from "./GeneratorForm";
import ResultView from "./ResultView";
import HistoryPanel from "./HistoryPanel";
import MetricsPanel from "./MetricsPanel";
import CreativeBrain from "./CreativeBrain";
import { api, type GenerateRequest, type HistorialItem, type ResultadoGeneracion } from "@/lib/client";

type Tab = "nueva" | "historial" | "metricas";

function DecoracionFondo() {
  return (
    <div className="bg-decor" aria-hidden>
      <div className="blob blob--rosa" />
      <div className="blob blob--violeta" />
      <div className="blob blob--durazno" />
      <div className="blob blob--capuchino" />
      <span className="stella" style={{ left: "6%", top: "14%", fontSize: 22 }}>
        <Sparkles size={22} />
      </span>
      <span className="stella" style={{ left: "88%", top: "10%", fontSize: 18, animationDelay: "0.8s" }}>
        <Sparkle size={18} />
      </span>
      <span className="stella" style={{ left: "78%", top: "72%", fontSize: 20, animationDelay: "1.4s" }}>
        <Sparkles size={20} />
      </span>
      <span className="stella" style={{ left: "14%", top: "80%", fontSize: 16, animationDelay: "2s" }}>
        <Sparkle size={16} />
      </span>
      <span className="stella" style={{ left: "48%", top: "6%", fontSize: 14, animationDelay: "0.4s" }}>
        <Sparkles size={14} />
      </span>
    </div>
  );
}

export default function AtenasApp() {
  const [tab, setTab] = useState<Tab>("nueva");
  const [resultado, setResultado] = useState<ResultadoGeneracion | null>(null);
  const [ultimaSolicitud, setUltimaSolicitud] = useState<GenerateRequest | null>(null);
  const [cargando, setCargando] = useState(false);
  const [editando, setEditando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [historialKey, setHistorialKey] = useState(0);
  const [modoDemo, setModoDemo] = useState(false);
  const resultadoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const hist = await api<HistorialItem[]>("/api/history");
        setHistorial(hist);
      } catch {
        setHistorial([]);
      }
    };
    cargar();
  }, [historialKey]);

  useEffect(() => {
    if (resultado && !cargando) {
      resultadoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [resultado, cargando]);

  const generar = useCallback(async (req: GenerateRequest) => {
    setCargando(true);
    setError(null);
    setEditando(false);
    try {
      const res = await api<ResultadoGeneracion>("/api/generate", {
        method: "POST",
        body: JSON.stringify(req),
      });
      setResultado(res);
      setUltimaSolicitud(req);
      setModoDemo(Boolean(res.demo));
      setHistorialKey((k) => k + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo generar el contenido.");
    } finally {
      setCargando(false);
    }
  }, []);

  const nuevaIdea = useCallback(() => {
    setResultado(null);
    setEditando(false);
    setError(null);
  }, []);

  const editar = useCallback(() => {
    setEditando(true);
    setError(null);
  }, []);

  const generarOtra = useCallback(() => {
    if (ultimaSolicitud) generar({ ...ultimaSolicitud });
  }, [ultimaSolicitud, generar]);

  const tabs: { id: Tab; label: string; Icon: typeof Sparkles }[] = [
    { id: "nueva", label: "Nueva idea", Icon: Sparkles },
    { id: "historial", label: "Historial", Icon: Clock },
    { id: "metricas", label: "Métricas", Icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen">
      <DecoracionFondo />
      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6">
        {/* Marca centrada con logo de cerebro IA */}
        <header className="mb-8 flex flex-col items-center gap-4 text-center">
          <BrainLogo size="lg" />
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.25em] text-[#c2709c]">
              Atenas Style Shop
            </p>
            <h1 className="shimmer-text text-3xl font-extrabold tracking-tight sm:text-4xl">
              Copiloto creativo
            </h1>
            <p className="mx-auto mt-1 max-w-md text-sm text-[#96718a]">
              Ideas, hooks y guiones con voz humana para tu tienda — sin sonar a catálogo.
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            {modoDemo && (
              <span className="chip" title="No hay OPENAI_API_KEY configurada">
                <Sparkles size={12} />
                Modo demo
              </span>
            )}
            <nav className="flex rounded-full border border-[#f3cfe6] bg-white/80 p-1 shadow-sm backdrop-blur">
              {tabs.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`btn-sub inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold ${
                    tab === id
                      ? "bg-gradient-to-r from-[#a5146b] to-[#ec4899] text-white shadow-md shadow-[#ec4899]/30"
                      : "text-[#8a3f6b] hover:bg-[#fbe5f0] hover:text-[#a5146b]"
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </header>

        <main>
          {tab === "nueva" && (
            <div className="mx-auto max-w-3xl space-y-6">
              {error && (
                <div className="card fade-up border-red-200 bg-red-50/90 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              {cargando ? (
                <CreativeBrain />
              ) : resultado && !editando ? (
                <div ref={resultadoRef}>
                  <ResultView
                    resultado={resultado}
                    onGenerarOtra={generarOtra}
                    onNuevaIdea={nuevaIdea}
                    onEditar={editar}
                  />
                </div>
              ) : (
                <GeneratorForm
                  key={editando ? "editar" : "nueva"}
                  onGenerar={generar}
                  cargando={cargando}
                  ultimoResultado={resultado}
                  solicitudInicial={editando ? ultimaSolicitud : null}
                  modoEdicion={editando}
                />
              )}
            </div>
          )}

          {tab === "historial" && (
            <HistoryPanel items={historial} onCambio={() => setHistorialKey((k) => k + 1)} />
          )}

          {tab === "metricas" && <MetricsPanel items={historial} />}
        </main>
      </div>
    </div>
  );
}