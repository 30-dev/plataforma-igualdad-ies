// funciones/levantamiento_encuestas.js
import { https } from "firebase-functions";
import admin from "../config/firebase.js";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import { setCORSHeaders } from "../helpers/cors.js";

const db = admin.firestore();

//Funcion para obtener respuestas
export const obtenerInfoEncuestas = https.onRequest(async (req, res) => {
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
    const docRef = db.collection("levantamiento_encuestas").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({
        error: {
          message: "No se encontraron encuestas para esta institución.",
          status: "NOT_FOUND",
        },
      });
    }

    return res.status(200).json({
      mensaje: "Encuestas recuperadas correctamente.",
      encuestas: docSnap.data(),
    });
  } catch (error) {
    console.error("Error al obtener encuestas:", error);
    return res.status(500).json({
      error: {
        message: "Error interno al obtener las encuestas.",
        status: "INTERNAL",
      },
    });
  }
});

export const levantarEncuestas = https.onRequest(async (req, res) => {
  setCORSHeaders(res, "POST");

  if (req.method === "OPTIONS") return res.status(204).send("");
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { institucion_id, fecha_inicio, fecha_limite } = req.body;

  if (!institucion_id || !fecha_inicio || !fecha_limite) {
    return res.status(400).json({
      error: {
        message: "Faltan campos obligatorios.",
        status: "INVALID_ARGUMENT",
      },
    });
  }

  try {
    // ✅ Generar tokens únicos
    const tokenEstudiantes = uuidv4();
    const tokenPersonal = uuidv4();

    const enlaceEstudiantes = `https://igualdad-ies.web.app/encuestas?tipo=estudiantes&token=${tokenEstudiantes}`;
    const enlacePersonal = `https://igualdad-ies.web.app/encuestas?tipo=personal&token=${tokenPersonal}`;

    const qrCodeEstudiantes = await QRCode.toDataURL(enlaceEstudiantes);
    const qrCodePersonal = await QRCode.toDataURL(enlacePersonal);

    const encuestaEstudiantes = {
      institucion_id,
      token: tokenEstudiantes,
      enlace: enlaceEstudiantes,
      fecha_inicio,
      fecha_limite,
      estado: "activo",
      qr_code: qrCodeEstudiantes,
      fecha_creacion: admin.firestore.FieldValue.serverTimestamp(),
    };

    const encuestaPersonal = {
      institucion_id,
      token: tokenPersonal,
      enlace: enlacePersonal,
      fecha_inicio,
      fecha_limite,
      estado: "activo",
      qr_code: qrCodePersonal,
      fecha_creacion: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("levantamiento_encuestas").doc(institucion_id).set(
      {
        estudiantes: encuestaEstudiantes,
        personal: encuestaPersonal,
      },
      { merge: true }
    );

    // ✅ También guardar tokens como referencia para consulta por token
    await db.collection("tokens_encuestas").doc(tokenEstudiantes).set({
      institucion_id,
      tipo: "estudiantes",
    });
    await db.collection("tokens_encuestas").doc(tokenPersonal).set({
      institucion_id,
      tipo: "personal",
    });

    return res.status(200).json({
      mensaje: "Encuestas levantadas correctamente.",
      encuestas: {
        estudiantes: {
          enlace: enlaceEstudiantes,
          qr_code: qrCodeEstudiantes,
        },
        personal: {
          enlace: enlacePersonal,
          qr_code: qrCodePersonal,
        },
      },
    });
  } catch (error) {
    console.error("Error al levantar las encuestas:", error);
    return res.status(500).json({
      error: {
        message: "Error interno al levantar las encuestas.",
        status: "INTERNAL",
      },
    });
  }
});

export const obtenerEncuestaPorToken = https.onRequest(async (req, res) => {
  setCORSHeaders(res, "GET");

  if (req.method === "OPTIONS") return res.status(204).send("");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const token = req.query.token;

  if (!token || typeof token !== "string") {
    return res.status(400).json({
      error: {
        message: "Token no proporcionado o inválido.",
        status: "INVALID_ARGUMENT",
      },
    });
  }

  try {
    const snapshot = await db.collection("tokens_encuestas").doc(token).get();

    if (!snapshot.exists) {
      return res.status(404).json({
        error: {
          message: "Token no encontrado.",
          status: "NOT_FOUND",
        },
      });
    }

    const data = snapshot.data();

    return res.status(200).json({
      mensaje: "Encuesta encontrada.",
      institucion_id: data.institucion_id,
      tipo: data.tipo, // "estudiantes" o "personal"
    });
  } catch (error) {
    console.error("Error al obtener encuesta por token:", error);
    return res.status(500).json({
      error: {
        message: "Error interno al buscar encuesta.",
        status: "INTERNAL",
      },
    });
  }
});
