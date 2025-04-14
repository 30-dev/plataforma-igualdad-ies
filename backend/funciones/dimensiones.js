import { https } from "firebase-functions";
import admin from "../config/firebase.js";
import { setCORSHeaders } from "../helpers/cors.js";
const db = admin.firestore();

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
