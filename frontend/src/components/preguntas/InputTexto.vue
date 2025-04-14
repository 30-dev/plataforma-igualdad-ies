<template>
    <div class="input-texto">
        <input :id="pregunta.id" type="text" v-model="valor" @blur="validar" />
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

const valor = ref(props.modelValue || '')
const error = ref('')

watch(valor, (val) => {
    emit('update:modelValue', val)
    if (val.length >= 3) error.value = ''
})

const validar = () => {
    if (valor.value.trim().length < 3) {
        error.value = 'Debe tener al menos 3 caracteres.'
    }
}
</script>

<style scoped>
.input-texto {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

label {
    font-weight: bold;
}

input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.error-msg {
    color: #cc0000;
    font-size: 13px;
}
</style>
