<template>
    <div class="input-group">
        <input :id="pregunta.id" type="number" v-model="model" @blur="validar" :class="{ invalido: error }" />
        <p v-if="error" class="error-msg">{{ error }}</p>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
    modelValue: [Number, String],
    pregunta: Object
})

const emit = defineEmits(['update:modelValue'])

const model = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const error = ref('')

const validar = () => {
    const val = Number(model.value)
    if (isNaN(val)) {
        error.value = 'Debe ser un número válido'
    } else if (val < 0) {
        error.value = 'No puede ser un número negativo'
    } else {
        error.value = ''
    }
}

// También puedes validar en vivo si lo prefieres:
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
