import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // Asegúrate de tener el router configurado
import "./style.css"; // Importa tus estilos globales aquí

createApp(App)
  .use(router) // Usamos Vue Router para manejar las rutas
  .mount("#app");
