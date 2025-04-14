import { https } from "firebase-functions";
import admin from "../config/firebase.js";

export const loginAdmin = https.onRequest(async (req, res) => {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const uid = decoded.uid;

    const userDoc = await admin
      .firestore()
      .collection("usuarios")
      .doc(uid)
      .get();

    if (!userDoc.exists || userDoc.data().rol !== "admin") {
      return res.status(403).json({ error: "No autorizado (no eres admin)" });
    }

    return res.status(200).json({
      mensaje: "Login de administrador exitoso.",
      uid,
      email: decoded.email,
    });
  } catch (err) {
    console.error("❌ Error loginAdmin:", err);
    return res.status(500).json({
      error: {
        message: "Error interno al verificar admin.",
        status: "INTERNAL",
      },
    });
  }
});
