<template>
    <div class="pregunta">
        <h3 class="titulo">{{ pregunta.texto }}</h3>

        <!-- 📊 Si es tipo radio -->
        <div v-if="pregunta.tipo === 'radio' && pregunta.opciones">
            <div v-for="(cantidad, opcion) in pregunta.opciones" :key="opcion" class="barra">
                <span>{{ opcion }} ({{ cantidad }})</span>
                <div class="barra-container">
                    <div class="barra-fill" :style="{ width: getPorcentaje(cantidad) + '%' }"></div>
                </div>
            </div>
        </div>

        <div v-else-if="pregunta.tipo === 'texto' || pregunta.tipo === 'email' || pregunta.tipo === 'numero'">
            <span v-for="(respuesta, index) in pregunta.respuestas" :key="index" class="respuesta-item">
                {{ respuesta }}<span v-if="index < pregunta.respuestas.length - 1">, </span>
            </span>
        </div>

        <!-- ❗ Tipo no manejado -->
        <p v-else class="error">Tipo de pregunta no reconocido.</p>
    </div>
</template>

<script setup>
const props = defineProps({
    pregunta: Object
})

const getPorcentaje = (cantidad) => {
    const total = Object.values(props.pregunta.opciones || {}).reduce((sum, val) => sum + val, 0)
    return total > 0 ? Math.round((cantidad / total) * 100) : 0
}
</script>

<style scoped>
.pregunta {
    margin-bottom: 48px;
    padding-bottom: 32px;
    border-bottom: 1px solid #eaeaea;
    text-align: left;
}

.titulo {
    font-size: 16px;
    font-weight: 600;
    color: #213547;
    margin-bottom: 8px;
}

.barra {
    margin-bottom: 8px;
}

.barra-container {
    background-color: #e0e0e0;
    border-radius: 4px;
    height: 10px;
    width: 100%;
    margin-top: 4px;
}

.barra-fill {
    background-color: #007bff;
    height: 100%;
    border-radius: 4px;
}

ul {
    padding-left: 20px;
    margin-top: 8px;
}

li {
    font-size: 14px;
    margin-bottom: 4px;
}

.error {
    font-style: italic;
    color: red;
}
</style>
