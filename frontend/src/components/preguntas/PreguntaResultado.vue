<template>
    <div class="pregunta">


        <!-- 📊 Si es tipo radio -->
        <div v-if="pregunta.tipo === 'radio' && pregunta.opciones">
            <h3 class="titulo">{{ pregunta.texto }}</h3>
            <div v-for="(cantidad, opcion) in pregunta.opciones" :key="opcion" class="barra">
                <span>{{ opcion }} ({{ cantidad }})</span>
                <div class="barra-container">
                    <div class="barra-fill" :style="{ width: getPorcentaje(cantidad) + '%' }"></div>
                </div>
            </div>
        </div>

        <!-- 🧮 Si es tipo número (mostrar promedio) -->
        <div v-else-if="pregunta.tipo === 'numero' && pregunta.respuestas">
            <h3 class="titulo">{{ pregunta.texto }}</h3>
            <p class="promedio">Promedio: {{ calcularPromedio() }}</p>
        </div>

        <!-- 📋 Si es tipo texto (listar) -->
        <div v-else-if="pregunta.tipo === 'texto' && pregunta.respuestas">
            <h3 class="titulo">{{ pregunta.texto }}</h3>
            <span v-for="(respuesta, index) in pregunta.respuestas" :key="index" class="respuesta-item">
                {{ respuesta }}<span v-if="index < pregunta.respuestas.length - 1">, </span>
            </span>
        </div>

        <!-- 🚫 Ignorar tipo email -->
        <div v-else-if="pregunta.tipo === 'email'">
            <!-- No se muestra nada para email -->
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

const calcularPromedio = () => {
    const respuestasNumericas = (props.pregunta.respuestas || []).map(r => Number(r)).filter(n => !isNaN(n));
    if (respuestasNumericas.length === 0) return 'N/A';
    const suma = respuestasNumericas.reduce((sum, val) => sum + val, 0);
    const promedio = suma / respuestasNumericas.length;
    return promedio.toFixed(1); // Un decimal, ej: 23.4
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

.promedio {
    font-size: 14px;
    font-weight: 500;
    color: #007bff;
    margin-top: 8px;
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
