// src/echarts.js
import * as echarts from "echarts/core";

// Componentes que usarás (puedes agregar más si necesitas)
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";

// Tipo de gráfico
import { GaugeChart } from "echarts/charts";

// Renderer (puede ser CanvasRenderer o SVGRenderer, depende de tu caso)
import { CanvasRenderer } from "echarts/renderers";

// Registrar los módulos
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GaugeChart,
  CanvasRenderer,
]);
