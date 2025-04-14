<script setup>
import { onMounted, ref } from "vue";
import GaugeChart from "../../components/resultado/GaugeChart.vue"; // el gauge personalizado
import TablaSubdimensiones from "../../components/resultado/TablaSubdimensiones.vue";

const datos = ref(null);
const cargando = ref(true);

onMounted(async () => {
    const res = await fetch(`https://obtenerreporteinstitucion-34rbmbolyq-uc.a.run.app/?id=ESC-TCYU`);
    const json = await res.json();
    datos.value = json;
    cargando.value = false;
});
</script>

<template>
    <div>
        <h2>Resultados globales</h2>
        <div v-if="cargando">Cargando...</div>

        <div v-else>

            <TablaResumenGlobal :resumen="datos.global.resumenGlobal" />


            <GaugeChart :atendido="datos.global.resumenGlobal.porcentaje_total" titulo="Cumplimiento total" />
            <GaugeChart :atendido="datos.global.resumenGlobal.porcentaje_meta" titulo="Cumplimiento meta (80%)" />

            <h3>Porcentaje por dimensión</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 32px;">
                <GaugeChart v-for="(item, i) in datos.global.porcentajesPorDimension" :key="i"
                    :atendido="item.porcentaje" :titulo="item.dimension" />
            </div>

            <h3>Resumen por subdimensión</h3>
            <TablaSubdimensiones :subdimensiones="datos.global.resumenPorSubdimension" />
        </div>
    </div>
</template>
