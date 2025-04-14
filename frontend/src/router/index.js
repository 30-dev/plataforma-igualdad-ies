// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";

// Admin views
import AdminLogin from "../views/administrador/Login.vue";
import AdminLayout from "../layouts/AdminLayout.vue";
import Dashboard from "../views/administrador/Dashboard.vue";
import CrearInstitucion from "../views/administrador/CrearInstitucion.vue";
import CrearUsuario from "../views/administrador/CrearUsuario.vue";
import LoginUsuario from "../views/usuarios/LoginUsuario.vue";
import DashboardUsuario from "../views/usuarios/DashboardUsuario.vue";

const routes = [
  // ✅ LOGIN DEL ADMIN – fuera del layout
  {
    path: "/admin/ingresar",
    name: "AdminLogin",
    component: AdminLogin,
    meta: { requiresAuth: false },
  },

  // ✅ RUTAS DEL ADMIN – con layout
  {
    path: "/admin",
    component: AdminLayout,
    children: [
      {
        path: "",
        redirect: "/admin/dashboard",
      },
      {
        path: "dashboard",
        name: "AdminDashboard",
        component: Dashboard,
        meta: { requiresAuth: true, role: "admin" },
      },
      {
        path: "crear-institucion",
        name: "CrearInstitucion",
        component: CrearInstitucion,
        meta: { requiresAuth: true, role: "admin" },
      },
      {
        path: "crear-usuario",
        name: "CrearUsuario",
        component: CrearUsuario,
        meta: { requiresAuth: true, role: "admin" },
      },
    ],
  },

  // ✅ LOGIN DE USUARIO COMÚN
  {
    path: "/",
    name: "LoginUsuario",
    component: LoginUsuario,
  },

  // ✅ LOGIN DE USUARIO COMÚN
  {
    path: "/dashboard",
    name: "DashboardUsuario",
    component: DashboardUsuario,
  },

  // ✅ RUTA POR DEFECTO
  {
    path: "/:pathMatch(.*)*",
    redirect: "/dashboard",
  },
  {
    path: "/dimensiones/:codigoInstitucion",
    name: "Dimensiones",
    component: () => import("../views/usuarios/Dimensiones.vue"),
  },
  {
    path: "/autodiagnostico/:codigoInstitucion",
    name: "Autodiagnostico",
    component: () => import("../views/usuarios/Autodiagnostico.vue"),
  },
  {
    path: "/comunidad-encuestas/:codigoInstitucion",
    name: "Levantamiento",
    component: () => import("../views/usuarios/Levantamiento.vue"),
  },
  {
    path: "/resultados-dimensiones/:codigoInstitucion",
    name: "ResultadosDimensiones",
    component: () => import("../views/usuarios/ResultadosDimensiones.vue"),
  },
  {
    path: "/encuestas",
    name: "EncuestaPublica",
    component: () => import("../views/public/EncuestaPublica.vue"), // Cambia la ruta si está en otra carpeta
  },
  {
    path: "/resultados-encuestas/:codigo",
    name: "ResultadosEncuestas",
    component: () => import("../views/usuarios/ResultadosEncuestas.vue"), // Cambia la ruta si está en otra carpet
  },

  {
    path: "/dimensiones/:codigo/:id",
    name: "dimension",
    component: () => import("../views/usuarios/EncuestaDimension.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const uid = localStorage.getItem("uid");
  const isAdmin = localStorage.getItem("admin") === "true";

  // 👉 Siempre permitir el acceso directo a la raíz (login de usuario)
  if (to.path === "/") {
    return next();
  }

  // 👉 Proteger rutas admin
  if (to.meta.requiresAuth && !uid) {
    if (to.path.startsWith("/admin")) {
      return next("/admin/ingresar");
    } else {
      return next("/");
    }
  }

  // 👉 Si va a una ruta de admin pero no es admin
  if (to.meta.role === "admin" && !isAdmin) {
    return next("/admin/ingresar");
  }

  next();
});

export default router;
