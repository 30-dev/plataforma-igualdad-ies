<template>
    <div class="bloque-pregunta">
        <label class="etiqueta-pregunta">
            <span class="badge">Pregunta {{ pregunta.orden }}</span>
            <span class="texto-pregunta">{{ pregunta.pregunta }}</span>
        </label>

        <component :is="componente" :modelValue="valorSeguro" @update:modelValue="emit('update:modelValue', $event)"
            :pregunta="pregunta" :esDimension="esDimension" />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import InputTexto from './InputTexto.vue'
import InputNumero from './InputNumero.vue'
import InputRadio from './InputRadio.vue'
import InputEmail from './InputEmail.vue'
// import InputMatriz from './InputMatriz.vue'
import InputTablaSalarial from './InputTablaSalarial.vue'
import InputTablaAtenciones from './InputTablaAtenciones.vue'
import InputTablaQuejas from './InputTablaQuejas.vue'
import InputFecha from './InputFecha.vue'
import InputComposicionSencilla from './InputComposicionSencilla.vue'
import InputComposicionMultiple from './InputComposicionMultiple.vue'


const props = defineProps({
    pregunta: Object,
    modelValue: {
        type: [String, Number, Boolean, Array, Object],
        default: ''
    },
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
    // matriz: InputMatriz,
    tabla_salarial: InputTablaSalarial,
    tabla_quejas_genero: InputTablaQuejas,
    tabla_atenciones_mujeres: InputTablaAtenciones,
    fecha: InputFecha,
    composicion_sencilla: InputComposicionSencilla,
    composicion_multiple: InputComposicionMultiple,
}

const componente = computed(() => {
    return componentes[props.pregunta.tipoRespuesta] || componentes[props.pregunta.tipo] || componentes[props.pregunta.tipo_respuesta]
})

// Valor seguro para evitar errores cuando modelValue es string pero debería ser array
const valorSeguro = computed(() => {
    if (props.pregunta.tipo_respuesta === 'tabla') {
        return Array.isArray(props.modelValue) ? props.modelValue : [];
    }
    return props.modelValue;
});
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
