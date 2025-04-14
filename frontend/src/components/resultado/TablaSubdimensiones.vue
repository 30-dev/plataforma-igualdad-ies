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
            <template v-for="(subdims, dimensionKey) in agrupadas" :key="dimensionKey">
                <tr v-for="(item, index) in subdims" :key="item.subdimension">
                    <!-- Solo mostrar la celda de dimensión en la primera fila del bloque -->
                    <td v-if="index === 0" :rowspan="subdims.length">
                        <span style="font-weight: bold; color: #4A96D6;">Dimensión</span>
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
