<template>
    <div class="contenedor-opciones">
        <div v-for="opcion in pregunta.opciones" :key="opcion.valor" class="opcion-radio">
            <label>
                <input type="radio" :value="opcion.valor" v-model="modelValueLocal" />
                {{ opcion.descripcion }}
            </label>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    modelValue: String,
    pregunta: Object
})

const emit = defineEmits(['update:modelValue'])

const modelValueLocal = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})
</script>

<style scoped>
.contenedor-opciones {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.opcion-radio label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 15px;
    color: #333;
}
</style>
