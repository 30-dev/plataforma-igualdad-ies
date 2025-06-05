// src/components/resultado-global/useResumenSubdimensiones.js
import { ref, computed } from "vue";
import axios from "axios";

export function useResumenSubdimensiones(datos) {
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

  const metadatosPreguntas = ref({});

  async function cargarMetadatosPreguntas() {
    const resultado = {};
    for (let i = 1; i <= 9; i++) {
      const id = `dimension_${i}`;
      try {
        const res = await axios.get(
          `https://obtenerpreguntasdimension-34rbmbolyq-uc.a.run.app/?id=${id}`
        );
        const preguntas = res.data.dimension?.preguntas;

        if (Array.isArray(preguntas)) {
          preguntas.forEach((p) => {
            resultado[p.id] = {
              subdimension: p.subdimension,
              tipo_respuesta: p.tipo_respuesta,
            };
          });
        } else {
          console.warn(
            `⚠️ La respuesta para ${id} no contiene 'preguntas' como array`
          );
        }
      } catch (e) {
        console.error(`❌ Error cargando ${id}`, e);
      }
    }
    metadatosPreguntas.value = resultado;
  }

  const resumenPorSubdimension = computed(() => {
    if (!datos || !datos.reporte || !metadatosPreguntas.value) return [];

    const resumen = {};

    datos.reporte.forEach((dim) => {
      const respuestas = Array.isArray(dim.respuestas) ? dim.respuestas : [];

      respuestas.forEach((respuesta) => {
        const meta = metadatosPreguntas.value[respuesta.id];
        if (!meta || meta.tipo_respuesta !== "radio") return;

        const sub = meta.subdimension || "Sin subdimensión";
        const val = String(respuesta.valor).toLowerCase();

        if (!resumen[sub]) {
          resumen[sub] = {
            dimension: dim.id,
            dimension_nombre: nombresDimensiones[dim.id] || dim.id,
            subdimension: sub,
            total: 0,
            si: 0,
            por_atender: 0,
          };
        }

        resumen[sub].total++;
        if (val === "si" || val === "sí") {
          resumen[sub].si++;
        } else {
          resumen[sub].por_atender++;
        }
      });
    });

    for (const sub in resumen) {
      const g = resumen[sub];
      g.porcentaje_cumplimiento =
        g.total === 0 ? 0 : Math.round((g.si / g.total) * 100);
    }

    // Convertir objeto a array y ordenar por número de dimensión
    return Object.values(resumen).sort((a, b) => {
      const numA = Number(a.dimension.split("_")[1]);
      const numB = Number(b.dimension.split("_")[1]);
      return numA - numB;
    });
  });

  return {
    cargarMetadatosPreguntas,
    resumenPorSubdimension,
  };
}
