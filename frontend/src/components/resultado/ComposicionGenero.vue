<template>
    <section class="composicion">
        <h3>Brecha por género</h3>

        <table class="tabla-genero">
            <thead>
                <tr>
                    <th>Pregunta</th>
                    <th>Grupo o categoría</th>
                    <th>Mujeres</th>
                    <th>Hombres</th>
                    <th>Brecha</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(bloque, id) in datos" :key="id">
                    <template v-for="(fila, i) in bloque.filas" :key="fila.etiqueta">
                        <tr :class="[
                            i % 2 === 0 ? 'stripe' : '',
                            fila.etiqueta?.toLowerCase() === 'total' ? 'fila-total' : ''
                        ]">
                            <td v-if="i === 0" :rowspan="bloque.filas.length">{{ bloque.pregunta }}</td>
                            <td>{{ fila.etiqueta }}</td>
                            <td>{{ fila.valores.mujeres ?? 0 }}</td>
                            <td>{{ fila.valores.hombres ?? 0 }}</td>
                            <td :class="{
                                alerta: (fila.valores?.mujeres ?? 0) < (fila.valores?.hombres ?? 0)
                            }">
                                {{ fila.diferencia ?? 0 }}
                                <span v-if="(fila.valores?.mujeres ?? 0) < (fila.valores?.hombres ?? 0)" class="aviso"
                                    title="Menor participación de mujeres en esta categoría">
                                    ↘
                                </span>
                            </td>
                        </tr>
                    </template>
                </template>
            </tbody>

        </table>
    </section>
</template>

<script setup>
defineProps({
    datos: Object,
});
</script>

<style scoped>
.composicion {
    margin-top: 32px;
    font-family: 'Poppins', sans-serif;
    width: 100%;
}

.tabla-genero {
    width: 100%;
    border-collapse: collapse;
    margin-top: 16px;
}

.tabla-genero th,
.tabla-genero td {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: center;
}

.tabla-genero th {
    background-color: #f0f0f0;
    font-weight: bold;
    color: #333;
}

/* Stripe rows */
.stripe {
    background-color: #f9f9f9;
}

/* Estilo especial para filas de Total */
.fila-total {
    background-color: #e8f0fe;
    font-weight: bold;
    color: #1a237e;
}

/* Diferencia negativa (menos mujeres que hombres) */
.alerta {
    background-color: #ffebee;
    color: #c62828;
    font-weight: bold;
}
</style>
