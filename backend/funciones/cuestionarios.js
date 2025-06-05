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

  const { id, resumen } = req.query;

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

    if (resumen === "true") {
      return res.status(200).json({
        mensaje: "Resumen de dimensión obtenido correctamente.",
        dimension: {
          id: docSnap.id,
          nombre: data.nombre ?? null,
          descripcion: data.descripcion ?? null,
          icono: data.icono ?? null,
          objetivo: data.objetivo ?? null,
          orden: data.orden ?? null,
        },
      });
    }

    if (!data.preguntas || !Array.isArray(data.preguntas)) {
      return res.status(400).json({
        error: {
          message: "La dimensión no contiene preguntas válidas.",
          status: "INVALID_ARGUMENT",
        },
      });
    }

    // ✅ Si es dimension_4 y existe composicion_genero, agregarlo al resultado
    const responseData = {
      id: docSnap.id,
      nombre: data.nombre ?? null,
      descripcion: data.descripcion ?? null,
      icono: data.icono ?? null,
      objetivo: data.objetivo ?? null,
      orden: data.orden ?? null,
      preguntas: data.preguntas,
    };

    if (id === "dimension_4" && Array.isArray(data.composicion_genero)) {
      responseData["composicion_genero"] = data.composicion_genero;
    }

    return res.status(200).json({
      mensaje: "Dimensión obtenida correctamente.",
      dimension: responseData,
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
  setCORSHeaders(res, "POST");

  if (req.method === "OPTIONS") return res.status(204).send("");
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const {
    institucion_id,
    dimension_id,
    usuario_id,
    respuestas,
    preguntas,
    brecha_salarial,
  } = req.body;

  if (
    !institucion_id ||
    !dimension_id ||
    !usuario_id ||
    !respuestas ||
    !Array.isArray(preguntas) ||
    preguntas.length === 0
  ) {
    return res.status(400).json({
      error: { message: "Faltan campos obligatorios o preguntas vacías." },
    });
  }

  try {
    const docRef = db.collection("respuestas").doc(institucion_id);

    const respuestasNormales = Object.entries(respuestas).map(
      ([id, valor]) => ({
        id,
        valor,
      })
    );

    const dataGuardar = {
      respuestas: respuestasNormales,
    };

    // 🔍 Cálculo de pendientes
    const pendientes = [];

    preguntas.forEach((pregunta) => {
      const valor = respuestas[pregunta.id];

      if (valor !== "Si" && pregunta.tipo_respuesta === "radio") {
        pendientes.push({
          id: pregunta.id,
          pregunta: pregunta.pregunta,
          subdimension: pregunta.subdimension || "Sin subdimensión",
          valor,
        });
      }
    });

    dataGuardar.pendientes = pendientes;
    console.log("🟡 Pendientes generados:", pendientes);

    // 📊 Cálculo de cumplimiento por subdimensión
    const subdimensiones = {};
    preguntas.forEach((pregunta) => {
      const sub = pregunta.subdimension || "Sin subdimensión";
      const valor = respuestas[pregunta.id];

      if (!subdimensiones[sub]) {
        subdimensiones[sub] = {
          total: 0,
          si: 0,
        };
      }

      subdimensiones[sub].total++;
      if (valor === "Si") {
        subdimensiones[sub].si++;
      }
    });

    const cumplimiento = {};
    for (const [sub, valores] of Object.entries(subdimensiones)) {
      const porcentaje = Math.round((valores.si / valores.total) * 100);
      cumplimiento[sub] = porcentaje;
    }

    dataGuardar.cumplimiento = cumplimiento;
    console.log("✅ Cumplimiento por subdimensión:", cumplimiento);

    // 📌 Cálculo de cumplimiento general
    const valoresCumplimiento = Object.values(cumplimiento);
    const promedioGeneral = Math.round(
      valoresCumplimiento.reduce((acc, val) => acc + val, 0) /
        valoresCumplimiento.length
    );

    dataGuardar.cumplimientoGeneral = promedioGeneral;
    console.log("🌟 Cumplimiento general:", promedioGeneral);

    // 🔍 Tabla salarial para dimensión 5
    if (dimension_id === "dimension_5" && Array.isArray(brecha_salarial)) {
      const resumenBrecha = brecha_salarial.map((fila) => {
        const hombres = Number(fila.hombres) || 0;
        const mujeres = Number(fila.mujeres) || 0;
        const brecha = mujeres - hombres;

        return {
          categoria: fila.categoria,
          hombres,
          mujeres,
          brecha,
        };
      });

      dataGuardar.brecha_salarial_resultado = resumenBrecha;

      const total = resumenBrecha.length;
      const conBrecha = resumenBrecha.filter((item) => item.brecha < 0);
      const promedioBrecha = Math.round(
        resumenBrecha.reduce((acc, curr) => acc + curr.brecha, 0) / total
      );

      const promedioHombres = Math.round(
        resumenBrecha.reduce((acc, curr) => acc + curr.hombres, 0) / total
      );

      const promedioMujeres = Math.round(
        resumenBrecha.reduce((acc, curr) => acc + curr.mujeres, 0) / total
      );

      dataGuardar.calculos = {
        categorias_con_brecha: conBrecha.length,
        porcentaje_con_brecha: Math.round((conBrecha.length / total) * 100),
        promedio_brecha: promedioBrecha,
        promedio_hombres: promedioHombres,
        promedio_mujeres: promedioMujeres,
      };

      console.log("📈 Cálculos brecha salarial:", dataGuardar.calculos);
    }

    await docRef.set({ [dimension_id]: dataGuardar }, { merge: true });

    return res.status(200).json({
      message: "Respuestas, pendientes y cumplimiento guardados correctamente.",
    });
  } catch (error) {
    console.error("❌ Error al guardar dimensión:", error);
    return res.status(500).json({ error: "Error al guardar la dimensión." });
  }
});

export const obtenerPreguntasConRespuestas = https.onRequest(
  async (req, res) => {
    setCORSHeaders(res, "GET");

    if (req.method === "OPTIONS") return res.status(204).send("");
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Método no permitido" });
    }

    const { institucion_id, dimension } = req.query;
    const dimensionDocId = `dimension_${dimension}`;

    if (!institucion_id || !dimension) {
      return res.status(400).json({
        error: {
          message: "Faltan el ID de la institución o el número de dimensión.",
          status: "INVALID_ARGUMENT",
        },
      });
    }

    try {
      // 🔍 Obtener preguntas de la dimensión (incluyendo composición)
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

      const data = dimensionDoc.data();
      const preguntasBase = data.preguntas || [];
      const preguntasComposicion =
        data.composicion_genero || data.composicion_genero_preguntas || [];
      const preguntas = [...preguntasBase, ...preguntasComposicion];

      // 📥 Obtener respuestas de la institución
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
      const composicionGenero = respuestasPorDimension.composicion_genero || {};

      let mapaRespuestas = {};

      if (Array.isArray(respuestas)) {
        mapaRespuestas = Object.fromEntries(
          respuestas.map((r) => [r.id, r.valor])
        );
      } else if (typeof respuestas === "object" && respuestas !== null) {
        mapaRespuestas = respuestas;
      } else {
        console.warn("⚠️ Formato inesperado en respuestas:", respuestas);
        return res.status(500).json({
          error: {
            message: "Formato inesperado en el campo 'respuestas'.",
            status: "INVALID_FORMAT",
          },
        });
      }

      // 🧩 Combinar preguntas y respuestas (normales y de composición)
      const preguntasConRespuestas = preguntas.map((pregunta) => {
        if (
          pregunta.tipo_respuesta === "composicion_sencilla" ||
          pregunta.tipo_respuesta === "composicion_multiple"
        ) {
          return {
            ...pregunta,
            respuesta: composicionGenero[pregunta.id] ?? null,
          };
        }

        return {
          ...pregunta,
          respuesta: mapaRespuestas[pregunta.id] ?? null,
        };
      });

      return res.status(200).json({
        mensaje: "Preguntas con respuestas obtenidas correctamente.",
        preguntas: preguntasConRespuestas,
      });
    } catch (error) {
      console.error("❌ Error al obtener preguntas con respuestas:", error);
      return res.status(500).json({
        error: {
          message:
            error.message ||
            "Error interno al obtener preguntas con respuestas.",
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
