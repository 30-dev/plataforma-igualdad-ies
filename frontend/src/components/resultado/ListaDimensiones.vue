<script setup>
import { onMounted, ref, computed } from 'vue';
import DimensionCard from './DimensionCard.vue';

// Propiedad esperada: dimensiones del reporte global con porcentaje y pendientes
const props = defineProps({
    dimensiones: {
        type: Array,
        required: true,
    },
});

const metadatos = ref([]); // Aquí cargaremos los metadatos (nombre, descripción, icono)
const cargando = ref(true);

// Al montar, pedimos los metadatos de cada dimensión individualmente
onMounted(async () => {
    const promesas = props.dimensiones.map(async (dim) => {
        const num = dim.dimension.split(" ")[1]; // Ej: "Dimensión 3" → 3
        const id = `dimension_${num}`;
        try {
            const res = await fetch(
                `https://obtenerpreguntasdimension-34rbmbolyq-uc.a.run.app/?id=${id}&resumen=true`
            );
            const json = await res.json();
            return { id, ...json.dimension };
        } catch (e) {
            console.error(`Error al cargar ${id}`, e);
            return { id, nombre: null, descripcion: null, icono: null };
        }
    });

    metadatos.value = await Promise.all(promesas);
    cargando.value = false;
});

// Combinar reporte global + metadatos
const dimensionesConInfo = computed(() => {
    return props.dimensiones.map((dim) => {
        const num = dim.dimension.split(" ")[1];
        const id = `dimension_${num}`;
        const meta = metadatos.value.find((m) => m.id === id);
        return {
            ...dim,
            ...meta, // agrega nombre, descripcion, icono
        };
    });
});
</script>

<template>
    <div class="lista-dimensiones">
        <p v-if="cargando">🔄 Cargando dimensiones...</p>
        <DimensionCard v-for="(dim, index) in dimensionesConInfo" :key="index" :dimension="dim" />
    </div>
</template>

<style scoped>
.lista-dimensiones {
    display: flex;
    flex-wrap: wrap;
    gap: 32px;
    margin-top: 32px;
}
</style>
