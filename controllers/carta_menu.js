import Carta from "../models/carta_menu.js";

const httpCarta = {
  // Obtener todos los archivos de la carta
  getAll: async (req, res) => {
    try {
      const cartas = await Carta.find();
      res.json(cartas);
    } catch (error) {
      console.error("Error al obtener todos los archivos de la carta:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener un archivo de la carta por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const carta = await Carta.findById(id);
      if (!carta) {
        res.status(404).json({ message: "Archivo de carta no encontrado" });
      } else {
        res.json(carta);
      }
    } catch (error) {
      console.error("Error al obtener el archivo de la carta por ID:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Crear o actualizar el archivo de la carta
    agregarOEditarCarta: async (req, res) => {
    try {
      const { archivoUrl } = req.body;

      // Buscar si ya existe una carta
      let carta = await Carta.findOne();

      if (carta) {
        // Si existe, actualizar la carta
        carta.archivoUrl = archivoUrl;
        await carta.save();
        res.json({
          message: "Archivo de carta actualizado exitosamente",
          carta,
        });
      } else {
        // Si no existe, crear una nueva carta
        carta = new Carta({ archivoUrl });
        await carta.save();
        res.json({ message: "Archivo de carta creado exitosamente", carta });
      }
    } catch (error) {
      console.error("Error al gestionar el archivo de la carta:", error);
      res.status(500).json({ error: error.message });
    }
  },

  //Put activar carta
  putActivar: async (req, res) => {
    try {
      const { id } = req.params;
      const carta = await Carta.findByIdAndUpdate(
        id,
        { estado: true },
        { new: true }
      );
      res.json(carta);
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  //Put inactivar carta
  putInactivar: async (req, res) => {
    try {
      const { id } = req.params;
      const carta = await Carta.findByIdAndUpdate(
        id,
        { estado: false },
        { new: true }
      );
      res.json(carta);
    } catch (error) {
      res.status(500).json({ error });
    }
  },
};

export default httpCarta;
