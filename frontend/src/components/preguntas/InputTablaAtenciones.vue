<script setup>
const props = defineProps({
    modelValue: {
        type: Array,
        default: () => [],
    },
    pregunta: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['update:modelValue']);

const parseNumber = (value) => Number(String(value).replace(/,/g, '')) || 0;
const formatNumber = (value) => Number(value).toLocaleString('es-MX');

function actualizarValor(filaIndex, columna, inputValue) {
    const valor = parseNumber(inputValue);
    const nueva = [...(props.modelValue || [])];

    if (!nueva[filaIndex]) {
        nueva[filaIndex] = {};
    }

    nueva[filaIndex][columna] = valor;
    emit('update:modelValue', nueva);
}
</script>

<template>
    <div class="tabla-atenciones">
        <table>
            <thead>
                <tr>
                    <th>Indicador</th>
                    <th v-for="col in props.pregunta.columnas" :key="col">{{ col }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(fila, filaIndex) in props.pregunta.filas" :key="filaIndex">
                    <td>{{ fila }}</td>
                    <td v-for="(col, colIndex) in props.pregunta.columnas" :key="colIndex">
                        <div class="input-wrapper">
                            <input type="text" :value="formatNumber(props.modelValue?.[filaIndex]?.[col] || 0)"
                                @input="actualizarValor(filaIndex, col, $event.target.value)" />
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
@import './tabla-estilos.css';
</style>
