<template>
    <div class="dimensiones-container">
        <div class="header">
            <button class="breadcrumb" @click="volver">
                ← Volver al dashboard
            </button>
            <h1 class="titulo">Dimensiones institucionales</h1>
        </div>

        <div class="grid">
            <DimensionesCard v-for="dimension in dimensiones" :key="dimension.id"
                :dimension="{ ...dimension, codigoInstitucion: codigo }" />
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DimensionesCard from '../../components/DimensionesCard.vue'

const dimensiones = ref([])
const route = useRoute()
const router = useRouter()
const codigo = route.params.codigoInstitucion

onMounted(async () => {
    try {
        const res = await fetch(
            `https://obtenerdimensionesconestado-34rbmbolyq-uc.a.run.app/?codigo=${codigo}`
        )
        const data = await res.json()
        dimensiones.value = data.dimensiones || []
    } catch (e) {
        console.error('Error al obtener dimensiones:', e)
    }
})

const volver = () => {
    router.push('/dashboard')
}
</script>

<style scoped>
.dimensiones-container {
    padding: 20px;
    max-width: 900px;
    margin: 0 auto;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    flex-wrap: wrap;
}

.breadcrumb {
    background: none;
    border: none;
    color: #0077cc;
    font-weight: bold;
    cursor: pointer;
    font-size: 14px;
    padding: 0;
    margin-bottom: 10px;
}

.breadcrumb:hover {
    text-decoration: underline;
}

.titulo {
    font-size: 28px;
    text-align: left;
    flex: 1 1 100%;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
}
</style>
