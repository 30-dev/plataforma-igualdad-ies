<template>
    <div class="autodiagnostico-wrapper">
        <!-- 🧭 BREADCRUMB -->
        <nav class="breadcrumb">
            <router-link to="/dashboard">← Volver al dashboard</router-link>
        </nav>

        <!-- 📌 ENCABEZADO -->
        <header class="autodiagnostico-header">
            <h1>Autodiagnóstico<br>
                participativo
            </h1>
            <p class="descripcion">
                Si la institución ya desarrolló la herramienta de Autodiagnóstico Participativo para su proceso de
                transversalización
                de la perspectiva de género, entra a esta sección para que completes las preguntas.
            </p>

            <!-- 🔄 ESTADOS -->
            <div v-if="estado === 'cargando'" class="estado-msg">Cargando datos...</div>

            <div v-else-if="estado === 'sin-respuesta'" class="acciones">
                <button @click="modo = 'responder'">
                    Responder
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="18px">
                        <g fill="none">
                            <path
                                d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                            <path fill="currentColor"
                                d="m14.707 5.636l5.657 5.657a1 1 0 0 1 0 1.414l-5.657 5.657a1 1 0 0 1-1.414-1.414l3.95-3.95H4a1 1 0 1 1 0-2h13.243l-3.95-3.95a1 1 0 1 1 1.414-1.414" />
                        </g>
                    </svg>
                </button>
                <p class="info-msg">Aún no se ha respondido este autodiagnóstico.</p>
            </div>

            <div v-else class="acciones">
                <button @click="modo = 'ver'">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="19px">
                        <g fill="none">
                            <path
                                d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                            <path fill="currentColor"
                                d="M18 2a2 2 0 0 1 2 2v11.586A2 2 0 0 1 19.414 17L15 21.414a2 2 0 0 1-1.414.586H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2H6v16h6v-4.5a1.5 1.5 0 0 1 1.5-1.5H18zm-.414 12H14v3.586zM10 11a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2zm5-4a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2Z" />
                        </g>
                    </svg>
                    Ver respuestas
                </button>
                <button @click="activarEditar" :disabled="!respuestas">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="19px">
                        <g fill="none" fill-rule="evenodd">
                            <path
                                d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                            <path fill="currentColor"
                                d="M5 2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h3v-2H5V4h12v4h2V4a2 2 0 0 0-2-2zm3 5a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zm7.949 3.811a3 3 0 0 1 4.242 4.243l-5.656 5.657a1 1 0 0 1-.707.293h-2.829a1 1 0 0 1-1-1v-2.829a1 1 0 0 1 .293-.707zm2.828 1.414a1 1 0 0 0-1.414 0l1.414 1.415a1 1 0 0 0 0-1.415m-1.414 2.829l-1.414-1.414l-3.95 3.95v1.414h1.414z" />
                        </g>
                    </svg>
                    Editar respuestas
                </button>

            </div>
        </header>

        <!-- 🧠 CONTENIDO DINÁMICO -->
        <main class="autodiagnostico-contenido">
            <Responder v-if="modo === 'responder'" :preguntas="preguntas" :codigo="codigo" />
            <Editar v-if="modo === 'editar'" :preguntas="preguntas" :respuestas="respuestas" :codigo="codigo" />
            <Ver v-if="modo === 'ver'" :preguntas="preguntas" :respuestas="respuestas" />
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

// Componentes
import Responder from '../../components/autodiagnostico/Responder.vue'
import Editar from '../../components/autodiagnostico/Editar.vue'
import Ver from '../../components/autodiagnostico/Ver.vue'

// Estados
const preguntas = ref([])
const respuestas = ref(null)
const titulo = ref('Autodiagnóstico Participativo')
const descripcion = ref('')
const estado = ref('cargando') // "cargando" | "sin-respuesta" | "respondido"
const modo = ref(null)

const route = useRoute()
const codigo = route.params.codigoInstitucion

const activarEditar = () => {
    if (respuestas.value) {
        modo.value = 'editar'
    } else {
        console.warn('⚠️ No hay respuestas aún para editar.')
    }
}



onMounted(async () => {
    try {
        // 🧠 Preguntas
        const resPreguntas = await axios.get('https://obtenerpreguntasautodiagnosticoparticipativo-34rbmbolyq-uc.a.run.app/')
        preguntas.value = resPreguntas.data?.preguntas || []
        titulo.value = resPreguntas.data?.nombre || 'Autodiagnóstico Participativo'
        descripcion.value = resPreguntas.data?.descripcion || ''

        // ✅ Verificamos si ya hay respuestas
        try {
            const resRespuestas = await axios.get(`https://obtenerautodiagnostico-34rbmbolyq-uc.a.run.app/?id=${codigo}`)
            if (resRespuestas.data?.autodiagnostico?.respuestas?.length > 0) {
                respuestas.value = resRespuestas.data.autodiagnostico.respuestas
                estado.value = 'respondido'
            } else {
                estado.value = 'sin-respuesta'
            }
        } catch (error) {
            if (error.response?.data?.error?.status === 'NOT_FOUND') {
                estado.value = 'sin-respuesta'
            } else {
                console.error('Error inesperado al obtener respuestas:', error)
            }
        }
    } catch (error) {
        console.error('Error cargando preguntas:', error)
        estado.value = 'sin-respuesta'
    }
})
</script>

<style scoped>
.autodiagnostico-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 960px;
    margin: 0 auto;
    padding: 32px 16px;
    box-sizing: border-box;
    position: absolute;
    top: 12px;
    left: 0;
    right: 0;
    bottom: 12px;
}

.breadcrumb {
    font-size: 14px;
    margin-bottom: 16px;
    text-align: left;
}

.breadcrumb a {
    color: #007bff;
    text-decoration: none;
}

.breadcrumb a:hover {
    text-decoration: underline;
}

.autodiagnostico-header {
    margin-bottom: 24px;
}

.autodiagnostico-header h1 {
    font-size: 32px;
    text-align: left;
    font-weight: bold;
    color: #0056b3;
    margin-bottom: 8px;
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

.info-msg {
    color: #666;
    font-size: 14px;
    margin-top: 8px;
}

.acciones {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: start;
    justify-content: center;
    gap: 12px;
    margin-top: 32px;
}

.acciones button {
    display: flex;
    gap: 12px;
    width: 50%;
    justify-content: center;
    align-items: center;
    width: 25%;
    /* 💡 Truncar texto con puntos suspensivos si no cabe */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 32px;
    max-height: 32px;
    padding: 8px 16px;
    background: linear-gradient(135deg, #007bff, #0056b3);
    color: white;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.2s ease;
}

.acciones button:hover {
    background: linear-gradient(135deg, #0056b3, #007bff);
}

.autodiagnostico-contenido {
    margin-top: 24px;
    padding-bottom: 120px;
}

@media screen and (max-width: 425px) {
    .acciones {
        flex-direction: column;
    }

    .acciones button {
        border: 1px solid #555;
        width: 100%;
        min-height: 42px;
    }
}
</style>
