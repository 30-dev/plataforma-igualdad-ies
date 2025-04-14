<template>
    <div class="input-radio">
        <div class="opciones">
            <label v-for="(opcion, i) in pregunta.opciones" :key="i">
                <input type="radio" :name="pregunta.id" :value="esDimension ? opcion.valor : opcion"
                    v-model="respuestaLocal" @change="validar" />
                {{ esDimension ? opcion.descripcion : opcion }}
            </label>
        </div>

        <p v-if="error" class="error-text">Por favor selecciona una opción</p>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    pregunta: Object,
    modelValue: String,
    esDimension: {
        type: Boolean,
        default: false // 👈 por defecto es encuesta normal
    }
})

const emit = defineEmits(['update:modelValue'])

const respuestaLocal = ref(props.modelValue || '')
const error = ref(false)

watch(() => props.modelValue, (nuevoValor) => {
    respuestaLocal.value = nuevoValor
})

watch(respuestaLocal, (nuevoValor) => {
    emit('update:modelValue', nuevoValor)
    if (nuevoValor) error.value = false
})

const validar = () => {
    if (!respuestaLocal.value) {
        error.value = true
    }
}

defineExpose({ validar })
</script>

<style scoped>
.input-radio {
    display: flex;
    flex-direction: column;
    gap: 4px;
    cursor: pointer;
}

.opciones label {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
}

.error-text {
    color: red;
    font-size: 13px;
    margin-top: 4px;
}
</style>
