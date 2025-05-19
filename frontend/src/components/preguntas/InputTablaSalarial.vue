<script setup>
import { ref } from 'vue';

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

// Quitar comas y convertir a número
const parseNumber = (value) => {
    return Number(String(value).replace(/,/g, '')) || 0;
};

// Formatear a número con comas
const formatNumber = (value) => {
    return Number(value).toLocaleString('es-MX');
};

// Emitir nuevo array al modificar un campo
const actualizarValor = (index, campo, inputValue) => {
    const realNumber = parseNumber(inputValue);
    const copia = [...(props.modelValue || [])];
    if (!copia[index]) {
        copia[index] = {
            ...props.pregunta.categorias[index],
            hombres: 0,
            mujeres: 0,
        };
    }
    copia[index][campo] = realNumber;
    emit('update:modelValue', copia);
};
</script>

<template>
    <div class="tabla-salarial">
        <table>
            <thead>
                <tr>
                    <th>Categoría</th>
                    <th>Hombres</th>
                    <th>Mujeres</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(fila, index) in props.pregunta.categorias" :key="index">
                    <td>{{ fila.categoria }}</td>
                    <td>
                        <div class="input-wrapper">
                            <span class="moneda">$</span>
                            <input type="text" :value="formatNumber(props.modelValue?.[index]?.hombres || 0)"
                                @input="actualizarValor(index, 'hombres', $event.target.value)" />
                        </div>
                    </td>
                    <td>
                        <div class="input-wrapper">
                            <span class="moneda">$</span>
                            <input type="text" :value="formatNumber(props.modelValue?.[index]?.mujeres || 0)"
                                @input="actualizarValor(index, 'mujeres', $event.target.value)" />
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.tabla-salarial {
    overflow-x: auto;
    margin-top: 10px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
}

table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
}

th {
    background-color: #f5f8fa;
    text-align: left;
    padding: 12px;
    font-weight: 600;
    color: #374151;
    border-bottom: 1px solid #e5e7eb;
}

td {
    padding: 10px 12px;
    border-bottom: 1px solid #f1f5f9;
    color: #1f2937;
}

td:first-child {
    font-weight: 500;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.moneda {
    position: absolute;
    left: 10px;
    color: #6b7280;
    font-size: 14px;
}

input {
    width: 100%;
    padding: 8px 10px 8px 22px;
    font-size: 14px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background-color: #f9fafb;
    text-align: right;
    transition: border-color 0.2s ease;
}

input:focus {
    outline: none;
    border-color: #3b82f6;
    background-color: #fff;
}
</style>
