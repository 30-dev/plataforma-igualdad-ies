<template>
  <div>
    <p class="pregunta">
      <input type="hidden" v-model="local[pregunta.pregunta]" placeholder="Etiqueta de la pregunta" />
    </p>
    <table class="composicion-multiple">
      <thead>
        <tr>
          <th></th>
          <th v-for="col in pregunta.columnas" :key="col.id">{{ col.etiqueta }}</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="fila in pregunta.filas" :key="fila.id">
          <!-- Fila normal -->
          <tr>
            <td>{{ fila.etiqueta }}</td>
            <td v-for="col in pregunta.columnas" :key="col.id">
              <input type="number" v-model.number="local[fila.id][col.id]" @input="emitir" />
            </td>
          </tr>

          <!-- Fila diferencia -->
          <tr>
            <td colspan="100%" style="font-size: 14px; padding-left: 16px; color: #555;">
              ↳ <strong>Diferencia:</strong> {{ calcularDiferencia(fila.id) }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps({
  pregunta: Object,
  modelValue: Object
})

const emit = defineEmits(['update:modelValue'])

const local = reactive({})

// Inicializar valores si vienen vacíos
props.pregunta.filas.forEach(f => {
  if (!local[f.id]) local[f.id] = {}
  props.pregunta.columnas.forEach(c => {
    local[f.id][c.id] = props.modelValue?.[f.id]?.[c.id] ?? 0
  })
})

const emitir = () => {
  emit('update:modelValue', JSON.parse(JSON.stringify(local)))
}

const calcularDiferencia = (filaId) => {
  const fila = local[filaId]
  if (!fila) return ''
  const h = parseInt(fila.hombres) || 0
  const m = parseInt(fila.mujeres) || 0
  const dif = m - h
  if (dif > 0) return `+${dif} mujeres`
  if (dif < 0) return `${-dif} hombres`
  return 'Igual'
}
</script>


<style scoped>
.composicion-multiple {
  width: 100%;
  border-collapse: collapse;
  margin: 24px 0 24px 0;


  & th,
  td {
    padding: 8px;
    text-align: left;
    border: 1px solid #ddd;
  }

  & th {
    background-color: #f2f2f2;
  }

  input {
    width: 90%;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 4px;
    font-size: 14px;
  }

}
</style>