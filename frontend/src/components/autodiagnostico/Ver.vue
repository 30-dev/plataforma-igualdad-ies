<!-- components/autodiagnostico/Ver.vue -->
<template>
    <div class="ver-wrapper">
        <h2>Respuestas</h2>

        <div v-for="(pregunta, i) in preguntas" :key="pregunta.id" class="bloque-ver">
            <p class="pregunta">
                <strong>Pregunta {{ pregunta.orden || i + 1 }}:</strong><br />
                {{ pregunta.pregunta }}
            </p>
            <p class="respuesta">
                {{ buscarRespuesta(pregunta.id) || 'Sin respuesta' }}
            </p>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    preguntas: Array,
    respuestas: Array
})

// Función para encontrar la respuesta correspondiente por ID
const buscarRespuesta = (id) => {
    const match = props.respuestas.find((r) => r.id === id)
    return match?.respuesta
}
</script>

<style scoped>
.ver-wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.bloque-ver {
    background-color: #f4f8ff;
    border-left: 6px solid #0056b3;
    padding: 16px;
    border-radius: 6px;
}

.pregunta {
    font-size: 16px;
    color: #213547;
    margin-bottom: 6px;
}

.respuesta {
    font-size: 15px;
    color: #333;
    background-color: #ffffff;
    border: 1px solid #dce3ee;
    padding: 8px 12px;
    border-radius: 4px;
}
</style>
