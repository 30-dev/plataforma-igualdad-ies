<template>
    <div class="reporte-container">
        <h1 class="titulo">Reporte institucional</h1>

        <div class="acciones">
            <button class="boton-generar" @click="generarReporte">Generar reporte global</button>
        </div>

        <div v-if="loading" class="loading">Cargando información del reporte...</div>

        <div v-else-if="reporte">
            <h2 class="subtitulo">Resumen Global</h2>
            <ul class="resumen-lista">
                <li><strong>Indicadores atendidos:</strong> {{ reporte.resumenGlobal.indicadores_atendidos }}</li>
                <li><strong>Porcentaje total:</strong> {{ reporte.resumenGlobal.porcentaje_total }}%</li>
                <li><strong>Porcentaje meta (80%):</strong> {{ reporte.resumenGlobal.porcentaje_meta }}%</li>
                <li><strong>¿Cumple meta?:</strong> {{ reporte.resumenGlobal.cumple_meta ? 'Sí' : 'No' }}</li>
            </ul>

            <h2 class="subtitulo">Porcentajes por dimensión</h2>
            <ul class="dimensiones-lista">
                <li v-for="item in reporte.porcentajesPorDimension" :key="item.dimension">
                    {{ item.dimension }} — {{ item.porcentaje }}%
                </li>
            </ul>
        </div>

        <ModalFull :visible="modalVisible" :status="modalStatus" :closable="modalStatus !== 'loading'"
            @close="modalVisible = false">
            <template #default>
                <p v-if="modalStatus === 'loading'">Generando reporte...</p>
                <p v-else-if="modalStatus === 'success'">¡Reporte generado con éxito!</p>
                <p v-else-if="modalStatus === 'error'">Ocurrió un error al generar el reporte.</p>
            </template>
        </ModalFull>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import ModalFull from '../../components/ModalFull.vue'

const route = useRoute()
const codigo = route.params.codigoInstitucion
const reporte = ref(null)
const loading = ref(true)

const modalVisible = ref(false)
const modalStatus = ref(null)

const cargarReporte = async () => {
    loading.value = true
    try {
        const { data } = await axios.get(`https://obtenerreporteinstitucion-34rbmbolyq-uc.a.run.app?id=${codigo}`)


        reporte.value = data.global || null
    } catch (e) {
        console.error('❌ Error al obtener reporte global:', e)
        reporte.value = null
    } finally {
        loading.value = false
    }
}

const generarReporte = async () => {
    modalVisible.value = true
    modalStatus.value = 'loading'
    try {
        await axios.post(`https://generarreporteglobal-34rbmbolyq-uc.a.run.app`, {
            institucion_id: codigo
        })
        modalStatus.value = 'success'
        await cargarReporte()
    } catch (e) {
        console.error('❌ Error generando el reporte:', e)
        modalStatus.value = 'error'
    }
}
onMounted(cargarReporte)
</script>

<style scoped>
.reporte-container {
    max-width: 780px;
    margin: 0 auto;
    padding: 20px;
}

.titulo {
    font-size: 28px;
    text-align: center;
    margin-bottom: 20px;
}

.subtitulo {
    font-size: 20px;
    margin-top: 30px;
    margin-bottom: 12px;
    color: #333;
}

.resumen-lista,
.dimensiones-lista {
    list-style: none;
    padding-left: 0;
    margin-bottom: 24px;
}

.resumen-lista li,
.dimensiones-lista li {
    padding: 6px 0;
    border-bottom: 1px solid #eee;
    font-size: 15px;
}

.acciones {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.boton-generar {
    padding: 10px 24px;
    background-color: #0077cc;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
}

.boton-generar:hover {
    background-color: #005fa3;
}

.loading {
    text-align: center;
    font-size: 18px;
}
</style>
