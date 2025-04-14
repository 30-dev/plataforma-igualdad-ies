<template>
    <div class="resultados-wrapper">
        <router-link :to="`/comunidad-encuestas/${institucionId}`" class="breadcrumb">
            ← Volver a levantamiento de encuestas
        </router-link>
        <h1>Resultados de encuestas</h1>

        <transition name="fade">
            <section v-if="resultados.estudiantes && resultados.estudiantes.length">
                <h2>📘 Estudiantes</h2>
                <PreguntaResultado v-for="(pregunta, id) in resultados.estudiantes" :key="id" :pregunta="pregunta" />
            </section>
        </transition>

        <transition name="fade">
            <section v-if="resultados.personal && resultados.personal.length">
                <h2>📙 Personal</h2>
                <PreguntaResultado v-for="(pregunta, id) in resultados.personal" :key="id" :pregunta="pregunta" />
            </section>
        </transition>

        <transition name="fade">
            <p v-if="!resultados.personal || !resultados.personal.length">
                ⚠️ No hay resultados para el personal.
            </p>
        </transition>

        <transition name="fade">
            <p v-if="
                (!resultados.estudiantes || !resultados.estudiantes.length) &&
                (!resultados.personal || !resultados.personal.length)
            ">
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

const route = useRoute()
const institucionId = route.params.codigo

// 🔧 Función para transformar y ordenar preguntas
const transformarYOrdenarPreguntas = (preguntasObj) => {
    return Object.entries(preguntasObj)
        .sort(([idA], [idB]) => {
            const numA = parseInt(idA.split('-').pop())
            const numB = parseInt(idB.split('-').pop())
            return numA - numB
        })
        .map(([id, pregunta]) => ({ id, ...pregunta }))
}

// 🔹 Cargar estudiantes
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

// 🔹 Cargar personal
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

onMounted(() => {
    fetchEstudiantes()
    fetchPersonal()
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
</style>
