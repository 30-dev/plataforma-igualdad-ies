<script setup>
const props = defineProps({
    subdimensiones: Array,
});

// Agrupar por dimensión
const agrupadas = props.subdimensiones.reduce((acc, curr) => {
    if (!acc[curr.dimension]) acc[curr.dimension] = [];
    acc[curr.dimension].push(curr);
    return acc;
}, {});

// Crear una lista ordenada de claves tipo "dimension_1", "dimension_2", etc.
const dimensionesOrdenadas = Object.keys(agrupadas).sort((a, b) => {
    const numA = parseInt(a.split("_")[1]);
    const numB = parseInt(b.split("_")[1]);
    return numA - numB;
});
</script>

<template>
    <table border="1" cellpadding="6" cellspacing="0" style="width: 100%; border-collapse: collapse;">
        <thead>
            <tr>
                <th>Dimensión</th>
                <th>Subdimensión</th>
                <th>Total</th>
                <th>Atendidos</th>
                <th>Por atender</th>
                <th>% Cumplimiento</th>
            </tr>
        </thead>
        <tbody>
            <template v-for="dimensionKey in dimensionesOrdenadas" :key="dimensionKey">
                <tr v-for="(item, index) in agrupadas[dimensionKey]" :key="item.subdimension">
                    <td v-if="index === 0" :rowspan="agrupadas[dimensionKey].length">
                        <span style="font-weight: bold; color: #4A96D6;">
                            {{ dimensionKey.split("_")[1] }}
                        </span>
                    </td>
                    <td>{{ item.subdimension }}</td>
                    <td>{{ item.total }}</td>
                    <td>{{ item.atendidos }}</td>
                    <td>{{ item.por_atender }}</td>
                    <td><strong>{{ item.porcentaje }}%</strong></td>
                </tr>
            </template>
        </tbody>
    </table>
</template>

<style scoped>
table {
    text-align: left;
}

table th {
    text-align: center;
}
</style>