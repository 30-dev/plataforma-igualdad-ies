<script setup>
const props = defineProps({
    resumen: {
        type: Object,
        required: true,
    },
});

const clavesBonitas = {
    indicadores_totales: "Indicadores totales",
    indicadores_atendidos: "Indicadores atendidos",
    dimensiones_respondidas: "Dimensiones respondidas",
    porcentaje_total: "Porcentaje total de cumplimiento",
    meta: "Meta de cumplimiento (80%)",
    porcentaje_meta: "Porcentaje respecto a meta",
    cumple_meta: "¿Cumple meta?",
};

const camposOrdenados = [
    'indicadores_totales',
    'indicadores_atendidos',
    'dimensiones_respondidas',
    'porcentaje_total',
    'meta',
    'porcentaje_meta',
    'cumple_meta',
].reduce((acc, key) => {
    acc[key] = props.resumen[key];
    return acc;
}, {});
</script>

<template>
    <div class="resumen-container">
        <h3 class="resumen-title">
            Indicadores Globales del Autodiagnóstico
        </h3>
        <table class="resumen-table">
            <thead>
                <tr>
                    <th>Indicador</th>
                    <th>Valor</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(valor, clave, i) in camposOrdenados" :key="i">
                    <td>{{ clavesBonitas[clave] || clave }}</td>
                    <td class="valor">
                        <template v-if="clave === 'cumple_meta'">
                            <span :class="valor ? 'ok' : 'fail'">
                                {{ valor ? '✅ Sí' : '❌ No' }}
                            </span>
                        </template>
                        <template v-else>
                            {{ valor }}<span v-if="clave.includes('porcentaje')">%</span>
                            <span v-if="clave === 'meta'"> indicadores</span>
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.resumen-container {
    margin: 32px auto;
    /* max-width: 800px; */
    /* padding: 24px; */
    background-color: #fff;
    border-radius: 8px;
    font-family: 'Poppins', sans-serif;
}

.resumen-title {
    font-size: 21px;
    font-weight: 600;
    text-align: left;
    color: #333;
    margin-bottom: 20px;
}

.resumen-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 15px;
}

.resumen-table thead {
    background-color: #f9f9f9;
    border-bottom: 2px solid #ddd;
}

.resumen-table th,
.resumen-table td {
    padding: 12px;
    border: 1px solid #eee;
}

.resumen-table th {
    text-align: center;
    color: #444;
}

.resumen-table td.valor {
    text-align: right;
}

.ok {
    color: #00C853;
    font-weight: bold;
}

.fail {
    color: #D50000;
    font-weight: bold;
}
</style>
