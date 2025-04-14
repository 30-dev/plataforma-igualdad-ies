// backend/config/firebase.js
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp(); // Aquí puedes pasar config si estás fuera del entorno de emulador
}

export default admin;
