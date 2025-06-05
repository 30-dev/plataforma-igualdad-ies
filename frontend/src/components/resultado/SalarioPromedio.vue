<script setup>
defineProps({
    datos: Array
});

function calcularBrecha(hombres, mujeres) {
    if (typeof hombres !== 'number' || typeof mujeres !== 'number') return 0;
    return Math.abs(hombres - mujeres);
}

function esBrechaAlta(hombres, mujeres) {
    return calcularBrecha(hombres, mujeres) >= 5000;
}
</script>

<template>
    <section class="salarios">
        <h3>Salario promedio por categoría</h3>

        <div class="tabla-scroll">
            <table class="tabla-salarios">
                <thead>
                    <tr>
                        <th>Categoría</th>
                        <th>Hombres</th>
                        <th>Mujeres</th>
                        <th>Brecha salarial</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, i) in datos" :key="i"
                        :class="{ stripe: i % 2 === 1, alerta: esBrechaAlta(item.hombres, item.mujeres) }">
                        <td>{{ item.categoria }}</td>
                        <td>${{ item.hombres?.toLocaleString() ?? 0 }}</td>
                        <td>${{ item.mujeres?.toLocaleString() ?? 0 }}</td>
                        <td><strong>${{ calcularBrecha(item.hombres, item.mujeres).toLocaleString() }}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<style scoped>
.salarios {
    margin-top: 32px;
}

.tabla-scroll {
    overflow-x: auto;
}

.tabla-salarios {
    width: 100%;
    border-collapse: collapse;
    font-family: Poppins, sans-serif;
}

.tabla-salarios th,
.tabla-salarios td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
    white-space: nowrap;
}

.tabla-salarios th {
    background-color: #f2f2f2;
    font-weight: 600;
}

.stripe {
    background-color: #fcfcfc;
}

.alerta {
    background-color: #fff3f3;
    color: #b00020;
    font-weight: bold;
}
</style>
