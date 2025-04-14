// funciones/usuarios.js
import { https } from "firebase-functions";
import admin from "../config/firebase.js";
import bcrypt from "bcrypt";
import { verificarAdmin } from "../middlewares/verificarAdmin.js"; // Importamos el middleware
import { setCORSHeaders } from "../helpers/cors.js";

const db = admin.firestore();

// Función auxiliar para generar un código único basado en email
function generarCodigoUsuario(email) {
  const prefijo = email.split("@")[0].slice(0, 4).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefijo}-${random}`;
}

// Crear usuario
export const crearUsuario = https.onRequest(async (req, res) => {
  setCORSHeaders(res, "POST");

  if (req.method === "OPTIONS") return res.status(204).send("");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { nombre, email, rol, institucion_id, password } = req.body;

  if (!nombre || !email || !rol || !institucion_id || !password) {
    return res.status(400).json({
      error: {
        message: "Faltan campos obligatorios.",
        status: "INVALID_ARGUMENT",
      },
    });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const usuarioId = generarCodigoUsuario(email);

    const nuevoUsuario = {
      nombre,
      email,
      rol: "usuario", // 👈 rol fijo por defecto
      institucion_id,
      password: hashedPassword,
      activo: true,
      creado: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Crear el usuario con ID personalizado
    await db.collection("usuarios").doc(usuarioId).set(nuevoUsuario);

    // Agregar el ID del nuevo usuario al array de usuarios en la institución
    await db
      .collection("instituciones")
      .doc(institucion_id)
      .update({
        usuarios: admin.firestore.FieldValue.arrayUnion(usuarioId),
      });

    return res.status(200).json({
      mensaje: "Usuario creado exitosamente.",
      id: usuarioId,
      usuario: {
        ...nuevoUsuario,
        password: undefined,
      },
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return res.status(500).json({
      error: {
        message: "Error interno al guardar el usuario.",
        status: "INTERNAL",
      },
    });
  }
});

// Actualizar usuario
export const actualizarUsuario = https.onRequest(async (req, res) => {
  setCORSHeaders(res, "POST");

  if (req.method === "OPTIONS") return res.status(204).send("");

  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { id, ...camposActualizables } = req.body;

  if (!id) {
    return res.status(400).json({
      error: {
        message: "Falta el ID del usuario.",
        status: "INVALID_ARGUMENT",
      },
    });
  }

  try {
    await db.collection("usuarios").doc(id).update(camposActualizables);

    return res.status(200).json({
      mensaje: "Usuario actualizado exitosamente.",
      id,
      cambios: camposActualizables,
    });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return res.status(500).json({
      error: {
        message: "Error interno al actualizar el usuario.",
        status: "INTERNAL",
      },
    });
  }
});
