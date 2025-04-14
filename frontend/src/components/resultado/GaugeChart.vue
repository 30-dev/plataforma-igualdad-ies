<script setup>
import { ref, onMounted } from "vue";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { GaugeChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

// Registrar lo necesario
use([GaugeChart, CanvasRenderer]);

const props = defineProps({
    atendido: Number,
    titulo: String, // ✅ título dinámico
});

const valor = Number(props.atendido) || 0;

const gaugeOptions = ref({
    animationDuration: 7000,
    animationEasing: "cubicOut",
    series: [
        {
            name: "Nivel de Atención",
            type: "gauge",
            startAngle: 180,
            endAngle: 0,
            radius: "100%",
            center: ["50%", "75%"],
            axisLine: {
                lineStyle: {
                    width: 20,
                    color: [
                        [0.5, "#D50000"],
                        [0.8, "#FFEB3B"],
                        [1, "#00C853"],
                    ],
                },
            },
            pointer: {
                width: 4,
                length: "60%",
            },
            axisTick: { show: false },
            splitLine: {
                show: true,
                length: 5,
                lineStyle: {
                    color: "#2d2d2d",
                    width: 2,
                },
                splitNumber: 5,
            },
            axisLabel: {
                show: true,
                distance: -50,
                color: "#333",
                fontSize: 12,
                formatter: (value) => `${value}%`,
            },
            detail: {
                formatter: "{value}%",
                fontSize: 24,
                color: "#333",
                rich: {
                    customFont: {
                        fontFamily: "'Poppins'",
                        fontSize: 24,
                        fontWeight: "bold",
                        color: "#333",
                    },
                },
            },
            data: [{ value: 0, name: "Atendido" }],
        },
    ],
});

onMounted(() => {
    setTimeout(() => {
        gaugeOptions.value.series[0].data[0].value = valor.toFixed(2);
    }, 500);
});
</script>

<template>
    <div style="margin-bottom: 32px; text-align: center">
        <h3 style="font-family: 'Poppins'; font-weight: 600; margin-bottom: 8px">
            {{ titulo }}
        </h3>
        <VChart :option="gaugeOptions" style="width: 100%; height: 300px" />
    </div>
</template>
