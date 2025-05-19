<script setup>
import GaugeChart from "./GaugeChart.vue";
import { computed } from "vue";

const props = defineProps({
    dimension: {
        type: Object,
        required: true,
    },
});

// Agrupamos los pendientes por subdimensión
const pendientesAgrupados = computed(() => {
    const grupos = {};
    if (props.dimension.pendientes && Array.isArray(props.dimension.pendientes)) {
        props.dimension.pendientes.forEach((pendiente) => {
            const sub = pendiente.subdimension || "Otros";
            if (!grupos[sub]) grupos[sub] = [];
            grupos[sub].push(pendiente.pregunta);
        });
    }
    return grupos;
});
</script>

<template>
    <div class="dimension-card">

        <!-- Encabezado con ícono, nombre y descripción -->
        <div class="dimension-header">
            <div>
                <div class="title-descripcion">
                    <img v-if="dimension.icono" :src="dimension.icono" alt="ícono" class="dimension-icon" />
                    <h4>{{ dimension.nombre || dimension.dimension }}</h4>
                </div>
                <p class="dimension-desc">{{ dimension.descripcion }}</p>
            </div>
        </div>


        <GaugeChart :atendido="dimension.porcentaje" :titulo="'% Cumplimiento'" />

        <div v-if="Object.keys(pendientesAgrupados).length">
            <h5 class="titulo-oportunidad">Áreas de oportunidad</h5>
            <p class="titulo-descripcion">
                Las siguientes preguntas han sido identificadas como áreas de oportunidad porque sus respuestas indican
                que aún no se han cumplido completamente (por ejemplo, fueron respondidas como "No" o "Parcialmente").
                Estas representan puntos clave para fortalecer el compromiso institucional con la igualdad de género.
            </p>



            <div v-for="(preguntas, subdimension) in pendientesAgrupados" :key="subdimension" class="bloque-sub">
                <strong class="title-subdimension">{{ subdimension }}</strong>
                <ul>
                    <li v-for="(pregunta, index) in preguntas" :key="index">{{ pregunta }}</li>
                </ul>
            </div>
        </div>

        <p v-else>✅ Sin áreas de oportunidad</p>
    </div>
</template>

<style scoped>
.dimension-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border: 1px solid #ccc;
    border-radius: 12px;
    padding: 16px;
    width: 100%;
    font-family: Poppins, sans-serif;
}

.title-descripcion {

    display: flex;
    align-items: center;
    gap: 12px;
    text-align: left;
    /* outline: 1px solid red; */

    & img {
        height: 24px;
    }

    h4 {
        margin: 0;
    }

}

.dimension-desc {
    text-align: left;
}


.titulo-descripcion {
    text-align: left;
}

.title-subdimension {
    display: block;
    text-align: left;
    border-bottom: 1px solid #d2d2d2;
}

.dimension-card h4 {
    margin-top: 0;
    font-size: 18px;
}

.titulo-oportunidad {
    margin: 16px auto 0;
    font-size: 16px;
    color: #333;
    text-align: left;
}

ul {
    list-style: none;
    text-align: left;
    padding-left: 0;
}

li {
    margin: 12px 0;
}


.bloque-sub {
    margin-top: 12px;
}
</style>
