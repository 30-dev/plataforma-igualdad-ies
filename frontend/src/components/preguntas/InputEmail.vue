<!-- components/preguntas/InputEmail.vue -->
<template>
    <div class="input-email">
        <input type="email" :id="pregunta.id" v-model="email" @blur="validar" :class="{ invalido: error }" />
        <p v-if="error" class="mensaje-error">{{ error }}</p>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
    pregunta: Object,
    modelValue: String
})

const emit = defineEmits(['update:modelValue'])

const email = computed({
    get: () => props.modelValue,
    set: val => emit('update:modelValue', val)
})

const error = ref('')

function validar() {
    const val = email.value?.trim()

    if (!val) {
        error.value = 'Este campo es obligatorio.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        error.value = 'El correo no es válido.'
    } else {
        error.value = ''
    }
}

// Limpiar error cuando el usuario escribe
watch(email, () => {
    if (error.value) validar()
})
</script>

<style scoped>
.input-email {
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
}

.etiqueta {
    font-weight: bold;
    margin-bottom: 6px;
}

input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 15px;
}

.invalido {
    border-color: #e74c3c;
}

.mensaje-error {
    color: #e74c3c;
    font-size: 13px;
    margin-top: 4px;
}
</style>
