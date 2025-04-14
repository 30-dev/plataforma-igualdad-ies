// funciones/dimensiones.js
import { https } from "firebase-functions";
import admin from "../config/firebase.js";
import { verificarUsuario } from "../middlewares/verificarUsuario.js"; // Importamos el middleware

import { setCORSHeaders } from "../helpers/cors.js";
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;

const db = admin.firestore();

export const obtenerPreguntasDimension = https.onRequest(async (req, res) => {
  setCORSHeaders(res, "GET");

  if (req.method === "OPTIONS") return res.status(204).send("");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      error: {
        message: "Falta el ID de la dimensión.",
        status: "INVALID_ARGUMENT",
      },
    });
  }

  try {
    const docRef = db.collection("dimensiones").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({
        error: {
          message: "Dimensión no encontrada.",
          status: "NOT_FOUND",
        },
      });
    }

    const data = docSnap.data();

    if (!data.preguntas || !Array.isArray(data.preguntas)) {
      return res.status(400).json({
        error: {
          message: "La dimensión no contiene preguntas válidas.",
          status: "INVALID_ARGUMENT",
        },
      });
    }

    return res.status(200).json({
      mensaje: "Dimensión obtenida correctamente.",
      dimension: {
        id: docSnap.id,
        nombre: data.nombre ?? null,
        descripcion: data.descripcion ?? null,
        icono: data.icono ?? null,
        objetivo: data.objetivo ?? null,
        orden: data.orden ?? null,
        preguntas: data.preguntas,
      },
    });
  } catch (error) {
    console.error("Error al obtener preguntas:", error);
    return res.status(500).json({
      error: {
        message: "Error interno al obtener preguntas de la dimensión.",
        status: "INTERNAL",
      },
    });
  }
});

export const guardarDimension = https.onRequest(async (req, res) => {
  setCORSHeaders(res, "GET");

  if (req.method === "OPTIONS") return res.status(204).send("");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { institucion_id, dimension_id, usuario_id, respuestas, preguntas } =
    req.body;

  if (
    !institucion_id ||
    !dimension_id ||
    !usuario_id ||
    !respuestas ||
    !preguntas
  ) {
    return res.status(400).json({
      error: {
        message: "Faltan campos obligatorios.",
        status: "INVALID_ARGUMENT",
      },
    });
  }

  // Filtrar solo las preguntas tipo radio
  const preguntasRadio = preguntas.filter((q) => q.tipo_respuesta === "radio");

  // Agrupar por subdimensión
  const resultadosPorSubdimension = {};
  const pendientes = [];

  for (const pregunta of preguntasRadio) {
    const { id, subdimension, pregunta: texto } = pregunta;
    const respuesta = respuestas[id];

    if (!respuesta) continue;

    if (!resultadosPorSubdimension[subdimension]) {
      resultadosPorSubdimension[subdimension] = {
        total: 0,
        si: 0,
      };
    }

    resultadosPorSubdimension[subdimension].total++;
    if (respuesta === "Si") {
      resultadosPorSubdimension[subdimension].si++;
    } else {
      pendientes.push({
        id,
        pregunta: texto,
        subdimension,
        valor: respuesta,
      });
    }
  }

  // Calcular el porcentaje de cumplimiento
  const cumplimiento = {};
  for (const [subdimension, valores] of Object.entries(
    resultadosPorSubdimension
  )) {
    const porcentaje = (valores.si / valores.total) * 100;
    cumplimiento[subdimension] = Math.round(porcentaje);
  }

  const payload = {
    institucion_id,
    dimension_id,
    usuario_id,
    respuestas,
    cumplimiento,
    pendientes,
    fecha: admin.firestore.FieldValue.serverTimestamp(),
  };

  try {
    await db
      .collection("respuestas")
      .doc(institucion_id)
      .set({ [dimension_id]: payload }, { merge: true });

    return res
      .status(200)
      .json({ mensaje: "Respuestas guardadas y analizadas correctamente." });
  } catch (error) {
    console.error("Error al guardar respuestas:", error);
    return res.status(500).json({
      error: {
        message: "Error interno al guardar las respuestas.",
        status: "INTERNAL",
      },
    });
  }
});

export const obtenerPreguntasConRespuestas = https.onRequest(
  async (req, res) => {
    setCORSHeaders(res, "GET");

    if (req.method === "OPTIONS") return res.status(204).send("");

    if (req.method !== "GET") {
      return res.status(405).json({ error: "Método no permitido" });
    }

    const { institucion_id, dimension } = req.query; // 👈 ahora solo esperamos el número

    if (!institucion_id || !dimension) {
      return res.status(400).json({
        error: {
          message: "Faltan el ID de la institución o el número de dimensión.",
          status: "INVALID_ARGUMENT",
        },
      });
    }

    // Construimos los IDs reales
    const dimensionDocId = `dimension_${dimension}`;
    // const campoRespuestas = `dimension-${dimension}`;

    try {
      // Obtener preguntas de la dimensión
      const dimensionDoc = await db
        .collection("dimensiones")
        .doc(dimensionDocId)
        .get();

      if (!dimensionDoc.exists) {
        return res.status(404).json({
          error: {
            message: `No se encontró la dimensión '${dimensionDocId}'.`,
            status: "NOT_FOUND",
          },
        });
      }

      const preguntas = dimensionDoc.data().preguntas || [];

      // Obtener respuestas de la institución
      const respuestasDoc = await db
        .collection("respuestas")
        .doc(institucion_id)
        .get();

      if (!respuestasDoc.exists) {
        return res.status(404).json({
          error: {
            message:
              "No se encontró el documento de respuestas para esta institución.",
            status: "NOT_FOUND",
          },
        });
      }

      const respuestasPorDimension = respuestasDoc.data()[dimensionDocId];

      if (!respuestasPorDimension || !respuestasPorDimension.respuestas) {
        return res.status(404).json({
          error: {
            message: `No se encontraron respuestas para la dimensión '${dimensionDocId}'.`,
            status: "NOT_FOUND",
          },
        });
      }

      const respuestas = respuestasPorDimension.respuestas;

      // Combinar preguntas con sus respuestas
      const preguntasConRespuestas = preguntas.map((pregunta) => ({
        ...pregunta,
        respuesta: respuestas[pregunta.id] ?? null,
      }));

      return res.status(200).json({
        mensaje: "Preguntas con respuestas obtenidas correctamente.",
        preguntas: preguntasConRespuestas,
      });
    } catch (error) {
      console.error("❌ Error al obtener preguntas con respuestas:", error);
      return res.status(500).json({
        error: {
          message: "Error interno al obtener preguntas con respuestas.",
          status: "INTERNAL",
        },
      });
    }
  }
);

export const guardarAutodiagnostico = https.onRequest(async (req, res) => {
  setCORSHeaders(res, "POST");

  if (req.method === "OPTIONS") return res.status(204).send("");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { institucion_id, usuario_id, respuestas, preguntas } = req.body;

  if (!institucion_id || !usuario_id || !respuestas || !preguntas) {
    return res.status(400).json({
      error: {
        message: "Faltan campos obligatorios.",
        status: "INVALID_ARGUMENT",
      },
    });
  }

  const respuestasConTexto = preguntas.map((pregunta) => {
    return {
      id: pregunta.id,
      texto: pregunta.pregunta,
      tipo: pregunta.tipoRespuesta,
      respuesta: respuestas[pregunta.id] ?? null,
    };
  });

  const payload = {
    institucion_id,
    usuario_id,
    respuestas: respuestasConTexto,
    fecha: admin.firestore.FieldValue.serverTimestamp(),
  };

  try {
    await db
      .collection("respuestas_autodiagnostico")
      .doc(institucion_id)
      .set(payload);
    return res
      .status(200)
      .json({ mensaje: "Autodiagnóstico guardado correctamente." });
  } catch (error) {
    console.error("Error al guardar autodiagnóstico:", error);
    return res.status(500).json({
      error: {
        message: "Error interno al guardar el autodiagnóstico.",
        status: "INTERNAL",
      },
    });
  }
});

export const responderEncuesta = https.onRequest(async (req, res) => {
  setCORSHeaders(res, "POST");

  if (req.method === "OPTIONS") return res.status(204).send("");
  if (req.method !== "POST")
    return res.status(405).json({ error: "Método no permitido" });

  const {
    encuesta_id,
    institucion_id,
    respuestas,
    preguntas,
    recaptcha_token,
  } = req.body;

  console.log("✅ Entrando a responderEncuesta");
  if (
    !encuesta_id ||
    !institucion_id ||
    !respuestas ||
    !preguntas ||
    !recaptcha_token
  ) {
    return res.status(400).json({
      error: {
        message: "Faltan campos obligatorios.",
        status: "INVALID_ARGUMENT",
      },
    });
  }

  // Validación reCAPTCHA
  if (!RECAPTCHA_SECRET) {
    console.error("❌ Clave secreta de reCAPTCHA no definida");
    return res.status(500).json({ error: "Falta clave secreta reCAPTCHA" });
  }

  try {
    const respuestaGoogle = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: RECAPTCHA_SECRET,
          response: recaptcha_token,
        }),
      }
    );

    const data = await respuestaGoogle.json();

    if (!data.success) {
      return res.status(403).json({
        error: {
          message: "Verificación reCAPTCHA fallida.",
          detalle: data,
          status: "PERMISSION_DENIED",
        },
      });
    }

    console.log("🟢 reCAPTCHA validado correctamente");
  } catch (error) {
    console.error("❌ Error al verificar reCAPTCHA:", error);
    return res.status(500).json({
      error: {
        message: "Error interno al verificar reCAPTCHA.",
        status: "INTERNAL",
      },
    });
  }

  // Guardar en Firestore
  const encuestaRef = db
    .collection("respuestas_encuestas")
    .doc(`${encuesta_id}_${institucion_id}`);

  try {
    const snapshot = await encuestaRef.get();
    const datosPrevios = snapshot.exists ? snapshot.data() : {};
    const preguntasPrevias = datosPrevios?.preguntas || {};
    const nuevasPreguntas = { ...preguntasPrevias };

    for (const pregunta of preguntas) {
      const { id, tipo, pregunta: texto, opciones = [] } = pregunta;
      const respuesta = respuestas[id];

      if (!id || !tipo || !texto) {
        console.warn(
          `⚠️ Pregunta inválida omitida. ID: ${id}, Tipo: ${tipo}, Texto: ${texto}`
        );
        continue;
      }

      if (respuesta === undefined || respuesta === null) continue;

      if (!nuevasPreguntas[id]) {
        nuevasPreguntas[id] = {
          texto,
          tipo,
          ...(tipo === "radio" ? { opciones: {} } : { respuestas: [] }),
        };

        if (tipo === "radio") {
          for (const opcion of opciones) {
            nuevasPreguntas[id].opciones[opcion] = 0;
          }
        }
      }

      if (tipo === "radio") {
        nuevasPreguntas[id].opciones[respuesta] =
          (nuevasPreguntas[id].opciones[respuesta] || 0) + 1;
      } else {
        if (!Array.isArray(nuevasPreguntas[id].respuestas)) {
          nuevasPreguntas[id].respuestas = [];
        }
        nuevasPreguntas[id].respuestas.push(respuesta);
      }
    }

    await encuestaRef.set({ preguntas: nuevasPreguntas }, { merge: true });
    console.log("✅ Respuestas guardadas correctamente");
    return res
      .status(200)
      .json({ mensaje: "Respuesta guardada correctamente." });
  } catch (error) {
    console.error("❌ Error al guardar la respuesta de la encuesta:", error);
    return res.status(500).json({
      error: {
        message: "Error interno al guardar la respuesta.",
        status: "INTERNAL",
      },
    });
  }
});

export const obtenerResultadosEncuesta = https.onRequest(async (req, res) => {
  setCORSHeaders(res, "GET");

  if (req.method === "OPTIONS") return res.status(204).send("");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { encuesta_id, institucion_id } = req.query;

  if (!encuesta_id || !institucion_id) {
    return res.status(400).json({
      error: {
        message: "Faltan parámetros obligatorios.",
        status: "INVALID_ARGUMENT",
      },
    });
  }

  try {
    const docId = `${encuesta_id}_${institucion_id}`;
    const ref = db.collection("respuestas_encuestas").doc(docId);
    const snapshot = await ref.get();

    if (!snapshot.exists || !snapshot.data()?.preguntas) {
      return res.status(404).json({
        error: {
          message: `No hay respuestas registradas para la encuesta "${encuesta_id}" de la institución "${institucion_id}".`,
          status: "NOT_FOUND",
        },
      });
    }

    return res.status(200).json({
      encuesta_id,
      institucion_id,
      preguntas: snapshot.data().preguntas,
    });
  } catch (error) {
    console.error("Error al obtener resultados:", error);
    return res.status(500).json({
      error: {
        message: "Error interno al obtener resultados.",
        status: "INTERNAL",
      },
    });
  }
});

export const obtenerEncuestaPorTipo = https.onRequest(async (req, res) => {
  setCORSHeaders(res, "GET");

  if (req.method === "OPTIONS") return res.status(204).send("");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { tipo } = req.query;

  if (!tipo || (tipo !== "estudiantes" && tipo !== "personal")) {
    return res.status(400).json({
      error: {
        message:
          "Tipo de encuesta inválido. Debe ser 'estudiantes' o 'personal'.",
        status: "INVALID_ARGUMENT",
      },
    });
  }

  try {
    const docRef = db.collection("encuestas").doc(tipo);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({
        error: {
          message: `No se encontró la encuesta para '${tipo}'.`,
          status: "NOT_FOUND",
        },
      });
    }

    const data = docSnap.data();

    if (!data.preguntas || !Array.isArray(data.preguntas)) {
      return res.status(400).json({
        error: {
          message: "La encuesta no contiene preguntas válidas.",
          status: "INVALID_ARGUMENT",
        },
      });
    }

    return res.status(200).json({
      mensaje: `Encuesta para ${tipo} obtenida correctamente.`,
      encuesta: {
        id: data.id ?? docSnap.id,
        nombre: data.nombre ?? null,
        descripcion: data.descripcion ?? null,
        dirigido: data.dirigido ?? null,
        preguntas: data.preguntas,
      },
    });
  } catch (error) {
    console.error("Error al obtener encuesta por tipo:", error);
    return res.status(500).json({
      error: {
        message: "Error interno al obtener la encuesta.",
        status: "INTERNAL",
      },
    });
  }
});

export const obtenerAutodiagnostico = https.onRequest(async (req, res) => {
  setCORSHeaders(res, "GET");

  if (req.method === "OPTIONS") return res.status(204).send("");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      error: {
        message: "Falta el ID de la institución.",
        status: "INVALID_ARGUMENT",
      },
    });
  }

  try {
    const docRef = db.collection("respuestas_autodiagnostico").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({
        error: {
          message: "No se encontró el autodiagnóstico para esta institución.",
          status: "NOT_FOUND",
        },
      });
    }

    return res.status(200).json({
      mensaje: "Autodiagnóstico recuperado correctamente.",
      autodiagnostico: docSnap.data(),
    });
  } catch (error) {
    console.error("Error al obtener autodiagnóstico:", error);
    return res.status(500).json({
      error: {
        message: "Error interno al obtener el autodiagnóstico.",
        status: "INTERNAL",
      },
    });
  }
});

export const obtenerPreguntasAutodiagnosticoParticipativo = https.onRequest(
  async (req, res) => {
    setCORSHeaders(res, "POST");

    if (req.method === "OPTIONS") return res.status(204).send("");

    if (req.method !== "GET") {
      return res.status(405).json({ error: "Método no permitido" });
    }

    try {
      const docRef = db
        .collection("autodiagnostico_participativo")
        .doc("cuestionario-autodiagnostico");
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        return res.status(404).json({
          error: {
            message: "No se encontró el cuestionario.",
            status: "NOT_FOUND",
          },
        });
      }

      const data = docSnap.data();

      if (!data.preguntas || !Array.isArray(data.preguntas)) {
        return res.status(400).json({
          error: {
            message: "No hay preguntas válidas en el cuestionario.",
            status: "INVALID_ARGUMENT",
          },
        });
      }

      return res.status(200).json({
        mensaje: "Preguntas del autodiagnóstico participativo obtenidas.",
        preguntas: data.preguntas,
      });
    } catch (error) {
      console.error("Error al obtener preguntas del autodiagnóstico:", error);
      return res.status(500).json({
        error: {
          message:
            "Error interno al obtener preguntas del autodiagnóstico participativo.",
          status: "INTERNAL",
        },
      });
    }
  }
);

export const obtenerPreguntasEncuestas = https.onRequest(async (req, res) => {
  setCORSHeaders(res, "GET");

  if (req.method === "OPTIONS") return res.status(204).send("");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const docRef = db.collection("encuestas").doc({});
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({
        error: {
          message: "Cuestionario no encontrado.",
          status: "NOT_FOUND",
        },
      });
    }

    const data = docSnap.data();

    if (!data.preguntas || !Array.isArray(data.preguntas)) {
      return res.status(400).json({
        error: {
          message: "No hay preguntas válidas en el cuestionario.",
          status: "INVALID_ARGUMENT",
        },
      });
    }

    return res.status(200).json({
      mensaje:
        "Preguntas del cuestionario de encuestas obtenidas correctamente.",
      preguntas: data.preguntas,
    });
  } catch (error) {
    console.error("Error al obtener preguntas de encuestas:", error);
    return res.status(500).json({
      error: {
        message: "Error interno al obtener las preguntas de encuestas.",
        status: "INTERNAL",
      },
    });
  }
});

export const obtenerDimensionesConEstado = https.onRequest(async (req, res) => {
  setCORSHeaders(res, "GET");

  if (req.method === "OPTIONS") return res.status(204).send("");
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const codigoInstitucion = req.query.codigo;
  if (!codigoInstitucion) {
    return res.status(400).json({ error: "Código de institución requerido" });
  }

  try {
    const dimensionesSnapshot = await db.collection("dimensiones").get();
    const dimensiones = [];

    // Obtener las respuestas de la institución
    const respuestasRef = db.collection("respuestas").doc(codigoInstitucion);
    const respuestasSnap = await respuestasRef.get();
    const respuestasData = respuestasSnap.exists ? respuestasSnap.data() : {};

    // Construimos la respuesta
    dimensionesSnapshot.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      const respondida = respuestasData.hasOwnProperty(id);

      dimensiones.push({
        id,
        ...data,
        respondida,
      });
    });

    return res.status(200).json({ dimensiones });
  } catch (error) {
    console.error("❌ Error al obtener dimensiones:", error);
    return res.status(500).json({ error: "Error al obtener las dimensiones" });
  }
});
