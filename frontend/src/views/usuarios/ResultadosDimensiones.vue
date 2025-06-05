<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import axios from 'axios'
import GaugeChart from "../../components/resultado/GaugeChart.vue";
import TablaSubdimensiones from "../../components/resultado/TablaSubdimensiones.vue";
import TablaResumenGlobal from "../../components/resultado/TablaResumenGlobal.vue";
// import BarrasPorDimension from "../../components/resultado/BarrasPorDimension.vue";
import BarrasPorDimensionDirecta from "../../components/resultado/BarrasPorDimensionDirecta.vue";
import ListaDimensiones from "../../components/resultado/ListaDimensiones.vue";
import ComposicionGenero from "../../components/resultado/ComposicionGenero.vue";
import ResumenPorSubdimension from "../../components/resultado/ResultadoGlobal/ResumenPorSubdimension.vue";

const datos = ref(null);
const cargando = ref(true);
const dimensiones = ref([]);
const institucionTieneGlobal = ref(false);

const route = useRoute();
const institucionId = route.params.codigoInstitucion;

const nombresDimensiones = {
    dimension_1: "1. Formación, docencia y desarrollo de aprendizaje",
    dimension_2:
        "2. Investigación, Innovación y Desarrollo y Creación Artística",
    dimension_3: "3. Comunicación y vinculación con el medio",
    dimension_4: "4. Participación y representación en la academia",
    dimension_5: "5. Condiciones y relaciones de desarrollo laboral",
    dimension_6: "6. Acoso, hostigamiento sexual y violencia de género",
    dimension_7: "7. Corresponsabilidad social en el cuidado",
    dimension_8: "8. Institucionalidad",
    dimension_9: "9. Infraestructura",
};

onMounted(async () => {
    try {
        const res = await axios.get('https://obtenerreporteinstitucion-34rbmbolyq-uc.a.run.app', {
            params: { id: institucionId }
        });

        const json = res.data;
        datos.value = json;
        cargando.value = false;

        console.log("Datos del reporte:", json);
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
    return dimensiones.value.length === 9 && institucionTieneGlobal.value;
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

    return datos.value.reporte
        .filter(d => d.id.startsWith("dimension_"))
        .map((dim) => {
            const num = Number(dim.id.split("_")[1]);

            const respuestaSalario = dim.respuestas?.find(r => r.id === "salario_promedio_por_categoria");
            const quejasGenero = dim.respuestas?.find(r => r.id === "atencion_casos_quejas");
            const atencionesMujeres = dim.respuestas?.find(r => r.id === "tabla_atenciones_mujeres")

            console.log("dad", quejasGenero)
            console.log(atencionesMujeres)

            return {
                id: dim.id,
                numero: num,
                porcentaje: dim.cumplimientoGeneral ?? -1,
                pendientes: dim.pendientes || [],
                nombre: dim.nombre || `Dimensión ${num}`,
                descripcion: dim.descripcion || '',
                icono: dim.icono || null,
                composicion_genero: dim.composicion_genero || null,
                salario_promedio: respuestaSalario?.valor || null, // 👈 agregado aquí
                tabla_quejas_genero: quejasGenero?.valor || [], // 👈 agregado aqu
                tabla_atenciones_mujeres: atencionesMujeres?.valor || [], // 👈 agregado aquí


            };
        })
        .sort((a, b) => a.numero - b.numero);
});


const composicionGenero = computed(() => {
    const dim4 = datos.value?.reporte?.find(d => d.id === 'dimension_4');
    return dim4?.composicion_genero || {};
});


const datosBarra = computed(() => {
    return dimensionesConPendientes.value.map((d) => ({
        nombre: nombresDimensiones[d.id] || d.nombre || d.id,
        porcentaje: d.porcentaje ?? 0,
    }));
});


console.log("🔍 Dimensión 4:", dimensionesConPendientes);

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


                <ResumenPorSubdimension v-if="datos && datos.reporte" :datos="datos" />


                <BarrasPorDimensionDirecta :datos="datosBarra" />




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