<script setup>
import { ref, watch } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
} from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';



use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    BarChart,
    CanvasRenderer,
]);

const props = defineProps({
    datos: {
        type: Array,
        required: true,
    },
});

const nombres = ref([]);
const valores = ref([]);
const colores = ref([]);
const option = ref({});

watch(
    () => props.datos,
    procesarDatos,
    { immediate: true }
);

function procesarDatos() {
    const invertido = [...props.datos].reverse();

    // 🔁 Aquí usamos el nombre real
    nombres.value = invertido.map((d) => d.nombre);
    valores.value = invertido.map((d) => d.porcentaje);

    colores.value = valores.value.map((val) => {
        if (val >= 80) return '#00C853'; // verde
        if (val >= 50) return '#FFEB3B'; // amarillo
        return '#D50000'; // rojo
    });

    option.value = {
        title: {
            text: 'Cumplimiento por Dimensión',
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold',
            },
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: '{b}: {c}%',
        },
        grid: {
            left: '10%',
            right: '10%',
            bottom: '5%',
            top: 60,
            containLabel: true,
        },
        xAxis: {
            type: 'value',
            max: 100,
            name: '%',
        },
        yAxis: {
            type: 'category',
            data: nombres.value,
            axisLabel: {
                fontWeight: 'bold',
                lineHeight: 18,
                formatter: (value) => value.length > 32
                    ? value.slice(0, 30) + '...'
                    : value, // Opcional: recorta nombres largos
            },
        },
        series: [
            {
                name: 'Cumplimiento',
                type: 'bar',
                data: valores.value.map((v, i) => ({
                    value: v,
                    itemStyle: {
                        color: colores.value[i],
                    },
                })),
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{c}%',
                },
                barWidth: 24,
                markLine: {
                    symbol: 'none',
                    label: {
                        formatter: 'Meta 80%',
                        position: 'end',
                        fontWeight: 'bold',
                        color: '#4A96D6',
                    },
                    lineStyle: {
                        type: 'dashed',
                        color: '#4A96D6',
                        width: 2,
                    },
                    data: [{ xAxis: 80 }],
                },
            },
        ],
    };
}

</script>

<template>
    <div style="width: 100%; max-width: 900px; margin: 0 auto;">
        <VChart :option="option" style="height: 500px; width: 100%" />
    </div>
</template>
