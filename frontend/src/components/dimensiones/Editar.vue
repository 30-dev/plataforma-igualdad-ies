<template>
    <div class="contenedor">
        <h1 class="titulo">Editar: {{ dimensionNombre }}</h1>
        <p class="descripcion">Modifica tus respuestas anteriores</p>

        <div v-if="loading" class="loading">Cargando preguntas y respuestas...</div>

        <form v-else @submit.prevent="enviar">
            <div v-for="pregunta in preguntas" :key="pregunta.id" class="pregunta-wrapper">
                <InputPregunta :pregunta="pregunta" v-model="respuestas[pregunta.id]" :esDimension="true" />
            </div>

            <div class="acciones">
                <button type="submit" class="boton-enviar">Guardar Cambios</button>
            </div>
        </form>

        <ModalFull :visible="modalVisible" :status="modalStatus" :closable="modalStatus !== 'loading'"
            @close="modalVisible = false">
            <template #default>
                <p v-if="modalStatus === 'loading'">Guardando cambios...</p>
                <p v-else-if="modalStatus === 'success'">¡Respuestas actualizadas con éxito!</p>
                <p v-else-if="modalStatus === 'error'">Ocurrió un error al guardar. Intenta nuevamente.</p>
            </template>
        </ModalFull>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import InputPregunta from '../../components/preguntas/InputPregunta.vue'
import ModalFull from '../../components/ModalFull.vue'

const route = useRoute()
const router = useRouter()

const codigo = route.params.codigo
const rawId = route.params.id
const dimensionNum = rawId.split('-')[1]

const preguntas = ref([])
const respuestas = ref({})
const loading = ref(true)
const dimensionNombre = ref('')

const modalVisible = ref(false)
const modalStatus = ref('loading')


if (!codigo || !dimensionNum) {
    console.warn("⛔ No se puede cargar sin código y número de dimensión")
}


onMounted(async () => {
    try {
        const { data } = await axios.get(`https://obtenerpreguntasconrespuestas-34rbmbolyq-uc.a.run.app/?institucion_id=${codigo}&dimension=${dimensionNum}`)

        console.log(data)

        preguntas.value = data.preguntas
        dimensionNombre.value = `Dimensión ${dimensionNum}`

        preguntas.value.forEach((p) => {
            respuestas.value[p.id] = p.respuesta ?? ''
        })

        loading.value = false
    } catch (error) {
        console.error('❌ Error al cargar preguntas con respuestas:', error)
        loading.value = false
    }
})

const enviar = async () => {
    modalVisible.value = true
    modalStatus.value = 'loading'

    try {
        const payload = {
            institucion_id: codigo,
            dimension_id: `dimension_${dimensionNum}`,
            usuario_id: 'admin', // puedes reemplazarlo con el ID real del usuario
            respuestas: respuestas.value,
            preguntas: preguntas.value
        }

        await axios.post('https://guardardimension-34rbmbolyq-uc.a.run.app', payload)

        modalStatus.value = 'success'
        setTimeout(() => {
            router.push(`/dimensiones/${codigo}`)
        }, 1500)
    } catch (e) {
        console.error('❌ Error al guardar respuestas:', e)
        modalStatus.value = 'error'
    }
}
</script>

<style scoped>
.contenedor {
    max-width: 720px;
    margin: 0 auto;
    padding: 20px;
}

.titulo {
    font-size: 24px;
    margin-bottom: 10px;
    text-align: center;
}

.descripcion {
    font-size: 16px;
    margin-bottom: 20px;
    text-align: center;
    color: #666;
}

.loading {
    text-align: center;
    font-size: 18px;
}

.pregunta-wrapper {
    margin-bottom: 24px;
}

.acciones {
    display: flex;
    justify-content: center;
    margin-top: 32px;
}

.boton-enviar {
    padding: 10px 24px;
    background-color: #0077cc;
    border: none;
    border-radius: 6px;
    color: white;
    font-weight: bold;
    cursor: pointer;
}

.boton-enviar:hover {
    background-color: #005fa3;
}
</style>
