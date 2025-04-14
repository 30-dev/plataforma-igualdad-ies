<template>
    <div class="dashboard">
        <h2>Panel de Administración</h2>
        <h1 class="dashboard-title">Distintivo Genera Igualdad</h1>

        <!-- Navegación principal -->
        <nav class="admin-nav">
            <BotonAdmin to="/admin/crear-institucion" label="+ Crear Institución">
            </BotonAdmin>

            <BotonAdmin to="/admin/crear-usuario" label="+ Crear Usuario">
            </BotonAdmin>
        </nav>

        <!-- Tabla de instituciones directamente aquí -->
        <div class="tabla-instituciones">
            <h3>Instituciones registradas</h3>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Clave</th>
                        <th>Estado</th>
                        <th>Ubicación</th>
                        <th>Ciudad</th>
                        <th>Contacto</th>
                        <th>Usuarios</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="institucion in institucionesPaginadas" :key="institucion.id">
                        <td data-label="Nombre">{{ institucion.nombre }}</td>
                        <td data-label="Clave">{{ institucion.id }}</td>
                        <td data-label="Estado">
                            <span class="estado-pill" :class="institucion.estado === 'activo' ? 'activo' : 'inactivo'">
                                {{ institucion.estado }}
                            </span>
                        </td>
                        <td data-label="Ubicación">{{ institucion.ubicacion.estado }}</td>
                        <td data-label="Ciudad">{{ institucion.ubicacion.ciudad }}</td>
                        <td data-label="Contacto">{{ institucion.email_contacto }}</td>
                        <td data-label="Usuarios">
                            {{ institucion.usuarios.length > 0 ? institucion.usuarios : 'Aún no hay usuarios' }}
                        </td>
                        <td data-label="Acciones">
                            <button @click="verUsuarios(institucion)">Ver detalles</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Paginación -->
            <div class="paginacion">
                <button @click="paginaActual--" :disabled="paginaActual === 1">Anterior</button>
                <span>Página {{ paginaActual }} de {{ totalPaginas }}</span>
                <button @click="paginaActual++" :disabled="paginaActual === totalPaginas">Siguiente</button>
            </div>

            <!-- Tabla de usuarios -->
            <div v-if="usuariosSeleccionados.length">
                <h4>Usuarios de {{ institucionSeleccionada?.nombre }}</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>ID</th>
                            <th>Correo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="usuario in usuariosSeleccionados" :key="usuario.id">
                            <td data-label="Nombre">{{ usuario.nombre }}</td>
                            <td data-label="ID">{{ usuario.id }}</td>
                            <td data-label="Correo">{{ usuario.email }}</td>
                            <td data-label="Acciones">
                                <router-link :to="`/admin/editar-usuario/${usuario.id}`">Editar</router-link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { auth } from "../../firebase"
import { onAuthStateChanged } from "firebase/auth"
import { useRouter } from "vue-router"
import BotonAdmin from '../../components/BotonAdmin.vue'


const user = ref(null)
const router = useRouter()
const instituciones = ref([])
const usuariosSeleccionados = ref([])
const institucionSeleccionada = ref(null)

const paginaActual = ref(1)
const institucionesPorPagina = 5

const totalPaginas = computed(() =>
    Math.ceil(instituciones.value.length / institucionesPorPagina)
)

const institucionesPaginadas = computed(() => {
    const inicio = (paginaActual.value - 1) * institucionesPorPagina
    const fin = inicio + institucionesPorPagina
    return instituciones.value.slice(inicio, fin)
})

onMounted(() => {
    onAuthStateChanged(auth, async (currentUser) => {
        if (!currentUser) router.push("/")
        else {
            user.value = currentUser
            await obtenerInstituciones()
        }
    })
})

async function obtenerInstituciones() {
    const res = await fetch("https://obtenerinstituciones-34rbmbolyq-uc.a.run.app")
    const data = await res.json()
    instituciones.value = data.instituciones
}

async function verUsuarios(institucion) {
    institucionSeleccionada.value = institucion
    const res = await fetch(`https://<TU_ENDPOINT>/usuariosPorInstitucion?id=${institucion.id}`)
    const data = await res.json()
    usuariosSeleccionados.value = data
}
</script>

<style scoped>
.dashboard {
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;
    padding: 24px;
}

.admin-nav {
    display: flex;
    justify-content: end;
    gap: 16px;
    margin-bottom: 24px;
    width: 100%;
}

.dashboard-title {
    font-size: 32px;
    font-weight: 400;
    color: var(--secondary-color);
    margin: 0;
}

h2 {
    font-size: 16px;
    font-weight: 600;
}

.container-icono {
    width: 32px;
}

.admin-nav a {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 8px 16px;
    background-color: #fff;
    color: var(--secondary-color);
    border-radius: 4px;
    text-decoration: none;
    outline: 1px solid var(--primary-color);
    transition: background-color 0.2s ease-in-out;
}

.admin-nav a.router-link-active,
.admin-nav a:hover {
    background-color: #d2d2d2;
}

table {
    border-collapse: collapse;
    width: 100%;
    margin-top: 16px;
    text-transform: uppercase;
}

th,
td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
}

.tabla-instituciones {
    width: 100%;
}

.estado-pill {
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    text-transform: capitalize;
    display: inline-block;
    text-align: center;
}

.estado-pill.activo {
    background-color: #DEF7EC;
    color: #03543F;
    border: 1px solid #3AA76D;
}

.estado-pill.inactivo {
    background-color: #FFFBEA;
    color: #92400E;
    border: 1px solid #F6AD55;
}

/* PAGINACIÓN */
.paginacion {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-top: 24px;
}

.paginacion button {
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 6px 12px;
    cursor: pointer;
    font-weight: bold;
}

.paginacion button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

/* Responsive table */
@media (max-width: 768px) {
    .dashboard {
        padding: 0;
    }

    .tabla-instituciones {
        width: calc(100% - 64px);
    }

    table,
    thead,
    tbody,
    th,
    td,
    tr {
        display: block;
        width: 100%;
    }

    thead {
        display: none;
    }

    tr {
        margin-bottom: 16px;
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 12px;
    }

    td {
        display: flex;
        justify-content: space-between;
        padding: 8px;
        border: none;
        border-bottom: 1px solid #eee;
    }

    td:last-child {
        border-bottom: none;
    }

    td::before {
        content: attr(data-label);
        font-weight: bold;
        text-transform: capitalize;
    }
}
</style>
