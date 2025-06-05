// src/components/resultado-global/ResumenPorSubdimension.vue
<script setup>
import { ref, onMounted, watch } from 'vue';
import { useResumenSubdimensiones } from './useResumenSubdimensiones.js';

const cargando = ref(true);

const props = defineProps({
    datos: {
        type: Object,
        required: true,
    },
});

const {
    cargarMetadatosPreguntas,
    resumenPorSubdimension,
} = useResumenSubdimensiones(props.datos);

onMounted(async () => {
    cargando.value = true;
    await cargarMetadatosPreguntas();
    cargando.value = false;
});
</script>

<template>
    <div class="resumen-global">
        <div v-if="cargando">
            <p class="loading-text">⏳ Cargando resumen por subdimensión...</p>
        </div>

        <div v-else-if="!resumenPorSubdimension.length" class="alert alert-warning">
            <strong>Atención:</strong> No se encontraron datos para generar el resumen por subdimensiones.
        </div>

        <div v-else>
            <h3>Resumen Global por Subdimensión</h3>
            <p>Este resumen muestra el total de preguntas por subdimensión, las que se han respondido con "Sí" y las que
                aún están por atender.</p>
            <table class="resumen-table">
                <thead>
                    <tr>
                        <th>Dimensión</th>
                        <th>Subdimensión</th>
                        <th>Total</th>
                        <th>✅ Sí</th>
                        <th>🚧 Por atender</th>
                        <th>% Cumplimiento</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, i) in resumenPorSubdimension" :key="i">
                        <td>{{ item.dimension_nombre }}</td>
                        <td>{{ item.subdimension }}</td>
                        <td>{{ item.total }}</td>
                        <td>{{ item.si }}</td>
                        <td>{{ item.por_atender }}</td>
                        <td><strong>{{ item.porcentaje_cumplimiento }}%</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
.resumen-global {
    margin-top: 32px;
    margin-bottom: 52px;
    font-family: 'Poppins', sans-serif;
}

.resumen-table {
    width: 100%;
    border-collapse: collapse;
}

.resumen-table th,
.resumen-table td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
}

.resumen-table th {
    background-color: #f9f9f9;
    font-weight: 600;
}

.loading-text {
    text-align: center;
    font-weight: bold;
    color: #555;
    padding: 16px 0;
}
</style>
