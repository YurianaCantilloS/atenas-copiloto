import type { Prisma } from "@prisma/client";
import { getClient } from "./openai";
import { generarPropuesta, revisarPropuesta } from "./generator";
import { evaluar } from "./evaluator";
import { getMemoria } from "./memory";
import { propuestaDemo, evaluacionDemo } from "./mock";
import { promedioEvaluacion } from "./schemas";
import { prisma } from "../db";
import type {
  Evaluacion,
  GenerateRequest,
  Propuesta,
  ResultadoGeneracion,
} from "./types";

const UMBRAL = 65;

function aJson<T>(valor: T): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(valor));
}

async function guardarContenido(
  request: GenerateRequest,
  propuesta: Propuesta,
  evaluacion: Evaluacion,
  revisada: boolean,
  demo: boolean
): Promise<string> {
  const post = await prisma.contentPost.create({
    data: {
      request: request.idea || "Sin idea: la IA propone una en tendencia",
      objetivo: propuesta.objetivo,
      objetivoClave: request.objetivo,
      audiencia: propuesta.audiencia,
      formato: request.formato,
      productoId: null,
      productoNombre: null,
      concepto: propuesta.concepto,
      pilar: propuesta.pilar,
      anguloCreativo: propuesta.anguloCreativo,
      estructura: propuesta.estructura.nombre,
      hook: propuesta.hookRecomendado,
      hooks: propuesta.hooks,
      cta: propuesta.cta,
      caption: propuesta.caption,
      storyboard: aJson(propuesta.storyboard),
      serie: propuesta.serie || null,
      resultadoRaw: aJson({
        propuesta,
        evaluacion,
        revisada,
        demo,
      }),
    },
  });
  return post.id;
}

export async function generarContenido(
  request: GenerateRequest
): Promise<ResultadoGeneracion> {
  const client = getClient();

  if (!client) {
    const propuesta = propuestaDemo(request);
    const evaluacion = evaluacionDemo();
    const contenidoId = await guardarContenido(request, propuesta, evaluacion, false, true);
    return {
      propuesta,
      evaluacion,
      revisada: false,
      demo: true,
      contenidoId,
    };
  }

  const memoria = await getMemoria(60);

  let propuesta: Propuesta;
  let evaluacion: Evaluacion;
  let revisada = false;

  propuesta = await generarPropuesta(client, request, memoria);
  evaluacion = await evaluar(client, request, propuesta);

  if (promedioEvaluacion(evaluacion) < UMBRAL) {
    propuesta = await revisarPropuesta(client, request, memoria, propuesta, {
      comentarios: evaluacion.comentarios,
      promedio: evaluacion.promedio,
    });
    evaluacion = await evaluar(client, request, propuesta);
    revisada = true;
  }

  const contenidoId = await guardarContenido(
    request,
    propuesta,
    evaluacion,
    revisada,
    false
  );

  return { propuesta, evaluacion, revisada, demo: false, contenidoId };
}