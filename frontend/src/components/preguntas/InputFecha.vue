<template>
    <div class="input-group">
        <input :id="pregunta.id" type="date" v-model="model" @blur="validar" :max="hoy" :class="{ invalido: error }" />
        <p v-if="error" class="error-msg">{{ error }}</p>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
    modelValue: String,
    pregunta: Object
})

const emit = defineEmits(['update:modelValue'])

const model = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const error = ref('')

// Calculamos la fecha actual en formato YYYY-MM-DD
const hoy = new Date().toISOString().split('T')[0]

const validar = () => {
    if (!model.value) {
        error.value = 'La fecha es obligatoria.'
        return
    }

    const fechaIngresada = new Date(model.value)
    const fechaHoy = new Date(hoy)

    if (isNaN(fechaIngresada)) {
        error.value = 'Debe ingresar una fecha válida.'
    } else if (fechaIngresada > fechaHoy) {
        error.value = 'No se puede ingresar una fecha futura.'
    } else {
        error.value = ''
    }
}

watch(() => model.value, validar)
</script>

<style scoped>
.input-group {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
}

label {
    font-weight: bold;
    margin-bottom: 6px;
    color: #333;
}

input {
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

input.invalido {
    border-color: red;
}

.error-msg {
    color: red;
    font-size: 13px;
    margin-top: 4px;
}
</style>
