<template>
    <div class="contenedor">
        <div class="breadcrumb">
            <button @click="volverADimensiones">← Volver a dimensiones</button>
        </div>
        <component :is="componenteActual" :codigo="codigo" :dimensionId="dimensionId" />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Importa tus 3 componentes

import Editar from '../../components/dimensiones/Editar.vue'
import Responder from '../../components/dimensiones/Responder.vue'


const route = useRoute()
const router = useRouter()


const codigo = route.params.codigo
const dimensionId = route.params.id.replace(/-/g, '_')
const modo = route.query.modo || 'responder' // modo por default

const componenteActual = computed(() => {
    switch (modo) {
        case 'editar':
            return Editar
        default:
            return Responder
    }
})

const volverADimensiones = () => {
    router.push(`/dimensiones/${codigo}`)
}
</script>
