<template>
    <div class="levantamiento-wrapper">
        <!-- 🧭 BREADCRUMB -->
        <nav class="breadcrumb">
            <router-link to="/dashboard">← Volver al dashboard</router-link>
        </nav>

        <!-- 📌 ENCABEZADO -->
        <header class="levantamiento-header">
            <h1>Levantamiento de<br>encuestas para la comunidad</h1>
            <p class="descripcion">
                Bienvenido al módulo de levantamiento de encuestas.
                <br>
                Puedes compartir los enlaces o los códigos QR con los participantes para que respondan las encuestas.
            </p>

            <div v-if="estado === 'cargando'" class="estado-msg">Cargando datos...</div>
            <div v-else-if="estado === 'no-existe'">
                <button @click="levantarEncuestas">Levantar encuestas</button>
            </div>
        </header>

        <!-- 💡 CONTENIDO PRINCIPAL -->
        <main class="contenido" v-if="estado === 'existe'">
            <section class="fechas">
                <div class="linea-fecha">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="22px">
                        <g fill="none">
                            <path
                                d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                            <path fill="currentColor"
                                d="M16 3a1 1 0 0 1 .993.883L17 4v1h2a2 2 0 0 1 1.995 1.85L21 7v12a2 2 0 0 1-1.85 1.995L19 21H5a2 2 0 0 1-1.995-1.85L3 19V7a2 2 0 0 1 1.85-1.995L5 5h2V4a1 1 0 0 1 1.993-.117L9 4v1h6V4a1 1 0 0 1 1-1m3 9H5v7h14zm0-5H5v3h14z" />
                        </g>
                    </svg>
                    <div>
                        <span class="label">Fecha de inicio:</span>
                        <span class="valor">{{ fechas.formateada_inicio }}</span>
                    </div>
                </div>

                <div class="linea-fecha">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="22px">
                        <g fill="none">
                            <path
                                d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                            <path fill="currentColor"
                                d="M17 12a5 5 0 1 1 0 10a5 5 0 0 1 0-10m-1-9a1 1 0 0 1 1 1v1h2a2 2 0 0 1 2 2v3h-2V7H5v12h5v2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2V4a1 1 0 0 1 2 0v1h6V4a1 1 0 0 1 1-1m1 11a3 3 0 1 0 0 6a3 3 0 0 0 0-6m0 .5a1 1 0 0 1 1 1v.5a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1v-1.5a1 1 0 0 1 1-1M8.5 14a1 1 0 0 1 .117 1.993L8.5 16H8a1 1 0 0 1-.117-1.993L8 14zm2.5-4a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2z" />
                        </g>
                    </svg>
                    <div>
                        <span class="label">Fecha límite:</span>
                        <span class="valor importante">{{ fechas.formateada_limite }}</span>
                    </div>
                </div>

                <div class="linea-fecha">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="22px">
                        <g fill="none">
                            <path
                                d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                            <path fill="currentColor"
                                d="M20.66 7c2.762 4.783 1.123 10.9-3.66 13.66c-4.123 2.38-9.233 1.491-12.335-1.86a1 1 0 0 1 1.468-1.358a8 8 0 1 0-2.06-6.524l1.281-.335c1.047-.273 1.818.97 1.108 1.787L4.21 14.957c-.568.652-1.665.43-1.892-.444A10 10 0 0 1 7 3.34C11.783.579 17.899 2.217 20.66 7M12 6a1 1 0 0 1 1 1v4.586l2.707 2.707a1 1 0 1 1-1.414 1.414l-3-3A1 1 0 0 1 11 12V7a1 1 0 0 1 1-1" />
                        </g>
                    </svg>
                    <div>
                        <span class="label">Tiempo restante:</span>
                        <span class="badge" v-if="diasRestantes > 0">{{ diasRestantes }} días</span>
                        <span class="expirado" v-else>⛔ El tiempo para responder ha expirado.</span>
                    </div>
                </div>

                <p class="ver-resultados">
                    <router-link :to="`/resultados-encuestas/${codigo}`">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="20px">
                            <g fill="none">
                                <path
                                    d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                                <path fill="currentColor"
                                    d="M21 3a1 1 0 1 1 0 2v11a2 2 0 0 1-2 2h-5.055l2.293 2.293a1 1 0 0 1-1.414 1.414l-2.828-2.828l-2.829 2.828a1 1 0 0 1-1.414-1.414L10.046 18H5a2 2 0 0 1-2-2V5a1 1 0 0 1 0-2zm-2 2H5v11h14zM8 11a1 1 0 0 1 .993.883L9 12v1a1 1 0 0 1-1.993.117L7 13v-1a1 1 0 0 1 1-1m4-2a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1m4-2a1 1 0 0 1 .993.883L17 8v5a1 1 0 0 1-1.993.117L15 13V8a1 1 0 0 1 1-1" />
                            </g>
                        </svg>
                        <span>Ver resultados de las encuestas</span>
                    </router-link>
                </p>
            </section>

            <!-- 👇 Mostrar solo si no ha expirado -->
            <template v-if="diasRestantes > 0">
                <section class="grupo">
                    <h2>Estudiantes</h2>
                    <EnlaceCopiable :texto="info.encuestas.estudiantes.enlace" />
                    <img :src="info.encuestas.estudiantes.qr_code" alt="QR Estudiantes" />
                </section>

                <section class="grupo">
                    <h2>Personal</h2>
                    <EnlaceCopiable :texto="info.encuestas.personal.enlace" />
                    <img :src="info.encuestas.personal.qr_code" alt="QR Personal" />
                </section>
            </template>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import EnlaceCopiable from '../../components/EnlaceCopiable.vue';

const info = ref(null)
const estado = ref('cargando')
const route = useRoute()
const codigo = route.params.codigoInstitucion

const fechas = ref({
    fecha_creacion: '',
    fecha_inicio: '',
    fecha_limite: '',
    formateada_creacion: '',
    formateada_inicio: '',
    formateada_limite: ''
})

const diasRestantes = computed(() => {
    const hoy = new Date()
    const limiteReal = new Date(fechas.value.fecha_limite)
    const diff = Math.ceil((limiteReal - hoy) / (1000 * 60 * 60 * 24))
    return diff
})

const generarFechas = () => {
    const ahora = new Date()
    const inicio = new Date(ahora)
    const limite = new Date(ahora)
    limite.setDate(limite.getDate() + 15)

    fechas.value.fecha_creacion = ahora.toISOString()
    fechas.value.fecha_inicio = inicio.toISOString()
    fechas.value.fecha_limite = limite.toISOString()

    fechas.value.formateada_creacion = ahora.toLocaleDateString('es-MX')
    fechas.value.formateada_inicio = inicio.toLocaleDateString('es-MX')
    fechas.value.formateada_limite = limite.toLocaleDateString('es-MX')

    return { inicio, limite }
}

onMounted(async () => {
    try {
        const res = await axios.get(`https://obtenerinfoencuestas-34rbmbolyq-uc.a.run.app/?id=${codigo}`)
        if (res.data?.encuestas) {
            info.value = res.data
            estado.value = 'existe'

            const estudiante = res.data.encuestas.estudiantes
            const fechaCreacion = new Date(estudiante.fecha_creacion._seconds * 1000)
            const fechaInicio = new Date(estudiante.fecha_inicio)
            const fechaLimite = new Date(estudiante.fecha_limite)

            fechas.value = {
                fecha_creacion: fechaCreacion.toISOString(),
                fecha_inicio: fechaInicio.toISOString(),
                fecha_limite: fechaLimite.toISOString(),
                formateada_creacion: fechaCreacion.toLocaleDateString('es-MX'),
                formateada_inicio: fechaInicio.toLocaleDateString('es-MX'),
                formateada_limite: fechaLimite.toLocaleDateString('es-MX')
            }
        } else {
            estado.value = 'no-existe'
        }
    } catch (err) {
        if (err.response?.data?.error?.status === 'NOT_FOUND') {
            estado.value = 'no-existe'
        } else {
            console.error('Error al cargar encuestas:', err)
        }
    }
})

const levantarEncuestas = async () => {
    try {
        estado.value = 'cargando'
        const { inicio, limite } = generarFechas()

        const res = await axios.post('https://levantarencuestas-34rbmbolyq-uc.a.run.app', {
            institucion_id: codigo,
            fecha_inicio: inicio.toISOString(),
            fecha_limite: limite.toISOString()
        })

        if (res.data?.encuestas) {
            info.value = res.data
            estado.value = 'existe'
        } else {
            estado.value = 'no-existe'
        }
    } catch (err) {
        console.error('Error al levantar encuestas:', err)
        estado.value = 'no-existe'
    }
}
</script>

<style scoped>
.levantamiento-wrapper {
    max-width: 960px;
    margin: auto;
    padding: 0px 16px 120px 16px;
}

.breadcrumb {
    font-size: 14px;
    margin-bottom: 16px;
    text-align: left;
}

.levantamiento-header h1 {
    font-size: clamp(24px, 2vw, 32px);
    font-weight: bold;
    color: #213547;
    margin-bottom: 8px;
    text-align: left;
}

.descripcion {
    font-size: 16px;
    color: #555;
    margin-bottom: 16px;
    text-align: left;
}

.estado-msg {
    color: #666;
    font-size: 14px;
    margin-bottom: 16px;
}

button {
    padding: 10px 20px;
    background: linear-gradient(135deg, #007bff, #0056b3);
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

button:hover {
    background: linear-gradient(135deg, #0056b3, #007bff);
}

.contenido {
    margin-top: 32px;
    display: flex;
    flex-direction: column;
    gap: 32px;
}

/* 🎨 Nueva sección de fechas más visual */
.fechas {
    border: 1px solid #ddd;
    background: #f1f9ff;
    padding: 20px;
    border-radius: 10px;
    font-size: 15px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.linea-fecha {
    display: flex;
    gap: 12px;
    align-items: center;
}

.label {
    font-weight: 600;
    color: #444;
    margin-right: 4px;
}

.valor {
    font-weight: 500;
    color: #213547;
}

.valor.importante {
    color: #0056b3;
}

.badge {
    background: #d2ebff;
    color: #003c74;
    padding: 3px 8px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 14px;
    display: inline-block;
    margin-top: 2px;
}

.expirado {
    color: red;
    font-weight: bold;
}

/* 💎 Enlace a resultados mejorado */
.ver-resultados {
    background-color: #e9f4ff;
    border: 1px solid #c4e1fb;
    margin-top: 20px;
    border-radius: 6px;
    transition: 0.2s ease;
    display: flex;
    justify-content: center;
}

.ver-resultados:hover {
    background-color: #d4eaff;
}

.ver-resultados a {
    display: flex;
    gap: 8px;
    color: #007bff;
    text-decoration: none;
    padding: 12px;
    font-weight: 600;
    justify-content: center;
    align-items: center;

    white-space: nowrap;
    /* 👈 fuerza una sola línea */
    overflow: hidden;
    text-overflow: ellipsis;
}

.ver-resultados a:hover {
    text-decoration: underline;
}

/* 🎯 Tarjetas */
.grupo {
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 8px;
    background: #f9f9f9;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
}

.grupo h2 {
    font-size: 18px;
    color: #1e1e1e;
    margin-bottom: 8px;
}

.grupo a {
    color: #007bff;
    word-break: break-all;
}

.grupo img {
    max-width: 200px;
    margin-top: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

@media (max-width: 420px) {
    .ver-resultados a {
        font-size: 13px;
        padding: 10px;
    }
}
</style>
