<template>
    <div class="bloque-pregunta">
        <label class="etiqueta-pregunta">
            <span class="badge">Pregunta {{ pregunta.orden }}</span>
            <span class="texto-pregunta">{{ pregunta.pregunta }}</span>
        </label>

        <component :is="componente" v-model="respuesta" :pregunta="pregunta" :esDimension="esDimension" />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import InputTexto from './InputTexto.vue'
import InputNumero from './InputNumero.vue'
import InputRadio from './InputRadio.vue'
import InputEmail from './InputEmail.vue'

const props = defineProps({
    pregunta: Object,
    modelValue: [String, Number, Boolean],
    esDimension: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue'])

const respuesta = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const componentes = {
    texto: InputTexto,
    numero: InputNumero,
    radio: InputRadio,
    email: InputEmail,
}

const componente = computed(() => {
    return componentes[props.pregunta.tipoRespuesta] || componentes[props.pregunta.tipo] || componentes[props.pregunta.tipo_respuesta]
})
</script>

<style scoped>
.bloque-pregunta {
    padding: 16px;
    margin-bottom: 24px;
    border-left: 6px solid;
    border-image: linear-gradient(180deg, #4603ff, #00bcd4) 1;
    border-radius: 6px;
    background-color: #fdfdfd;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
    border-top: 1px solid #eee;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
    text-align: left;
}

.etiqueta-pregunta {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
}

.badge {
    display: inline-block;
    background-color: #e0eafc;
    color: #333;
    font-size: 12px;
    font-weight: 600;
    border-radius: 8px;
    padding: 2px 10px;
    margin-bottom: 18px;
    align-self: flex-start;
}

.texto-pregunta {
    font-size: 16px;
    font-weight: bold;
    color: #213547;
    line-height: 1.4;
}
</style>
