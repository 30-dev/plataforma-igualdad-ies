<template>
    <div class="encuesta-wrapper">
        <SkeletonCargandoEncuesta v-if="estado === 'cargando'" />

        <div v-else-if="estado === 'lista'">
            <h1>
                Distintivo Genera Igualdad para<br />
                Universidades e Instituciones<br />
                de Educación Superior
            </h1>
            <h2 class="dirigido-parrafo">Encuesta para {{ tipo === 'personal' ? 'personal institucional' : 'estudiantes'
                }}</h2>
            <span class="descripcion">Percepción de igualdad de género</span>

            <div class="aviso-encuesta">
                <strong>
                    Aviso importante antes de comenzar
                </strong>

                <p>
                    Todas las respuestas que proporciones en esta encuesta son completamente anónimas y confidenciales.
                    La información recopilada se utilizará únicamente con fines estadísticos y de análisis general.
                    Tu participación es muy valiosa y nos ayudará a obtener una visión más precisa y útil.
                </p>


                <span>¡Gracias por tu tiempo y sinceridad!</span>

            </div>

            <form @submit.prevent="enviarRespuestas">
                <div class="preguntas">
                    <template v-for="pregunta in preguntas" :key="pregunta.id">
                        <InputPregunta :pregunta="pregunta" v-model="respuestas[pregunta.id]" />
                    </template>
                </div>

                <button type="submit">Enviar respuestas</button>

                <div ref="recaptchaRef" class="g-recaptcha" data-sitekey="6Lej4wwrAAAAAF0MGhVfsaDxYYUAu_48bWKI6f_v"
                    data-callback="onRecaptchaSuccess" data-size="invisible"></div>
            </form>
        </div>

        <p v-else-if="estado === 'enviada'" class="estado-msg success">
            ✅ ¡Gracias por tu participación!
        </p>

        <ModalFull :visible="modalVisible" :status="modalStatus" :closable="modalStatus !== 'loading'"
            @close="modalVisible = false">
            <template #default>
                <p v-if="modalStatus === 'loading'">Enviando respuestas...</p>
                <p v-else-if="modalStatus === 'success'">¡Respuestas enviadas correctamente!</p>
                <p v-else-if="modalStatus === 'error'">Ocurrió un error al enviar.</p>
            </template>
        </ModalFull>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

import InputPregunta from '../../components/preguntas/InputPregunta.vue'
import ModalFull from '../../components/ModalFull.vue'
import SkeletonCargandoEncuesta from '../../components/SkeletonCargandoEncuesta.vue'

const route = useRoute()
const tipo = route.query.tipo || 'estudiantes'
const token = route.query.token || ''

const estado = ref('cargando')
const preguntas = ref([])
const respuestas = ref({})
const modalVisible = ref(false)
const modalStatus = ref(null)
const institucionId = ref('')

const recaptchaRef = ref(null)
const recaptchaWidgetId = ref(null)

onMounted(async () => {
    try {
        // Render manual de reCAPTCHA
        const checkReady = setInterval(() => {
            if (window.grecaptcha && recaptchaRef.value && recaptchaWidgetId.value === null) {
                clearInterval(checkReady)
                recaptchaWidgetId.value = grecaptcha.render(recaptchaRef.value, {
                    sitekey: '6Lej4wwrAAAAAF0MGhVfsaDxYYUAu_48bWKI6f_v',
                    callback: onRecaptchaSuccess,
                    size: 'invisible',
                })
            }
        }, 300)

        const resToken = await axios.get(`https://obtenerencuestaportoken-34rbmbolyq-uc.a.run.app/?token=${token}`)
        institucionId.value = resToken.data.institucion_id

        const res = await axios.get(`https://obtenerencuestaportipo-34rbmbolyq-uc.a.run.app/?tipo=${tipo}`)
        preguntas.value = res.data?.encuesta?.preguntas || []

        preguntas.value.forEach((p) => {
            respuestas.value[p.id] = ''
        })

        estado.value = 'lista'
    } catch (error) {
        console.error('Error cargando datos:', error)
        estado.value = 'error'
    }
})

const enviarRespuestas = async () => {
    const vacias = preguntas.value.filter((p) => !respuestas.value[p.id])
    if (vacias.length) {
        modalStatus.value = 'error'
        modalVisible.value = true
        return
    }

    modalStatus.value = 'loading'
    modalVisible.value = true

    window.__enviarConRecaptcha = async (tokenRecaptcha) => {
        const payload = {
            encuesta_id: tipo,
            institucion_id: institucionId.value,
            respuestas: respuestas.value,
            recaptcha_token: tokenRecaptcha,
            preguntas: preguntas.value.map((p) => ({
                id: p.id,
                tipo: p.tipo,
                pregunta: p.pregunta,
                opciones: p.opciones || [],
            })),
        }

        try {
            await axios.post('https://responderencuesta-34rbmbolyq-uc.a.run.app', payload)
            modalStatus.value = 'success'
            estado.value = 'enviada'
        } catch (err) {
            modalStatus.value = 'error'
            console.error('Error al enviar respuestas:', err)
        }
    }

    // Ejecutar reCAPTCHA
    if (window.grecaptcha && recaptchaWidgetId.value !== null) {
        window.grecaptcha.execute(recaptchaWidgetId.value)
    } else {
        console.error('reCAPTCHA no cargado correctamente')
        modalStatus.value = 'error'
    }
}
</script>

<script>
// Esta función debe estar fuera del setup para que reCAPTCHA la vea global
window.onRecaptchaSuccess = function (token) {
    if (typeof window.__enviarConRecaptcha === 'function') {
        window.__enviarConRecaptcha(token)
    }
}
</script>

<style scoped>
h1 {
    color: #757575;
    text-align: left;
    font-size: clamp(24px, 2vw, 32px);
}

h2 {
    text-align: left;
}

.encuesta-wrapper {
    width: 100%;
    max-width: 800px;
    min-width: 325px;
    margin: auto;
    padding: 16px 16px 100px 16px;
    outline: 1px solid #d2d2d2;
    outline-offset: 12px;
}

.dirigido-parrafo {
    margin: 12px 0 0px 0;
}

.descripcion {
    display: block;
    font-size: 17px;
    text-align: left;
    /* padding: 8px 0px; */
}



.aviso-encuesta {
    text-align: left;
    margin: 0 0 24px 0;
    background-color: #fff;
    outline: 1px solid #d2d2d2;
    padding: 16px;
    margin: 12px 0 24px 0;
}


.aviso-encuesta strong {
    color: #007bff
}

.aviso-encuesta p {
    margin: 6px 0;
}

.estado-msg {
    display: flex;
    gap: 12px;
    margin: 24px 0;
    font-size: 16px;
}

.estado-msg.success {
    color: green;
    font-weight: bold;
}

.preguntas {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

button {
    margin-top: 24px;
    padding: 10px 20px;
    background: linear-gradient(135deg, #007bff, #0056b3);
    color: white;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
}
</style>
