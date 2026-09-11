import type { Evaluacion, GenerateRequest, Propuesta } from "./types";

function textoObjetivo(objetivo: string): string {
  switch (objetivo) {
    case "ensenar":
      return "Enseñar: dato útil para comprar sin miedo";
    case "entretener":
      return "Entretener: humor e identificación";
    case "conectar":
      return "Conectar / storytelling: historia con la que se identifican";
    case "viralidad":
      return "Viralidad: curiosidad + remate para compartir";
    default:
      return "Venta: deseo y conversión sin sonar a catálogo";
  }
}

function textoAudiencia(
  audiencia: GenerateRequest["audiencia"]
): string {
  switch (audiencia) {
    case "consumidoras":
      return "Consumidoras finales";
    case "minoristas":
      return "Minoristas: las que compran por unidades para revender";
    case "mayoristas":
      return "Mayoristas: compras por volumen y negocio";
    default:
      return "Ambas: para quien lo usa y para quien lo quiere vender";
  }
}

/**
 * Modo demo: responde con una propuesta de ejemplo de calidad cuando no hay
 * OPENAI_API_KEY, para que la interfaz se pueda probar sin backend de IA.
 */
export function propuestaDemo(req: GenerateRequest): Propuesta {
  const { objetivo, audiencia } = req;
  const objetivoTx = textoObjetivo(objetivo);
  const audienciaTx = textoAudiencia(audiencia);

  if (!req.idea.trim()) {
    return propuestaIdeaEnTendencia(objetivoTx, audienciaTx, audiencia);
  }
  return propuestaBolsos(objetivoTx, audienciaTx, audiencia);
}

function propuestaBolsos(
  objetivoTx: string,
  audienciaTx: string,
  audiencia: GenerateRequest["audiencia"]
): Propuesta {
  return {
    concepto:
      "Situación cotidiana: la mamá que sale 'por cinco minutos' y termina cargando la vida entera en un bolso. El video abre con humor e identificación, muestra cómo la nueva colección resuelve ese momento con estilo y cierra con el porqué vale la pena — sin sonar a catálogo.",
    objetivo: objetivoTx,
    audiencia: audienciaTx,
    pilar: "Entretenimiento + Ventas",
    anguloCreativo: "Situación cotidiana con giro de identificación",
    estructura: {
      nombre: "Hook → problema → tensión → solución → CTA",
      razon:
        "El problema ('no tengo bolso que aguante mi día') se identifica al instante; la tensión mantiene el ritmo y la solución —la colección nueva— entra de forma natural.",
    },
    hooks: [
      "O sea que nadie nos advirtió que el bolso se convierte en la maleta de viaje de toda la familia.",
      "Hay dos tipos de mujer: la que sale con bolso 'por si acaso' y la que sale con una factura de semáforo.",
      "Llevo 4 años buscando un bolso que aguante el 'ah, y también'.",
      "Ustedes dicen que no tienen bolso pa' ponerse, y yo: ¿y este qué es?",
      "Cuando el bolso pesa más que el plan, ahí es.",
      "POV: saliste por cinco minutos y terminaste cargando el desayuno, el mercado y las vainas de alguien más.",
      "La nueva colección llegó para los bolsos que por fin hacen juego con la vida real.",
    ],
    hookRecomendado:
      "O sea que nadie nos advirtió que el bolso se convierte en la maleta de viaje de toda la familia.",
    guion: `Miramos a cámara con una sonrisa de "aquí todos nos entendemos".

Empezamos con el bolso enorme sobre la mesa, un café al lado, y una cara de mujer real un domingo por la tarde.

— O sea que nadie nos advirtió que el bolso se convierte en la maleta de viaje de toda la familia —, decimos mientras metemos un cosmético, las llaves, un cuadernito y miramos al frente sin decir nada. Ese mini silencio es el patrón que rompe.

Abajo, en texto: "este es el momento más honesto de tu feed".

Pasamos la mano por el bolso de la nueva colección: material tejido claro, detalle dorado que se alcanza a ver.

— Miren, yo sé que el bolso "bonito" y el bolso "funcional" nunca se llevan bien — pausa — ...hasta hoy.

Hacemos el gesto de guardar el cosmético, la agenda y hasta un polvo suelto sin que se vea amontonado. Primer plano de la boca de la cartera cerrada con un clic.

— Todo tiene su lugar. Y lo nuevo es que dejó de pelear con el outfit.

Plano completo, giro cámara a un segundo bolso de la colección colgado en el maniquí: forma chiquita, más coqueta.

— Y para las rabietas de los domingos, este otro: pequeñito, perfecto, que no te rompe el look. Uno pa' la vida, otro pa' la fiesta.

Texto pantalla hacia el final: "Colección nuevos bolsos".

Cerramos mirando a cámara, con el bolso terciado:

— Y lo más lindo: llegan esta semana con envío a toda Colombia. El de la vida y el de la fiesta se van a quedar sin stock — sonrisa —, porque una siempre sabe cuándo un bolso le va a salvar el día.

CTA al pie, con el nombre de la tienda y el teléfono.`,
    storyboard: [
      {
        toma: "Toma 1",
        tiempo: "0:00–0:02",
        visual: "Cámara fija al escritorio: bolso grande, café, detalles",
        accion: "Se presenta la situación con humor antes de soltar el hook",
        voz: "— O sea que nadie nos advirtió que el bolso se convierte en la maleta de viaje de toda la familia —",
        textoPantalla: "este es el momento más honesto de tu feed",
        plano: "Plano medio, cámara fija",
      },
      {
        toma: "Toma 2",
        tiempo: "0:02–0:05",
        visual: "Mano pasa por el bolso: material tejido y detalle dorado",
        accion: "El bolso pasa a ser protagonista mientras se habla",
        voz: "— El bolso bonito y el bolso funcional nunca se llevaron bien... hasta hoy —",
        textoPantalla: "nueva colección",
        plano: "Primer plano del bolso / plano detalle",
      },
      {
        toma: "Toma 3",
        tiempo: "0:05–0:09",
        visual: "Guardando cosmético, agenda y accesorios dentro del bolso",
        accion: "Demostración de capacidad y orden, con el clic de la cartera",
        voz: "— Todo tiene su lugar. Y lo nuevo es que dejó de pelear con el outfit —",
        textoPantalla: "cabe todo y no se despeina",
        plano: "Contrapicado a 45°",
      },
      {
        toma: "Toma 4",
        tiempo: "0:09–0:15",
        visual: "Segundo bolso colgado en el maniquí: chiquito y coqueto",
        accion: "Giro de cámara mostrando la variante compacta de la colección",
        voz: "— Y para las rabietas de los domingos, este otro: uno pa' la vida, otro pa' la fiesta —",
        textoPantalla: "uno pa' la vida, otro pa' la fiesta",
        plano: "Plano entero",
      },
      {
        toma: "Toma 5",
        tiempo: "0:15–0:20",
        visual: "Bolso terciado en la creadora, mirando a cámara y sonriendo",
        accion: "Cierre con CTA; el producto va puesto, no en mano",
        voz: "— Llegan esta semana con envío a toda Colombia. El de la vida y el de la fiesta no se van a quedar solos —",
        textoPantalla: "Atenas Style Shop · pide por DM",
        plano: "Plano medio cerrado, sonrisa final",
      },
    ],
    textosPantalla: [
      "este es el momento más honesto de tu feed",
      "nueva colección",
      "cabe todo y no se despeina",
      "uno pa' la vida, otro pa' la fiesta",
      "Atenas Style Shop · pide por DM",
    ],
    cta: "Escribe 'BOLSOS' por DM o al WhatsApp y te pasamos precios y disponibles de la nueva colección. Envíos a toda Colombia.",
    caption: `O sea que nadie nos advirtió que el bolso se convierte en la maleta de viaje de toda la familia 😅

La nueva colección de bolsos llegó: el funcional que ya no pelea con el outfit, y el pequeño para los domingos.

📦 Envíos a toda Colombia
💬 Escríbenos 'BOLSOS' por DM o al WhatsApp para precios y disponibles

¿Cuál te llevarías: el de la vida o el de la fiesta? 👇`,
    portadas: [
      "El bolso que le aguanta a TOOOODO tu día 😅",
      "Nadie nos advirtió esto del bolso (y nadie más lo va a decir)",
      "Uno pa' la vida, otro pa' la fiesta ✨",
    ],
    audio: "Transición suave tipo risa/música alegre de fondo en el momento del clic de la cartera. Validar el audio de moda del momento antes de grabar.",
    variacionA:
      "Antes → después: bolso 'de mercado' desordenado vs el mismo día con la nueva colección; cierre con la comparación de looks y el clic de la cartera.",
    variacionB:
      "Comparación por criterio: '3 bolsos, 3 momentos' mostrando el mismo bolso con tres outfits distintos del día a la noche, con texto en pantalla de cuál se lleva cada momento.",
    serie:
      audiencia === "minoristas" || audiencia === "mayoristas" || audiencia === "ambas"
        ? "Serie 'Emprende con Atenas': por qué los bolsos son la entrada perfecta para empezar a revender → cómo armar el combo → precios, envío y contra entrega. Continuidad: la caja Atenas en cada entrega."
        : "Serie '¿Qué te llevas con…?': episodios cortos armando combinaciones de accesorios y bolsos con cada prenda. Continuidad: el cierre 'uno pa' la vida, otro pa' la fiesta'.",
  };
}

function propuestaIdeaEnTendencia(
  objetivoTx: string,
  audienciaTx: string,
  audiencia: GenerateRequest["audiencia"]
): Propuesta {
  return {
    concepto:
      "Idea eterna para moda/revenda: '¿Cuánto cuesta armar tu inventario de arranque y qué te llevas si empiezas hoy?' Un video que mezcla curiosidad, transparencia de negocio y ganas de comprar — la clase de contenido que las minoristas guardan y las mayoristas pasan a una amiga.",
    objetivo: objetivoTx,
    audiencia: audienciaTx,
    pilar: "Educación + Ventas",
    anguloCreativo: "Transparencia de negocio con educación de compra",
    estructura: {
      nombre: "Curiosidad → pistas → revelación → CTA",
      razon:
        "La pregunta del precio abre curiosidad; las pistas sostienen la retención; la revelación ('con $X arrancas tu inventario') genera deseo y el CTA cierra sin presión.",
    },
    hooks: [
      "¿Cuánto cuesta, en serio, armar tu inventario de arranque? Spoiler: menos de lo que gastas en un domingo.",
      "Si piensas que revender es caro… mejor mira esto antes de cerrar la app.",
      "Trabajo con tiendas y TODAS arrancan con la misma pregunta, esta es la respuesta honesta.",
      "El secreto del emprendimiento bonito: no empezar con 20 productos, empezar con los 5 que sí se venden.",
      "Cuando compras tu primer combo y por fin entiendes por qué tus clientas vuelven.",
      "POV: haces tu primera compra por mayor y te llega una caja que parece Navidad.",
      "Viste la tienda linda por fuera. Hoy te muestro con cuánto se arma la que está detrás.",
    ],
    hookRecomendado:
      "¿Cuánto cuesta, en serio, armar tu inventario de arranque? Spoiler: menos de lo que gastas en un domingo.",
    guion: `Abrimos llenas de energía, con la caja a medio abrir en la mesa, como si acabara de llegar.

— ¿Cuánto cuesta, en serio, armar tu inventario de arranque? — mirada directa a cámara — Spoiler: menos de lo que gastas en un domingo.

Mientras hablamos, sacamos tres productos de la caja y los ponemos frente a cámara, uno por uno, con calma.

— Esto no es magia, es comprar inteligente. Yo sé que la gente piensa que revender es carísimo, y por eso hoy te traigo la verdad: la entrada de Atenas.

Texto en pantalla: "lo que tienes que saber antes de tu primera compra".

Sacamos el catálogo o el papel con los combos. Hacemos el cálculo visible con marcador: 3 unidades de esto, 4 de aquello.

— No necesitas veinte productos. Necesitas los que tu gente te va a pedir tres veces seguidas.

Primer plano de las manos armando el primer "paquete" de venta: cómo se ve la unidad que tú le vendes, bonita y lista.

— Y lo lindo: eliges el combo, te llega a la casa, y tú pones tu precio. Así de simple.

Cerramos con la caja ya armada y el teléfono al lado:

— Si alguna vez has pensado '¿y si revendo pero no tengo idea?'… esta es tu señal. Escríbenos COMBOS por DM y te pasamos las opciones con precios y contra entrega.

Señala la pantalla con la sonrisa final.`,
    storyboard: [
      {
        toma: "Toma 1",
        tiempo: "0:00–0:03",
        visual: "Caja a medio abrir, cámara fija, energía alta",
        accion: "Hook directo a cámara con la caja delante",
        voz: "¿Cuánto cuesta, en serio, armar tu inventario de arranque? Spoiler: menos de lo que gastas en un domingo.",
        textoPantalla: "tu primera compra explicada",
        plano: "Plano medio, cámara fija",
      },
      {
        toma: "Toma 2",
        tiempo: "0:03–0:08",
        visual: "Mano sacando tres productos de la caja y poniéndolos en línea",
        accion: "Se muestra variedad real del combo",
        voz: "No es magia, es comprar inteligente. Te traigo la verdad de cómo se arranca en Atenas.",
        textoPantalla: "lo que tienes que saber antes de tu primera compra",
        plano: "Plano detalle / primer plano de manos",
      },
      {
        toma: "Toma 3",
        tiempo: "0:08–0:14",
        visual: "Papel con combos, marcador, cálculo visible",
        accion: "Se hace el cálculo de unidades y precio frente a cámara",
        voz: "No necesitas veinte productos. Necesitas los que tu gente te pide tres veces seguidas.",
        textoPantalla: "5 productos, no 20",
        plano: "Picado suave sobre la mesa",
      },
      {
        toma: "Toma 4",
        tiempo: "0:14–0:18",
        visual: "Manos armando el paquete de venta final: unidad bonita y lista",
        accion: "Se muestra cómo se vende lo recibido",
        voz: "Eliges el combo, te llega a la casa, y tú pones tu precio. Así de simple.",
        textoPantalla: "tú pones tu precio",
        plano: "Primer plano de manos",
      },
      {
        toma: "Toma 5",
        tiempo: "0:18–0:22",
        visual: "Caja armada y teléfono al lado; sonrisa final",
        accion: "Cierre con CTA directa y natural",
        voz: "Si alguna vez has pensado '¿y si revendo?', esta es tu señal. Escríbenos COMBOS por DM.",
        textoPantalla: "Atenas Style Shop · COMBOS por DM",
        plano: "Plano medio cerrado",
      },
    ],
    textosPantalla: [
      "tu primera compra explicada",
      "lo que tienes que saber antes de tu primera compra",
      "5 productos, no 20",
      "tú pones tu precio",
      "Atenas Style Shop · COMBOS por DM",
    ],
    cta:
      "Escribe 'COMBOS' por DM o al WhatsApp y te pasamos las opciones de inventario de arranque, precios por mayor y contra entrega. Envíos a toda Colombia.",
    caption: `Si has pensado "¿y si revendo pero no tengo ni idea?"… esta es tu señal ✨

Te explico con cuánto se arma un inventario de arranque en Atenas, qué combos convienen y cómo queda lista tu primera venta.

💰 Precios por mayor
📦 Envíos a toda Colombia
💬 Escríbenos 'COMBOS' por DM

¿Quién más está en modo "armar su tienda" este mes? 👇`,
    portadas: [
      "Cuánto cuesta (en serio) armar tu inventario de arranque",
      "No empieces con 20 productos, empieza con los 5 que sí se venden",
      "Tu primera compra por mayor, explicada de frente",
    ],
    audio: "Música alegre de fondo tipo 'nuevo emprendimiento', sin afirmar que es tendencia; validar el audio actual antes de grabar.",
    variacionA:
      "Antes/después de un inventario: mesa vacía al inicio vs la misma mesa con el combo armado y empaquetado para vender, con el cálculo del costo por unidad en pantalla.",
    variacionB:
      "ASMR de unboxing de mayorista: el sonido de abrir la caja, presentar cada producto y contar el margen aproximado del paquete, sin presionar con ventas.",
    serie:
      audiencia === "consumidoras"
        ? "Serie 'Detrás de la caja': episodios mostrando qué llega en pedidos reales a clientas, cómo empaquetamos y consejos para elegir bien."
        : "Serie 'Emprende con Atenas': episodio 1 — inventario de arranque; episodio 2 — cómo armar el combo; episodio 3 — precios, envío y contra entrega. Continuidad: la caja Atenas como elemento visual.",
  };
}

export function evaluacionDemo(): Evaluacion {
  return {
    fuerzaHook: 82,
    retencion: 78,
    originalidad: 74,
    identificacion: 86,
    marca: 84,
    claridad: 80,
    cta: 75,
    promedio: 80,
    comentarios: [
      "Hook excelente: abre con una situación que la audiencia colombiana reconoce al instante.",
      "El mini-silencio tras la frase funciona como pattern interrupt y sostiene la retención.",
      "Se evita la lista de tres; el cierre conecta con el CTA sin sonar a catálogo.",
      "Mantener un solo 'momento de venta' al final: suficiente para este objetivo.",
    ],
  };
}