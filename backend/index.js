import { onRequest } from "firebase-functions/v2/https";
import {
  dipomexEstados,
  dipomexMunicipios,
} from "./funciones/api/dipomexProxy.js";
import "dotenv/config";

export const proxyDipomexEstados = onRequest(dipomexEstados);
export const proxyDipomexMunicipios = onRequest(dipomexMunicipios);

import {
  obtenerInstitucion,
  crearInstitucion,
  actualizarInstitucion,
  obtenerInstituciones,
} from "./funciones/instituciones.js";
import { obtenerDimensionesConEstado } from "./funciones/dimensiones.js";
import { crearUsuario, actualizarUsuario } from "./funciones/usuario.js";

import {
  obtenerReporteInstitucion,
  generarReporteGlobal,
} from "./funciones/resultados.js";

import {
  levantarEncuestas,
  obtenerInfoEncuestas,
  obtenerEncuestaPorToken,
} from "./funciones/levantamiento_encuestas.js";
import {
  obtenerPreguntasDimension,
  obtenerAutodiagnostico,
  guardarDimension,
  obtenerPreguntasConRespuestas,
  obtenerPreguntasAutodiagnosticoParticipativo,
  guardarAutodiagnostico,
  responderEncuesta,
  obtenerEncuestaPorTipo,
  obtenerResultadosEncuesta,
} from "./funciones/cuestionarios.js";
import { loginAdmin } from "./funciones/loginAdmin.js";
import { loginUsuario } from "./funciones/loginUsuario.js";

export {
  obtenerInstitucion,
  crearInstitucion,
  obtenerAutodiagnostico,
  obtenerInfoEncuestas,
  levantarEncuestas,
  actualizarInstitucion,
  obtenerInstituciones,
  obtenerPreguntasConRespuestas,
  obtenerPreguntasAutodiagnosticoParticipativo,
  crearUsuario,
  actualizarUsuario,
  obtenerPreguntasDimension,
  guardarDimension,
  guardarAutodiagnostico,
  responderEncuesta,
  obtenerEncuestaPorTipo,
  loginAdmin,
  loginUsuario,
  obtenerEncuestaPorToken,
  obtenerResultadosEncuesta,
  obtenerDimensionesConEstado,
  obtenerReporteInstitucion,
  generarReporteGlobal,
};
