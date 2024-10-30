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

  // Crear un nuevo archivo de la carta
  crearCarta: async (req, res) => {
    try {
      const { archivoUrl } = req.body;

      const carta = new Carta({ archivoUrl });
      await carta.save();
      res.json({ message: "Archivo de carta creado exitosamente", carta });
    } catch (error) {
      console.error("Error al crear el archivo de la carta:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Editar un archivo de la carta por ID
  editarCarta: async (req, res) => {
    try {
      const { id } = req.params;
      const { archivoUrl } = req.body;

      const carta = await Carta.findByIdAndUpdate(
        id,
        { archivoUrl },
        { new: true }
      );

      if (!carta) {
        res.status(404).json({ message: "Archivo de carta no encontrado" });
      } else {
        res.json({ message: "Archivo de carta actualizado exitosamente", carta });
      }
    } catch (error) {
      console.error("Error al editar el archivo de la carta:", error);
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