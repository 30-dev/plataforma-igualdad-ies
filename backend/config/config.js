import dotenv from "dotenv";

dotenv.config(); // carga las variables desde `.env`

export const config = {
  jwtSecret: process.env.JWT_SECRET || "fallback_secret", // por si no se define
};
