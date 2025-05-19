<template>
    <div class="input-matriz">


        <table class="tabla">
            <thead>
                <tr>
                    <th>Fila</th>
                    <th v-for="col in pregunta.columnas" :key="col.id">{{ col.etiqueta }}</th>
                    <th v-if="esEditable"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(fila, index) in filas" :key="fila.id">
                    <td>
                        <input v-if="esEditable" type="text" v-model="fila.etiqueta"
                            :placeholder="'Ejemplo: Carrera, Área...'"
                            :class="['input-text', esEtiquetaInvalida(fila.etiqueta) ? 'input-error' : '']" required />
                        <span v-else>{{ fila.etiqueta }}</span>
                    </td>

                    <td v-for="col in pregunta.columnas" :key="col.id">
                        <input type="number" min="0" class="input-celda"
                            v-model.number="modelo[fila.id + '__' + col.id]" required />
                    </td>

                    <td v-if="esEditable">
                        <button type="button" @click="eliminarFila(index)" :disabled="filas.length === 1"
                            class="boton-borrar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path fill="none" stroke="#001391" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-miterlimit="10" stroke-width="1.5"
                                    d="m7.757 16.243l8.486-8.486m0 8.486L7.757 7.757" />
                            </svg>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <button v-if="esEditable" type="button" @click="agregarFila" class="boton-agregar">
            ➕ Agregar fila
        </button>
    </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'

const props = defineProps({
    pregunta: Object,
    modelValue: Object
})

const emit = defineEmits(['update:modelValue'])

const esEditable = [8, 9, 10].includes(props.pregunta.orden)
const filas = ref([...props.pregunta.filas])
const modelo = reactive({ ...props.modelValue })

// Emitimos cualquier cambio hacia el componente padre
watch(modelo, (nuevo) => {
    emit('update:modelValue', { ...nuevo })
}, { deep: true })

function agregarFila() {
    const nuevaFila = {
        id: 'fila_' + Date.now(),
        etiqueta: ''
    }
    filas.value.push(nuevaFila)
}

function eliminarFila(index) {
    if (filas.value.length > 1) {
        filas.value.splice(index, 1)
    }
}


function esEtiquetaInvalida(etiqueta) {
    const texto = etiqueta.trim().toLowerCase()
    return texto === '' || texto === 'ejemplo'
}


</script>

<style scoped>
.input-matriz {
    margin-top: 12px;
}

.pregunta {
    font-weight: bold;
    margin-bottom: 10px;
    display: block;
}

.tabla {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
}

.tabla th,
.tabla td {
    border: 1px solid #ccc;
    padding: 6px;
    text-align: center;
}

.input-celda {
    width: calc(100% - 2vw);
    text-align: center;
}

.input-text {
    width: calc(100% - 2vw);
    padding: 4px;
    border: 1px solid #ccc;
}

.boton-agregar {
    margin-top: 10px;
    padding: 6px 12px;
    background-color: #f0f0f0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.boton-agregar:hover {
    background-color: #e0e0e0;
}

.boton-borrar {
    background: transparent;
    border: none;
    font-size: 16px;
    cursor: pointer;
}
</style>
/*
Este componente es un input de tipo matriz que permite al usuario ingresar datos en una tabla.
Se utiliza principalmente para preguntas de tipo matriz en encuestas o formularios.
*/
