// funciones/instituciones.js
import { onRequest } from "firebase-functions/v2/https";
import admin from "../config/firebase.js";
import { setCORSHeaders } from "../helpers/cors.js";

const db = admin.firestore();

function generarCodigoAlfanumerico(longitud = 4) {
  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let codigo = "";
  for (let i = 0; i < longitud; i++) {
    const randomIndex = Math.floor(Math.random() * caracteres.length);
    codigo += caracteres[randomIndex];
  }
  return codigo;
}

// Crear institución
export const crearInstitucion = onRequest(async (req, res) => {
  setCORSHeaders(res, "POST");

  if (req.method === "OPTIONS") return res.status(204).send("");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const {
    nombre,
    email_contacto,
    ubicacion,
    encuestas = [],
    usuarios = [],
  } = req.body;

  if (!nombre || !email_contacto || !ubicacion?.ciudad || !ubicacion?.estado) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const baseId = nombre.trim().substring(0, 3).toUpperCase();
  const codigo = `${baseId}-${generarCodigoAlfanumerico()}`;

  const nuevaInstitucion = {
    nombre,
    email_contacto,
    estado: "activo",
    ubicacion,
    encuestas,
    usuarios,
    creada: admin.firestore.FieldValue.serverTimestamp(),
  };

  try {
    await db.collection("instituciones").doc(codigo).set(nuevaInstitucion);

    return res.status(200).json({
      mensaje: "Institución creada exitosamente.",
      id: codigo,
      institucion: nuevaInstitucion,
    });
  } catch (error) {
    console.error("Error al crear institución:", error);
    return res.status(500).json({
      error: "Error interno al guardar la institución.",
    });
  }
});

// Actualizar institución
export const actualizarInstitucion = onRequest(async (req, res) => {
  setCORSHeaders(res, "POST");

  if (req.method === "OPTIONS") return res.status(204).send("");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }
  try {
    const { id, ...camposActualizables } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Falta el ID de la institución." });
    }

    await db.collection("instituciones").doc(id).update(camposActualizables);

    return res.status(200).json({
      mensaje: "Institución actualizada exitosamente.",
      id,
      cambios: camposActualizables,
    });
  } catch (error) {
    console.error("Error al actualizar institución:", error);
    return res.status(500).json({
      error: error.message || "Error interno al actualizar la institución.",
    });
  }
});

// Obtener institución por ID
export const obtenerInstitucion = onRequest(async (req, res) => {
  setCORSHeaders(res, "GET");

  if (req.method === "OPTIONS") return res.status(204).send("");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "Falta el ID de la institución." });
    }

    const docRef = db.collection("instituciones").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "Institución no encontrada." });
    }

    return res.status(200).json({
      mensaje: "Institución obtenida exitosamente.",
      id: docSnap.id,
      institucion: docSnap.data(),
    });
  } catch (error) {
    console.error("Error al obtener institución:", error);
    return res.status(500).json({
      error: error.message || "Error interno al obtener la institución.",
    });
  }
});

// Obtener todas las instituciones
export const obtenerInstituciones = onRequest(async (req, res) => {
  setCORSHeaders(res, "GET");

  if (req.method === "OPTIONS") return res.status(204).send("");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const snapshot = await db.collection("instituciones").get();
    const instituciones = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      mensaje: "Instituciones obtenidas exitosamente.",
      instituciones,
    });
  } catch (error) {
    console.error("Error al obtener instituciones:", error);
    return res.status(500).json({
      error: error.message || "Error interno al obtener las instituciones.",
    });
  }
});
