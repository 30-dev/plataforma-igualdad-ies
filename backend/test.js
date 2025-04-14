// test.js
import fetch from "node-fetch";
// fetch("http://127.0.0.1:5001/igualdad-ies/us-central1/crearInstitucion", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     nombre: "Escuela Prueba Local",
//     email_contacto: "escuela@prueba.com",
//     ubicacion: { ciudad: "Mérida", estado: "Yucatán" },
//     encuestas: ["diagnostico_1"],
//     usuarios: ["adminTest"],
//   }),
// })
//   .then((res) => res.json())
//   .then(console.log)
//   .catch(console.error);

// import fetch from "node-fetch";

// fetch("http://127.0.0.1:5001/igualdad-ies/us-central1/crearUsuario", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     nombre: "Luis Dev",
//     email: "luis@ejemplo.com",
//     rol: "admin",
//     institucion_id: "ESC-Y7CD",
//     password: "superSecreta123",
//   }),
// })
//   .then((res) => res.json())
//   .then(console.log)
//   .catch(console.error);

// Prueba actualizar
// fetch("http://127.0.0.1:5001/igualdad-ies/us-central1/actualizarUsuario", {
//   method: "PATCH",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     id: "LUIS-6OPX",
//     nombre: "Luis Dev Actualizado",
//   }),
// })
//   .then((res) => res.json())
//   .then(console.log)
//   .catch(console.error);

// fetch("http://127.0.0.1:5001/igualdad-ies/us-central1/guardarDimension", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     institucion_id: "ESC-Y7CD",
//     dimension_id: "dimension-1",
//     usuario_id: "LUIS-6OPX",
//     respuestas: {
//       modelo_educativo_igualdad: "Si",
//       implementacion_orientaciones: "Parcialmente",
//       conocimiento_orientaciones_igualdad_genero: "Si",
//       implementacion_productos_conocimiento: "No",
//       planeacion_anual_capacitaciones_genero: "Si",
//       apoyo_personal_politicas_genero: "Parcialmente",
//       evaluacion_cursos_genero: "Parcialmente",
//       directivos_toman_cursos_genero: "No",
//       politicas_institucionales_genero: "Parcialmente",
//       politicas_procesos_seleccion_genero: "Parcialmente",
//       fortalecimiento_plan_accion: "Parcialmente",
//       evaluacion_programas_genero: "Si",
//       percepcion_comunidad_genero: "Parcialmente",
//       academicos_formacion_genero: "Si",
//       planeacion_cursos_estudiantes_genero: "No",
//       apoyo_docentes_decision_genero: "Si",
//     },
//     preguntas: [
//       {
//         id: "modelo_educativo_igualdad",
//         pregunta:
//           "¿El modelo educativo de la institución incluye orientaciones sobre igualdad de género y no discriminación?",
//         subdimension: "El Modelo educativo tiene perspectiva de género",
//         tipo_respuesta: "radio",
//       },
//       {
//         id: "implementacion_orientaciones",
//         pregunta:
//           "En la facultad/departamento ¿Se están implementando las orientaciones sobre igualdad y no discriminación establecidas en el Modelo Educativo?",
//         subdimension: "El Modelo educativo tiene perspectiva de género",
//         tipo_respuesta: "radio",
//       },
//       {
//         id: "conocimiento_orientaciones_igualdad_genero",
//         pregunta:
//           "¿Las orientaciones de igualdad de género y no discriminación establecidas en el Modelo Educativo, son conocidas por la comunidad universitaria?",
//         subdimension: "El Modelo educativo tiene perspectiva de género",
//         tipo_respuesta: "radio",
//       },
//       {
//         id: "implementacion_productos_conocimiento",
//         pregunta:
//           "En el último año, en la facultad/institución ¿se han puesto en marcha productos de conocimiento (cursos, talleres o pláticas) sobre género, feminismos, diferencias sexo genéricas para docentes, administrativos y personal en general?",
//         subdimension:
//           "Procesos de formación sistémicos sobre igualdad de género y no discriminación",
//         tipo_respuesta: "radio",
//       },
//       {
//         id: "planeacion_anual_capacitaciones_genero",
//         pregunta:
//           "¿Se tiene una planeación anual sobre los cursos, capacitaciones o talleres de género que la institución imparte para docentes, administrativos y demás personal?",
//         subdimension:
//           "Procesos de formación sistémicos sobre igualdad de género y no discriminación",
//         tipo_respuesta: "radio",
//       },
//       {
//         id: "apoyo_personal_politicas_genero",
//         pregunta:
//           "¿El personal apoya estas políticas de género que implementa la institución?",
//         subdimension:
//           "Procesos de formación sistémicos sobre igualdad de género y no discriminación",
//         tipo_respuesta: "radio",
//       },
//       {
//         id: "evaluacion_cursos_genero",
//         pregunta:
//           "¿Se cuenta con evaluaciones, opiniones o seguimiento de los cursos o herramientas de formación sobre género para docentes, administrativos y demás personal que se imparten en la institución?",
//         subdimension:
//           "Procesos de formación sistémicos sobre igualdad de género y no discriminación",
//         tipo_respuesta: "radio",
//       },
//       {
//         id: "directivos_toman_cursos_genero",
//         pregunta:
//           "¿Los mandos medios y los directivos han tomado los cursos, pláticas, etc., sobre género que implementa u ofrece la Institución?",
//         subdimension:
//           "Procesos de formación sistémicos sobre igualdad de género y no discriminación",
//         tipo_respuesta: "radio",
//       },
//       {
//         id: "politicas_institucionales_genero",
//         pregunta:
//           "¿Con qué frecuencia al año se dan al año las capacitaciones sobre temas de género a docentes, administrativos y personal en general?",
//         subdimension:
//           "Procesos de formación sistémicos sobre igualdad de género y no discriminación",
//         tipo_respuesta: "radio",
//       },
//       {
//         id: "politicas_procesos_seleccion_genero",
//         pregunta: "¿Qué porcentaje del personal los ha tomado?",
//         subdimension:
//           "Procesos de formación sistémicos sobre igualdad de género y no discriminación",
//         tipo_respuesta: "radio",
//       },
//       {
//         id: "fortalecimiento_plan_accion",
//         pregunta:
//           "En los planes de estudio de la facultad, pueden ser de apoyo o soporte estudiantil ¿se incluyen cursos relacionados con temas de género, feminismos y disidencias sexuales y de género?",
//         subdimension:
//           "Planes y programas estudiantiles integran la perspectiva de género",
//         tipo_respuesta: "radio",
//       },
//       {
//         id: "evaluacion_programas_genero",
//         pregunta: "¿Estos cursos son obligatorios?",
//         subdimension:
//           "Planes y programas estudiantiles integran la perspectiva de género",
//         tipo_respuesta: "radio",
//       },
//       {
//         id: "percepcion_comunidad_genero",
//         pregunta:
//           "¿Se evalúan y monitorean las prácticas educativas relacionadas con cuestiones de género?",
//         subdimension:
//           "Planes y programas estudiantiles integran la perspectiva de género",
//         tipo_respuesta: "radio",
//       },
//       {
//         id: "academicos_formacion_genero",
//         pregunta:
//           "¿La institución cuenta con académicos/as con formación en temas de género?",
//         subdimension:
//           "Planes y programas estudiantiles integran la perspectiva de género",
//         tipo_respuesta: "radio",
//       },
//       {
//         id: "planeacion_cursos_estudiantes_genero",
//         pregunta:
//           "¿Se tiene una planeación anual sobre los cursos hacia los y las estudiantes relacionados con temas de género?",
//         subdimension:
//           "Planes y programas estudiantiles integran la perspectiva de género",
//         tipo_respuesta: "radio",
//       },
//       {
//         id: "apoyo_docentes_decision_genero",
//         pregunta:
//           "¿El personal docente y de toma de decisión apoya esta planeación e implementación de cursos sobre género?",
//         subdimension:
//           "Planes y programas estudiantiles integran la perspectiva de género",
//         tipo_respuesta: "radio",
//       },
//     ],
//   }),
// })
//   .then((res) => res.json())
//   .then(console.log)
//   .catch(console.error);

// fetch("http://127.0.0.1:5001/igualdad-ies/us-central1/guardarAutodiagnostico", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     institucion_id: "ESC-Y7CD",
//     usuario_id: "LUIS-6OPX",
//     respuestas: {
//       autodiagnostico_describe: "Se hicieron dinámicas participativas.",
//       autodiagnostico_tematica: "Igualdad de género y liderazgo femenino.",
//       autodiagnostico_numero: 40,
//       autodiagnostico_mujeres_estudiantes: 22,
//       autodiagnostico_hombres_estudiantes: 10,
//       autodiagnostico_mujeres_docentes: 5,
//       autodiagnostico_hombres_docentes: 3,
//       autodiagnostico_mujeres_administrativas: 2,
//       autodiagnotisco_mujeres_directivos: 1,
//     },
//     preguntas: [
//       {
//         id: "autodiagnostico_describe",
//         pregunta:
//           "Describe brevemente las actividades realizadas durante el taller de autodiagnóstico participativo.",
//         tipoRespuesta: "texto",
//       },
//       {
//         id: "autodiagnostico_tematica",
//         pregunta:
//           "¿Cuál fue la o las temáticas que se abordaron en el taller de autodiagnóstico participativo?",
//         tipoRespuesta: "texto",
//       },
//       {
//         id: "autodiagnostico_numero",
//         pregunta: "¿Cuál fue el número total de participantes?",
//         tipoRespuesta: "numero",
//       },
//       {
//         id: "autodiagnostico_mujeres_estudiantes",
//         pregunta:
//           "¿Cuál fue el número total de mujeres estudiantes participantes?",
//         tipoRespuesta: "numero",
//       },
//       {
//         id: "autodiagnostico_hombres_estudiantes",
//         pregunta:
//           "¿Cuál fue el número total de hombres estudiantes participantes?",
//         tipoRespuesta: "numero",
//       },
//       {
//         id: "autodiagnostico_mujeres_docentes",
//         pregunta:
//           "¿Cuál fue el número total de mujeres docentes participantes?",
//         tipoRespuesta: "numero",
//       },
//       {
//         id: "autodiagnostico_hombres_docentes",
//         pregunta:
//           "¿Cuál fue el número total de hombres docentes participantes?",
//         tipoRespuesta: "numero",
//       },
//       {
//         id: "autodiagnostico_mujeres_administrativas",
//         pregunta:
//           "¿Cuál fue el número total de hombres docentes participantes?",
//         tipoRespuesta: "numero",
//       },
//       {
//         id: "autodiagnotisco_mujeres_directivos",
//         pregunta:
//           "¿Cuál fue el número total de mujeres de cargos directivos participantes?",
//         tipoRespuesta: "numero",
//       },
//     ],
//   }),
// })
//   .then((res) => res.json())
//   .then(console.log)
//   .catch(console.error);

// fetch("http://127.0.0.1:5001/igualdad-ies/us-central1/responderEncuesta", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     encuesta_id: "encuesta-estudiantes",
//     institucion_id: "ESC-Y7CD", // Aquí puedes reemplazar con el ID de la institución que desees
//     respuestas: {
//       "encuesta-estudiantes-00": "estudiante@uni.edu.mx", // Respuesta de correo
//       "encuesta-estudiantes-01": "20", // Edad del estudiante
//       "encuesta-estudiantes-02": "Hombre", // Género
//       "encuesta-estudiantes-03": "Afrodescendiente", // Sectores de población
//       "encuesta-estudiantes-04": "Muy de acuerdo", // Igualdad de género en el entorno
//       "encuesta-estudiantes-05": "De acuerdo", // Efectos negativos para hombres
//       "encuesta-estudiantes-06": "Muy de acuerdo", // Fomentar igualdad de género
//       "encuesta-estudiantes-07": "De acuerdo", // Obligatorio igualdad de género
//       "encuesta-estudiantes-08": "En desacuerdo", // Mujeres en ciencias
//       "encuesta-estudiantes-09": "De acuerdo", // Mujeres en cuidado y apoyo administrativo
//       "encuesta-estudiantes-10": "Muy de acuerdo", // Responsabilidad de cuidados
//       "encuesta-estudiantes-11": "En desacuerdo", // Prácticas discriminatorias
//       "encuesta-estudiantes-12": "De acuerdo", // Igualdad de género en la institución
//       "encuesta-estudiantes-13": "Muy de acuerdo", // Brechas de género
//       "encuesta-estudiantes-14": "Totalmente de acuerdo", // Compromiso por la igualdad de género
//       "encuesta-estudiantes-15": "De acuerdo", // Romper con el sexismo
//       "encuesta-estudiantes-16": "Muy de acuerdo", // Respeto para diversidades sexogenéricas
//       "encuesta-estudiantes-17": "Totalmente de acuerdo", // Trabajo integral y coordinado
//       "encuesta-estudiantes-18": "De acuerdo", // Acoso y violencia de género
//       "encuesta-estudiantes-19": "Muy de acuerdo", // Atención al acoso y violencia de género
//       "encuesta-estudiantes-20": "En desacuerdo", // Prevención del acoso y violencia sexual
//       "encuesta-estudiantes-21": "De acuerdo", // Testigo de comentarios sexistas
//       "encuesta-estudiantes-22": "Muy de acuerdo", // Acudir en caso de acoso o violencia
//       "encuesta-estudiantes-23": "Totalmente de acuerdo", // Discriminación en la institución
//       "encuesta-estudiantes-24": "De acuerdo", // Testigo de actos discriminatorios
//       "encuesta-estudiantes-25": "Muy de acuerdo", // Campañas de igualdad de género
//     },
//     preguntas: [
//       {
//         id: "encuesta-estudiantes-00",
//         pregunta: "Por favor, ingresa tu correo institucional:",
//         tipo: "email",
//       },
//       {
//         id: "encuesta-estudiantes-01",
//         pregunta: "¿Qué edad tienes?",
//         tipo: "numero",
//       },
//       {
//         id: "encuesta-estudiantes-02",
//         pregunta: "¿Cuál es tu género?",
//         tipo: "radio",
//         opciones: ["Hombre", "Mujer", "Otro"],
//       },
//       {
//         id: "encuesta-estudiantes-03",
//         pregunta:
//           "¿Te identifica o formas parte de alguno de los siguientes sectores de la población?",
//         tipo: "radio",
//         opciones: ["Afrodescendiente", "Índigena", "Ninguna de las anteriores"],
//       },
//       {
//         id: "encuesta-estudiantes-04",
//         pregunta:
//           "La igualdad de género en un tema prioritario para mi entorno y comunidad educativa",
//         tipo: "radio",
//         opciones: [
//           "En desacuerdo",
//           "De acuerdo",
//           "Muy de acuerdo",
//           "Totalmente de acuerdo",
//         ],
//       },
//       {
//         id: "encuesta-estudiantes-05",
//         pregunta:
//           "Incorporar la perspectiva de género en las políticas y programas puede tener efectos negativos para los hombres.",
//         tipo: "radio",
//         opciones: [
//           "En desacuerdo",
//           "De acuerdo",
//           "Muy de acuerdo",
//           "Totalmente de acuerdo",
//         ],
//       },
//       {
//         id: "encuesta-estudiantes-06",
//         pregunta:
//           "Fomentar la igualdad de género no debería ser algo obligatorio en mi institución educativa",
//         tipo: "radio",
//         opciones: [
//           "En desacuerdo",
//           "De acuerdo",
//           "Muy de acuerdo",
//           "Totalmente de acuerdo",
//         ],
//       },
//       {
//         id: "encuesta-estudiantes-07",
//         pregunta: "Las mujeres no son buenas para las ciencias",
//         tipo: "radio",
//         opciones: [
//           "En desacuerdo",
//           "De acuerdo",
//           "Muy de acuerdo",
//           "Totalmente de acuerdo",
//         ],
//       },
//       {
//         id: "encuesta-estudiantes-08",
//         pregunta:
//           "Las mujeres son mejores en actividades de cuidado, apoyo administrativo, etc.",
//         tipo: "radio",
//         opciones: [
//           "En desacuerdo",
//           "De acuerdo",
//           "Muy de acuerdo",
//           "Totalmente de acuerdo",
//         ],
//       },
//       {
//         id: "encuesta-estudiantes-09",
//         pregunta:
//           "Las mujeres deben ser las responsables de los cuidados de las personas que lo necesiten",
//         tipo: "radio",
//         opciones: [
//           "En desacuerdo",
//           "De acuerdo",
//           "Muy de acuerdo",
//           "Totalmente de acuerdo",
//         ],
//       },
//       {
//         id: "encuesta-estudiantes-10",
//         pregunta: "En la institución hay prácticas discriminatorias",
//         tipo: "radio",
//         opciones: [
//           "En desacuerdo",
//           "De acuerdo",
//           "Muy de acuerdo",
//           "Totalmente de acuerdo",
//         ],
//       },
//       // Agregar el resto de preguntas de la misma forma
//     ],
//   }),
// })
//   .then((res) => res.json())
//   .then(console.log)
//   .catch(console.error);
// fetch("http://127.0.0.1:5001/igualdad-ies/us-central1/levantarEncuestas", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     institucion_id: "ESC-1234",
//     fecha_inicio: "2025-01-01T00:00:00Z",
//     fecha_limite: "2025-01-15T23:59:59Z",
//   }),
// })
//   .then((res) => res.json()) // Convertir la respuesta en JSON
//   .then((data) => {
//     // Acceder a los enlaces y QR generados
//     console.log("Respuesta recibida:", data);
//     if (data.encuestas) {
//       console.log("Enlace estudiantes:", data.encuestas.estudiantes.enlace);
//       console.log("QR estudiantes:", data.encuestas.estudiantes.qr_code);
//       console.log("Enlace personal:", data.encuestas.personal.enlace);
//       console.log("QR personal:", data.encuestas.personal.qr_code);
//     } else {
//       console.error("Estructura de respuesta incorrecta.");
//     }
//   })
//   .catch((error) => {
//     console.error("Error al levantar las encuestas:", error);
//   });

// fetch(
//   "http://127.0.0.1:5001/igualdad-ies/us-central1/obtenerInfoEncuestas?id=ESC-1234"
// )
//   .then((res) => res.json())
//   .then((data) => {
//     console.log("Encuestas recuperadas:", data);
//   })
//   .catch((error) => {
//     console.error("Error al obtener encuestas:", error);
//   });

// fetch(
//   "http://127.0.0.1:5001/igualdad-ies/us-central1/obtenerAutodiagnostico?id=ESC-Y7CD"
// )
//   .then((res) => res.json())
//   .then((data) => {
//     console.log("Autodiagnóstico:", data.autodiagnostico);
//   })
//   .catch((error) => {
//     console.error("Error al obtener autodiagnóstico:", error);
//   });
// fetch(
//   "http://127.0.0.1:5001/igualdad-ies/us-central1/obtenerPreguntasAutodiagnosticoParticipativo"
// )
//   .then((res) => res.json())
//   .then((data) => {
//     console.log("Preguntas participativo:", data.preguntas);
//   })
//   .catch((error) => {
//     console.error("Error al obtener preguntas participativo:", error);
//   });

// fetch(
//   "http://127.0.0.1:5001/igualdad-ies/us-central1/obtenerPreguntasConRespuestas?institucion_id=ESC-Y7CD&dimension=1"
// )
//   .then((res) => res.json())
//   .then((data) => {
//     console.log("✅ Preguntas con respuestas:");
//     console.table(data.preguntas);
//   })
//   .catch((error) => {
//     console.error("❌ Error:", error);
//   });
// fetch(
//   "http://127.0.0.1:5001/igualdad-ies/us-central1/obtenerEncuestaPorTipo?tipo=estudiantes"
// )
//   .then((res) => res.json())
//   .then((data) => {
//     if (data.encuesta) {
//       console.log("✅ Encuesta obtenida:");
//       console.log("🧾 Nombre:", data.encuesta.nombre);
//       console.log("👥 Dirigido a:", data.encuesta.dirigido);
//       console.log("📝 Descripción:", data.encuesta.descripcion);
//       console.log("❓ Preguntas:");
//       console.table(data.encuesta.preguntas);
//     } else {
//       console.warn("⚠️ No se encontró la encuesta:", data);
//     }
//   })
//   .catch((error) => {
//     console.error("❌ Error al obtener encuesta:", error);
//   });
