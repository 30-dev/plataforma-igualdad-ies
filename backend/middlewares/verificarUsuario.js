import jwt from "jsonwebtoken";
import { config } from "../config/config.js"; // Aquí importamos el jwtSecret

export const verificarUsuario = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Token no proporcionado o formato incorrecto" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret); // Verificamos el JWT
    req.usuario = decoded; // Almacenamos los datos del usuario en `req.usuario` para usarlos en la función
    next(); // Si todo va bien, pasa al siguiente middleware o función
  } catch (error) {
    console.error("❌ Error al verificar token:", error);
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};
