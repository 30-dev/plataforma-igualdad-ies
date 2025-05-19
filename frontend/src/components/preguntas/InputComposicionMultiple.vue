<template>
  <div>
    <!-- <p class="pregunta">{{ pregunta.pregunta }}</p> -->
    <input type="hidden" v-model="local[pregunta.pregunta]" placeholder=" Etiqueta de la pregunta" />
    <table class="composicion-multiple">
      <thead>
        <tr>
          <th>Descripción</th>
          <th v-for="col in pregunta.columnas" :key="col.id">{{ col.etiqueta }}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(fila, i) in local" :key="i">
          <!-- Fila principal -->
          <tr>
            <td><input v-model="fila.descripcion" placeholder="Especifica" /></td>
            <td v-for="col in pregunta.columnas" :key="col.id">
              <input type="number" v-model.number="fila[col.id]" />
            </td>
            <td>
              <button type="button" @click="eliminar(i)">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
                  <path fill="#001391"
                    d="M16.95 8.464a1 1 0 0 0-1.414-1.414L12 10.586L8.464 7.05A1 1 0 1 0 7.05 8.464L10.586 12L7.05 15.536a1 1 0 1 0 1.414 1.414L12 13.414l3.536 3.536a1 1 0 1 0 1.414-1.414L13.414 12z" />
                </svg>
              </button>
            </td>
          </tr>

          <!-- Fila de diferencia -->
          <tr v-if="tieneDiferencia">
            <td colspan="100%" style="font-size: 14px; color: #555; padding-left: 16px;">
              ↳ <strong>Diferencia:</strong> {{ diferencia(fila) }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <button type="button" @click="agregar">+ Agregar fila</button>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  pregunta: Object,
  modelValue: Array
})

const emit = defineEmits(['update:modelValue'])

const local = reactive([...props.modelValue])

watch(() => props.modelValue, (nuevo) => {
  local.splice(0, local.length, ...nuevo)
})

// 🔁 Emitir al padre
const emitir = () => {
  emit('update:modelValue', [...local])
}

// ➕ Agregar fila inicial
const agregar = () => {
  const nueva = { descripcion: '' }
  props.pregunta.columnas.forEach(c => {
    nueva[c.id] = 0
  })
  local.push(nueva)
  emitir()
}

// 🗑 Eliminar fila
const eliminar = (i) => {
  local.splice(i, 1)
  if (local.length === 0) agregar() // ← asegura que haya al menos una fila
  else emitir()
}


// ✅ Agregar una fila si está vacío
if (local.length === 0) agregar()

// 🔍 ¿Puede calcular diferencia?
const tieneDiferencia = props.pregunta.columnas.some(c => c.id === 'hombres' || c.id === 'mujeres')

// 📊 Cálculo de diferencia
const diferencia = (fila) => {
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