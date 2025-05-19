<template>
    <div class="contenedor">
        <h1 class="titulo" v-if="dimension">{{ dimension.nombre }}</h1>
        <p class="descripcion" v-if="dimension">{{ dimension.descripcion }}</p>

        <div v-if="loading" class="loading">Cargando preguntas...</div>

        <form v-else @submit.prevent="enviar">
            <div v-for="pregunta in preguntas" :key="pregunta.id" class="pregunta-wrapper">
                <InputPregunta :pregunta="pregunta" v-model="respuestas[pregunta.id]" :esDimension="true" />
            </div>

            <!-- Sección especial para composición de género (solo en dimension_4) -->
            <div v-if="id === 'dimension_4' && composicionGenero.length">
                <h2 class="subtitulo">Composición por sexo</h2>
                <div v-for="pregunta in composicionGenero" :key="pregunta.id" class="pregunta-wrapper">
                    <InputPregunta :pregunta="pregunta" v-model="composicionRespuestas[pregunta.id]"
                        :esDimension="true" />
                </div>
            </div>

            <div class="acciones">
                <button type="submit" class="boton-enviar">Enviar</button>
            </div>
        </form>

        <ModalFull :visible="modalVisible" :status="modalStatus" :closable="modalClosable"
            @close="modalVisible = false">
            <template #default>
                <p v-if="modalStatus === 'loading'">Enviando respuestas...</p>
                <p v-else-if="modalStatus === 'success'">Respuestas guardadas con éxito</p>
                <p v-else-if="modalStatus === 'error'">Ocurrió un error. Intenta de nuevo</p>
            </template>
        </ModalFull>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import InputPregunta from '../preguntas/InputPregunta.vue'
import ModalFull from '../ModalFull.vue'

const route = useRoute()
const router = useRouter()

const codigo = route.params.codigo
const rawId = route.params.id
const id = rawId.replace(/-/g, '_')
const modo = route.query.modo

const dimension = ref(null)
const preguntas = ref([])
const respuestas = ref({})
const loading = ref(true)

const modalVisible = ref(false)
const modalStatus = ref(null)
const modalClosable = ref(false)

// Composición de género
const composicionGenero = ref([])
const composicionRespuestas = ref({})

onMounted(async () => {
    try {
        const { data } = await axios.get(
            `https://obtenerpreguntasdimension-34rbmbolyq-uc.a.run.app?id=${id}`
        )

        dimension.value = data.dimension
        preguntas.value = dimension.value.preguntas

        // Inicializar respuestas normales
        preguntas.value.forEach((p) => {
            respuestas.value[p.id] = ''
        })

        // Inicializar preguntas de composición de género (solo en dimension_4)
        if (id === 'dimension_4' && Array.isArray(dimension.value.composicion_genero)) {
            composicionGenero.value = dimension.value.composicion_genero

            composicionGenero.value.forEach((p) => {
                if (p.tipo_respuesta === 'composicion_multiple') {
                    // Inicializar con una fila vacía
                    composicionRespuestas.value[p.id] = [{
                        descripcion: '',
                        ...Object.fromEntries(p.columnas.map(col => [col.id, 0]))
                    }]
                } else {
                    // composicion_sencilla → objeto con claves de fila
                    const filaRes = {}
                    p.filas.forEach(f => {
                        filaRes[f.id] = { hombres: 0, mujeres: 0 }
                    })
                    composicionRespuestas.value[p.id] = filaRes
                }
            })
        }

        loading.value = false

        // 🔍 Debug visual opcional
        console.log('✅ composicionRespuestas inicializada:', JSON.stringify(composicionRespuestas.value, null, 2))
    } catch (e) {
        console.error('❌ Error cargando la dimensión:', e)
        loading.value = false
    }
})



const enviar = async () => {
    modalVisible.value = true
    modalStatus.value = 'loading'
    modalClosable.value = false

    try {
        // 🔗 Asegurarse que se incluyan las preguntas de composición en el payload
        if (id === 'dimension_4') {
            preguntas.value = [...preguntas.value, ...composicionGenero.value]
        }

        const payload = {
            institucion_id: codigo,
            dimension_id: id,
            usuario_id: JSON.parse(localStorage.getItem('usuario'))?.id || 'ANONIMO',
            respuestas: respuestas.value,
            preguntas: preguntas.value,
            composicion_genero: id === 'dimension_4' ? composicionRespuestas.value : undefined,
            composicion_genero_preguntas: id === 'dimension_4' ? composicionGenero.value : undefined // 🆕
        }

        console.log("📤 Payload:", JSON.stringify(payload, null, 2))


        const { data } = await axios.post(
            'https://guardardimension-34rbmbolyq-uc.a.run.app',
            payload
        )

        modalStatus.value = 'success'
        modalClosable.value = true

        // setTimeout(() => {
        //     router.push(`/dimensiones/${codigo}`)
        // }, 2000)
    } catch (e) {
        console.error('❌ Error al enviar respuestas:', e)
        modalStatus.value = 'error'
        modalClosable.value = true
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