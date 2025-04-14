<template>
    <div class="responder-wrapper">
        <h2>Preguntas</h2>

        <div v-if="preguntas.length" class="preguntas">
            <template v-for="pregunta in preguntas" :key="pregunta.id">
                <InputPregunta :pregunta="pregunta" v-model="respuestas[pregunta.id]" />
            </template>

            <button @click="enviarRespuestas">Enviar</button>
        </div>

        <p v-else>Cargando preguntas...</p>

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
import { defineProps, reactive, watchEffect, ref } from 'vue'
import axios from 'axios'
import InputPregunta from '../preguntas/InputPregunta.vue'
import ModalFull from '../../components/ModalFull.vue'

const props = defineProps({
    preguntas: Array,
    codigo: String
})

const respuestas = reactive({})
const modalVisible = ref(false)
const modalStatus = ref(null)

watchEffect(() => {
    if (props.preguntas?.length) {
        props.preguntas.forEach((p) => {
            if (!(p.id in respuestas)) respuestas[p.id] = ''
        })
    }
})

const enviarRespuestas = async () => {
    // Validación
    const vacias = props.preguntas.filter((p) => !respuestas[p.id] && respuestas[p.id] !== 0)
    if (vacias.length > 0) {
        modalStatus.value = 'error'
        modalVisible.value = true
        return
    }

    const payload = {
        institucion_id: props.codigo,
        usuario_id: JSON.parse(localStorage.getItem('usuario'))?.id || 'ANONIMO',
        respuestas: respuestas,
        preguntas: props.preguntas.map(p => ({
            id: p.id,
            pregunta: p.pregunta,
            tipoRespuesta: p.tipoRespuesta
        }))
    }

    try {
        modalStatus.value = 'loading'
        modalVisible.value = true
        await axios.post('https://guardarautodiagnostico-34rbmbolyq-uc.a.run.app', payload)

        modalStatus.value = 'success'

        // Esperamos un poco y recargamos la página
        setTimeout(() => {
            window.location.reload()
        }, 1000)



    } catch (err) {
        console.error('❌ Error al enviar respuestas:', err)
        modalStatus.value = 'error'
    }
}
</script>

<style scoped>
.responder-wrapper {
    display: flex;
    flex-direction: column;
    max-width: 800px;
    margin: auto;
    padding: 16px;
    text-align: left;
    background-color: #fff;
    border-radius: 6px;
}

.preguntas {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

button {
    margin-top: 24px;
    padding: 10px 20px;
    background: linear-gradient(135deg, #28a745, #218838);
    border: none;
    border-radius: 4px;
    color: white;
    font-weight: bold;
    cursor: pointer;
}

button:hover {
    background: linear-gradient(135deg, #218838, #28a745);
}
</style>
