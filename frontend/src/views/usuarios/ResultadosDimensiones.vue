<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import axios from 'axios'
import GaugeChart from "../../components/resultado/GaugeChart.vue";
import TablaSubdimensiones from "../../components/resultado/TablaSubdimensiones.vue";
import TablaResumenGlobal from "../../components/resultado/TablaResumenGlobal.vue";
import BarrasPorDimension from "../../components/resultado/BarrasPorDimension.vue";
import ListaDimensiones from "../../components/resultado/ListaDimensiones.vue";

const datos = ref(null);
const cargando = ref(true);
const dimensiones = ref([]);
const institucionTieneGlobal = ref(false);

const route = useRoute();
const institucionId = route.params.codigoInstitucion;

onMounted(async () => {
    try {
        const res = await axios.get('https://obtenerreporteinstitucion-34rbmbolyq-uc.a.run.app', {
            params: { id: institucionId }
        });

        const json = res.data;
        datos.value = json;
        cargando.value = false;

        // Detectar dimensiones
        // dimensiones.value = Object.keys(json).filter(k => k.startsWith("dimension_"));
        dimensiones.value = (json.reporte || []).map(d => d.id).filter(id => id.startsWith("dimension_"));


        // Verificar si ya tiene reporte global
        institucionTieneGlobal.value = !!json.global;
    } catch (err) {
        console.error("Error al obtener reporte:", err);
    }
});

const puedeGenerarReporte = computed(() => {
    return dimensiones.value.length === 9 && !institucionTieneGlobal.value;
});

const generarReporte = async () => {
    try {
        const res = await axios.post('https://generarreporteglobal-34rbmbolyq-uc.a.run.app', {
            institucion_id: institucionId,
        });

        // Refrescar datos
        datos.value.global = res.data;
        institucionTieneGlobal.value = true;
    } catch (err) {
        console.error("Error al generar reporte:", err);
        alert("Error al generar el reporte. Intenta de nuevo.");
    }
};

const dimensionesConPendientes = computed(() => {
    if (!datos.value) return [];

    return datos.value.global.porcentajesPorDimension
        .map((dim) => {
            const num = Number(dim.dimension.split(" ")[1]); // "Dimensión 3" → 3
            const id = `dimension_${num}`;
            const dimensionInfo = datos.value.reporte.find((r) => r.id === id);
            return {
                ...dim,
                id,
                numero: num,
                pendientes: dimensionInfo?.pendientes || [],
            };
        })
        .sort((a, b) => a.numero - b.numero);
});
</script>


<template>
    <div class="resultado-container">

        <div v-if="cargando">Cargando...</div>




        <div v-else>

            <router-link :to="`/dashboard-usuario/${institucionId}`" class="breadcrumb">
                ← Volver al dashboard
            </router-link>

            <h1 class="title-resumen">
                Resumen Global de Resultados<br>
                del <strong>Autodiagnóstico de <br>
                    las 9 Dimensiones</strong>
            </h1>


            <div style="margin-bottom: 24px;">
                <button v-if="puedeGenerarReporte" @click="generarReporte" class="btn btn-primary">
                    Generar reporte global
                </button>

                <p v-else-if="dimensiones.length < 9" class="text-warning">
                    ⚠️ Para conocer estos resultados es necesario responder todas las dimensiones.
                </p>

                <p v-else-if="institucionTieneGlobal" class="text-success">
                    ✅ El reporte global ya fue generado y está visible abajo.
                </p>
            </div>

            <hr />

            <div v-if="datos && datos.global">


                <TablaResumenGlobal :resumen="datos.global.resumenGlobal" />

                <BarrasPorDimension :datos="datos.global.porcentajesPorDimension" />


                <h3>Resumen por subdimensión</h3>
                <TablaSubdimensiones :subdimensiones="datos.global.resumenPorSubdimension" />

                <!-- <pre>
                {{ datos.global.porcentajesPorDimension }}
            </pre> -->


                <GaugeChart :atendido="datos.global.resumenGlobal.porcentaje_total" titulo="Cumplimiento total" />
                <GaugeChart :atendido="datos.global.resumenGlobal.porcentaje_meta" titulo="Cumplimiento meta (80%)" />

                <h3>Porcentaje por dimensión</h3>
                <ListaDimensiones :dimensiones="dimensionesConPendientes" />
            </div>
            <!-- <div style="display: flex; flex-wrap: wrap; gap: 32px;">
                <GaugeChart v-for="(item, i) in datos.global.porcentajesPorDimension" :key="i"
                    :atendido="item.porcentaje" :titulo="item.dimension" />
            </div> -->


        </div>
    </div>
</template>

<style scoped>
.resultado-container {
    padding: 20px;
    max-width: 900px;
    margin: 0 auto;
}

.breadcrumb {
    display: inline-block;
    margin-bottom: 16px;
    font-size: 14px;
    color: #0077cc;
    text-decoration: none;
    text-align: left;
    width: 100%;
    transition: color 0.2s ease;
}

.breadcrumb:hover {
    color: #005099;
    text-decoration: underline;
}

.title-resumen {
    font-size: 28px;
    margin-bottom: 24px;
    font-weight: normal;
    text-align: left;
    color: var(--primary-color);
}
</style>