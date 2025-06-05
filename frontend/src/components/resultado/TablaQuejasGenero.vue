// TablaQuejasGenero.vue
<template>
    <section class="tabla-genero">
        <!-- <h3>Resumen de quejas por género</h3> -->
        <table>
            <thead>
                <tr>
                    <th>Tipo de queja</th>
                    <th>Mujeres</th>
                    <th>Hombres</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(fila, index) in datos" :key="index" :class="{ stripe: index % 2 === 0 }">
                    <td>{{ etiquetas[index] || `Fila ${index + 1}` }}</td>
                    <td :class="{ alerta: fila.Mujeres > 0 }">{{ fila.Mujeres ?? 0 }}</td>
                    <td :class="{ alerta: fila.Hombres > 0 }">{{ fila.Hombres ?? 0 }}</td>
                </tr>
            </tbody>
        </table>
    </section>
</template>

<script setup>
defineProps({
    datos: Array,
    etiquetas: Array,
});
</script>

<style scoped>
.tabla-genero {
    margin-top: 32px;
}

h3 {
    margin-bottom: 12px;
}

table {
    width: 100%;
    border-collapse: collapse;
    font-family: Poppins, sans-serif;
}

th,
td {
    border: 1px solid #ccc;
    padding: 8px 12px;
    text-align: center;
}

th {
    background: #f0f0f0;
}

.stripe {
    background: #fafafa;
}

.alerta {
    color: #d32f2f;
    font-weight: bold;
}
</style>