export const guardarDimension = https.onRequest(async (req, res) => {
  setCORSHeaders(res, "POST");

  if (req.method === "OPTIONS") return res.status(204).send("");
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const {
    institucion_id,
    dimension_id,
    usuario_id,
    respuestas,
    preguntas,
    brecha_salarial,
  } = req.body;

  if (
    !institucion_id ||
    !dimension_id ||
    !usuario_id ||
    !respuestas ||
    !Array.isArray(preguntas) ||
    preguntas.length === 0
  ) {
    return res.status(400).json({
      error: { message: "Faltan campos obligatorios o preguntas vacías." },
    });
  }

  try {
    const docRef = db.collection("respuestas").doc(institucion_id);

    // Convertimos respuestas normales
    const respuestasNormales = Object.entries(respuestas).map(
      ([id, valor]) => ({
        id,
        valor,
      })
    );

    const dataGuardar = {
      respuestas: respuestasNormales,
    };

    // 🔍 Si estamos en dimensión 5 y hay tabla
    if (dimension_id === "dimension_5" && Array.isArray(brecha_salarial)) {
      const resumenBrecha = brecha_salarial.map((fila) => {
        const hombres = Number(fila.hombres) || 0;
        const mujeres = Number(fila.mujeres) || 0;
        const brecha = mujeres - hombres;

        return {
          categoria: fila.categoria,
          hombres,
          mujeres,
          brecha,
        };
      });

      dataGuardar.brecha_salarial_resultado = resumenBrecha;

      // 🧮 Cálculos
      const total = resumenBrecha.length;
      const conBrecha = resumenBrecha.filter((item) => item.brecha < 0);
      const promedioBrecha = Math.round(
        resumenBrecha.reduce((acc, curr) => acc + curr.brecha, 0) / total
      );

      const promedioHombres = Math.round(
        resumenBrecha.reduce((acc, curr) => acc + curr.hombres, 0) / total
      );

      const promedioMujeres = Math.round(
        resumenBrecha.reduce((acc, curr) => acc + curr.mujeres, 0) / total
      );

      dataGuardar.calculos = {
        categorias_con_brecha: conBrecha.length,
        porcentaje_con_brecha: Math.round((conBrecha.length / total) * 100),
        promedio_brecha: promedioBrecha,
        promedio_hombres: promedioHombres,
        promedio_mujeres: promedioMujeres,
      };
    }

    await docRef.set({ [dimension_id]: dataGuardar }, { merge: true });

    return res.status(200).json({
      message: "Respuestas, tabla salarial y cálculos guardados correctamente.",
    });
  } catch (error) {
    console.error("❌ Error al guardar dimensión:", error);
    return res.status(500).json({ error: "Error al guardar la dimensión." });
  }
});
