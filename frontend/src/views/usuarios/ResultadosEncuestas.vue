<template>
    <div class="resultados-wrapper">
        <router-link :to="`/comunidad-encuestas/${institucionId}`" class="breadcrumb">
            ← Volver a levantamiento de encuestas
        </router-link>

        <h1>Resultados de encuestas</h1>

        <transition name="fade">
            <p v-if="loading" class="cargando">⏳ Cargando resultados...</p>
        </transition>

        <transition name="fade">
            <section v-if="!loading && resultados.estudiantes.length">
                <h2>📘 Estudiantes</h2>
                <PreguntaResultado v-for="(pregunta, id) in resultados.estudiantes" :key="id" :pregunta="pregunta" />
            </section>
        </transition>

        <transition name="fade">
            <section v-if="!loading && resultados.personal.length">
                <h2>📙 Personal</h2>
                <PreguntaResultado v-for="(pregunta, id) in resultados.personal" :key="id" :pregunta="pregunta" />
            </section>
        </transition>

        <transition name="fade">
            <p v-if="!loading && (!resultados.personal.length && !resultados.estudiantes.length)">
                ❌ No hay resultados disponibles para esta institución.
            </p>
        </transition>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import PreguntaResultado from '../../components/preguntas/PreguntaResultado.vue'
import { useRoute } from 'vue-router'

const resultados = ref({
    estudiantes: [],
    personal: []
})

const loading = ref(true) // Nuevo estado de carga

const route = useRoute()
const institucionId = route.params.codigo

const transformarYOrdenarPreguntas = (preguntasObj) => {
    return Object.entries(preguntasObj)
        .sort(([idA], [idB]) => {
            const numA = parseInt(idA.split('-').pop())
            const numB = parseInt(idB.split('-').pop())
            return numA - numB
        })
        .map(([id, pregunta]) => ({ id, ...pregunta }))
}

const fetchEstudiantes = async () => {
    try {
        const res = await axios.get('https://obtenerresultadosencuesta-34rbmbolyq-uc.a.run.app', {
            params: { encuesta_id: 'estudiantes', institucion_id: institucionId }
        })
        resultados.value.estudiantes = res.data.preguntas
            ? transformarYOrdenarPreguntas(res.data.preguntas)
            : []
    } catch (error) {
        console.error('Error al obtener resultados de estudiantes:', error)
        resultados.value.estudiantes = []
    }
}

const fetchPersonal = async () => {
    try {
        const res = await axios.get('https://obtenerresultadosencuesta-34rbmbolyq-uc.a.run.app', {
            params: { encuesta_id: 'personal', institucion_id: institucionId }
        })
        resultados.value.personal = res.data.preguntas
            ? transformarYOrdenarPreguntas(res.data.preguntas)
            : []
    } catch (error) {
        console.error('Error al obtener resultados de personal:', error)
        resultados.value.personal = []
    }
}

onMounted(async () => {
    await Promise.all([
        fetchEstudiantes(),
        fetchPersonal()
    ])
    loading.value = false // Cuando ambas respuestas llegan, loading = false
})
</script>

<style scoped>
.resultados-wrapper {
    max-width: 960px;
    margin: auto;
    padding: 40px 16px;
}

h1 {
    font-size: 28px;
    margin-bottom: 24px;
    text-align: left;
    color: #213547;
}

h2 {
    font-size: 20px;
    text-align: left;
    margin: 32px 0 16px;
    color: #0056b3;
}

.breadcrumb {
    display: inline-block;
    margin-bottom: 16px;
    font-size: 14px;
    color: #0077cc;
    text-decoration: none;
    text-align: left;
    width: 100%;
    transition: color 0.2s ease;
}

.breadcrumb:hover {
    color: #005099;
    text-decoration: underline;
}

.cargando {
    font-size: 16px;
    font-weight: 500;
    color: #555;
    margin-bottom: 20px;
}
</style>
