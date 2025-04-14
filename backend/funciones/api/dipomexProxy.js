// funciones/api/dipomexProxy.js

import axios from "axios";

export const dipomexEstados = async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.tau.com.mx/dipomex/v1/estados", // ✅ URL correcta
      {
        headers: {
          APIKEY: "f5213a2b0419ed805194eabfe1ca5b8a032952bd",
        },
      }
    );

    res.set("Access-Control-Allow-Origin", "*");
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error al consultar DIPOMEX:", error);
    res.status(500).json({ message: "Error al consultar DIPOMEX", error });
  }
};

export const dipomexMunicipios = async (req, res) => {
  try {
    const { id_estado } = req.query;

    const response = await axios.get(
      "https://api.tau.com.mx/dipomex/v1/municipios", // ✅ URL correcta
      {
        headers: {
          APIKEY: "f5213a2b0419ed805194eabfe1ca5b8a032952bd",
        },
        params: { id_estado },
      }
    );

    res.set("Access-Control-Allow-Origin", "*");
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error al consultar municipios:", error);
    res.status(500).json({ message: "Error al consultar municipios", error });
  }
};
