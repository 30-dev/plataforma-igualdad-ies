import { https } from "firebase-functions";
import admin from "../config/firebase.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { config } from "../config/config.js"; // Importamos la configuración
import { setCORSHeaders } from "../helpers/cors.js";

export const loginUsuario = https.onRequest(async (req, res) => {
  setCORSHeaders(res, "POST");

  if (req.method === "OPTIONS") return res.status(204).send("");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { id, password } = req.body;

  if (!id || !password) {
    return res.status(400).json({
      error: {
        message: "Faltan id o contraseña.",
        status: "INVALID_ARGUMENT",
      },
    });
  }

  try {
    // Buscar al usuario por su id (documento de Firestore)
    const usuarioSnap = await admin
      .firestore()
      .collection("usuarios")
      .doc(id) // Ahora usamos el id del documento
      .get();

    if (!usuarioSnap.exists) {
      return res.status(404).json({
        error: { message: "Usuario no encontrado", status: "NOT_FOUND" },
      });
    }

    const usuario = usuarioSnap.data();

    // Verificar la contraseña con bcrypt
    const match = await bcrypt.compare(password, usuario.password);
    if (!match) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Crear el JWT usando el secret de config.js
    const token = jwt.sign(
      {
        id: usuarioSnap.id,
        email: usuario.email,
        institucion_id: usuario.institucion_id,
        rol: usuario.rol,
      },
      config.jwtSecret, // Usamos el jwtSecret de la configuración
      { expiresIn: "2h" } // Expira en 2 horas
    );

    return res.status(200).json({
      mensaje: "Login exitoso.",
      token,
      usuario: {
        id: usuarioSnap.id,
        email: usuario.email,
        nombre: usuario.nombre,
        institucion_id: usuario.institucion_id,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("Error en loginUsuario:", error);
    return res.status(500).json({
      error: {
        message: "Error interno al hacer login.",
        status: "INTERNAL",
      },
    });
  }
});
