<script setup>
const props = defineProps({
    resumen: {
        type: Object,
        required: true,
    },
});
</script>

<template>
    <div style="margin: 24px auto; max-width: 800px;">
        <h3 style="font-family: 'Poppins'; margin-bottom: 16px; font-size: 20px;">
            📊 Resumen Global del Autodiagnóstico
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-family: 'Poppins'; font-size: 15px;">
            <thead style="background-color: #f0f0f0;">
                <tr>
                    <th style="text-align: left; padding: 10px; border: 1px solid #ccc;">Indicador</th>
                    <th style="text-align: right; padding: 10px; border: 1px solid #ccc;">Valor</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ccc;">Indicadores totales</td>
                    <td style="text-align: right; padding: 10px; border: 1px solid #ccc;">{{ resumen.indicadores_totales
                    }}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ccc;">Indicadores atendidos</td>
                    <td style="text-align: right; padding: 10px; border: 1px solid #ccc;">{{
                        resumen.indicadores_atendidos }}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ccc;">Dimensiones respondidas</td>
                    <td style="text-align: right; padding: 10px; border: 1px solid #ccc;">{{
                        resumen.dimensiones_respondidas }}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ccc;">Porcentaje total de cumplimiento</td>
                    <td style="text-align: right; padding: 10px; border: 1px solid #ccc;">{{ resumen.porcentaje_total
                    }}%</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ccc;">Meta de cumplimiento (80%)</td>
                    <td style="text-align: right; padding: 10px; border: 1px solid #ccc;">{{ resumen.meta }}%</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ccc;">Porcentaje respecto a meta</td>
                    <td style="text-align: right; padding: 10px; border: 1px solid #ccc;">{{ resumen.porcentaje_meta }}%
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ccc;">¿Cumple meta?</td>
                    <td style="text-align: right; padding: 10px; border: 1px solid #ccc;">
                        <span :style="{ color: resumen.cumple_meta ? 'green' : 'red' }">
                            {{ resumen.cumple_meta ? '✅ Sí' : '❌ No' }}
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
