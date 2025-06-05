import { https } from "firebase-functions";
import admin from "firebase-admin";
import { setCORSHeaders } from "../helpers/cors.js";

export const obtenerReporteInstitucion = https.onRequest(async (req, res) => {
  setCORSHeaders(res, "GET");

  if (req.method === "OPTIONS") return res.status(204).send("");
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const institucion_id = req.query.id;
  if (!institucion_id) {
    return res.status(400).json({
      error: {
        message: "Falta el ID de la institución",
        status: "INVALID_ARGUMENT",
      },
    });
  }

  try {
    const docRef = admin
      .firestore()
      .collection("respuestas")
      .doc(institucion_id);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      return res.status(404).json({
        error: {
          message: "No se encontraron resultados para esta institución",
          status: "NOT_FOUND",
        },
      });
    }

    const data = snapshot.data();

    // Extraer campos de dimensión
    const reporte = Object.entries(data)
      .filter(([clave]) => clave.startsWith("dimension_"))
      .map(([id, contenido]) => ({ id, ...contenido }));

    // Extraer reporte global si existe
    const global = data.global || null;

    return res.status(200).json({ reporte, global });
  } catch (error) {
    console.error("❌ Error al obtener reporte institucional:", error);
    return res.status(500).json({
      error: {
        message: "Error interno al generar el reporte",
        status: "INTERNAL",
      },
    });
  }
});

export const generarReporteGlobal = https.onRequest(async (req, res) => {
  setCORSHeaders(res, "POST");

  if (req.method === "OPTIONS") return res.status(204).send("");
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { institucion_id } = req.body;
  if (!institucion_id) {
    return res.status(400).json({ error: "Falta el ID de la institución" });
  }

  try {
    const docRef = admin
      .firestore()
      .collection("respuestas")
      .doc(institucion_id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res
        .status(404)
        .json({ error: "No se encontraron respuestas para esta institución" });
    }

    const data = doc.data();
    const TOTAL_INDICADORES = 92;
    const META_INDICADORES = 73.6;

    const dimensionesRespondidas = Object.keys(data).filter((key) =>
      key.startsWith("dimension_")
    );
    if (dimensionesRespondidas.length < 9) {
      return res.status(403).json({
        error: "Faltan dimensiones por responder para generar el reporte",
      });
    }

    let totalSi = 0;
    const porcentajesPorDimension = [];
    const resumenPorSubdimension = [];

    for (const dimensionKey of dimensionesRespondidas) {
      const dimension = data[dimensionKey];
      let respuestas = dimension.respuestas || {};

      // 🔍 Asegura que sea un objeto plano
      if (Array.isArray(respuestas)) {
        respuestas = respuestas.reduce((acc, curr) => {
          acc[curr.id] = curr.valor || curr.respuesta || "";
          return acc;
        }, {});
      }

      console.log(
        `📥 Procesando ${dimensionKey} con ${
          Object.keys(respuestas).length
        } respuestas`
      );

      // 🔥 Obtenemos las preguntas reales desde el endpoint
      const response = await fetch(
        `https://obtenerpreguntasconrespuestas-34rbmbolyq-uc.a.run.app/?institucion_id=${institucion_id}&dimension=${dimensionKey}`
      );
      const json = await response.json();
      const preguntas = json.preguntas || [];

      // Calcula el número de "Sí"
      const siPorDimension = Object.entries(respuestas).filter(
        ([, v]) => v === "Si"
      ).length;
      totalSi += siPorDimension;

      porcentajesPorDimension.push({
        dimension: dimensionKey.replace("dimension_", "Dimensión "),
        porcentaje: preguntas.length
          ? Math.round((siPorDimension / preguntas.length) * 1000) / 10
          : 0,
      });

      const subdimensiones = {};

      for (const pregunta of preguntas) {
        const sub = pregunta.subdimension || "Sin subdimensión";

        let respuesta = respuestas[pregunta.id];

        // 🛡️ Validación por si es un objeto complejo
        if (typeof respuesta === "object") {
          console.warn(
            `⚠️ Respuesta de objeto no procesada en ${pregunta.id}`,
            respuesta
          );
          continue; // saltamos esta si es una tabla u objeto no compatible con este conteo
        }

        // ✨ Normalizamos texto
        respuesta =
          typeof respuesta === "string" ? respuesta.trim() : "No respuesta";

        if (!subdimensiones[sub]) {
          subdimensiones[sub] = {
            dimension: dimensionKey,
            subdimension: sub,
            total: 0,
            atendidos: 0,
            por_atender: 0,
          };
        }

        subdimensiones[sub].total += 1;

        if (respuesta === "Si") {
          subdimensiones[sub].atendidos += 1;
        } else if (respuesta === "Parcialmente" || respuesta === "No") {
          subdimensiones[sub].por_atender += 1;
        } else {
          console.warn(
            `⚠️ Respuesta inesperada: "${respuesta}" en la pregunta ${pregunta.id}`
          );
        }
      }

      for (const resumen of Object.values(subdimensiones)) {
        resumen.porcentaje =
          resumen.total > 0
            ? Math.round((resumen.atendidos / resumen.total) * 1000) / 10
            : 0;
        resumenPorSubdimension.push(resumen);
      }
    }

    const porcentajeTotal =
      Math.round((totalSi / TOTAL_INDICADORES) * 1000) / 10;
    const porcentajeMeta = Math.round((totalSi / META_INDICADORES) * 1000) / 10;

    const reporteGlobal = {
      resumenGlobal: {
        dimensiones_respondidas: dimensionesRespondidas.length,
        indicadores_totales: TOTAL_INDICADORES,
        meta: META_INDICADORES,
        indicadores_atendidos: totalSi,
        porcentaje_total: porcentajeTotal,
        porcentaje_meta: porcentajeMeta,
        cumple_meta: totalSi >= META_INDICADORES,
      },
      porcentajesPorDimension,
      resumenPorSubdimension,
      generado_en: new Date().toISOString(),
    };

    await docRef.set({ global: reporteGlobal }, { merge: true });

    return res.status(200).json(reporteGlobal);
  } catch (error) {
    console.error("❌ Error al generar reporte global:", error);
    return res
      .status(500)
      .json({ error: "Error interno al generar el reporte" });
  }
});
