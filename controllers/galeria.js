import Galeria from "../models/galeria.js";

const httpGaleria = {
  // Obtener todas las imágenes de la galería
  getAll: async (req, res) => {
    try {
      const galerias = await Galeria.find();
      res.json(galerias);
    } catch (error) {
      console.error("Error al obtener todas las imágenes de la galería:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener una imagen de la galería por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const galeria = await Galeria.findById(id);
      if (!galeria) {
        res.status(404).json({ message: "Imagen de galería no encontrada" });
      } else {
        res.json(galeria);
      }
    } catch (error) {
      console.error("Error al obtener la imagen de la galería por ID:", error);
      res.status(500).json({ error: error.message });
    }
  },

    // Obtener menús por posición
    getByPosition: async (req, res) => {
      try {
        const galerias = await Galeria.find({
          posicion: { $ne: null, $exists: true },
        }).sort({ posicion: 1 });
  
        res.status(200).json(galerias);
      } catch (error) {
        console.error("Error al obtener la galería por posición:", error);
        res.status(500).json({ error: error.message });
      }
    },

    getByFecha: async (req, res) => {
      try {
        const galerias = await Galeria.find().sort({ fecha_gal: -1 });
        res.status(200).json(galerias);
      } catch (error) {
        console.error("Error al obtener la galería por fecha:", error);
        res.status(500).json({ error: error.message });
      }
    },

  crearOActualizarGaleria: async (req, res) => {
    try {
      const { nombre_gal, imagen, descrip_gal, fecha_gal, posicion } = req.body;

      // Buscar si ya existe un menú en esa posición
      let galeria = await Galeria.findOne({ posicion });

      if (galeria) {
        // Si existe, actualizar el menú
        galeria = await Galeria.findByIdAndUpdate(
          galeria._id,
          { nombre_gal, imagen, descrip_gal, fecha_gal, posicion },
          { new: true }
        );
        res.json({ message: "Galería actualizada exitosamente", galeria });
      } else {
        // Si no existe, crear un nuevo menú
        galeria = new Galeria({
          nombre_gal, imagen, descrip_gal, fecha_gal, posicion
        });
        await galeria.save();
        res.json({ message: "Galería creada exitosamente", galeria });
      }
    } catch (error) {
      console.error("Error al crear o actualizar la galería:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Activar una imagen de la galería
  putActivar: async (req, res) => {
    try {
      const { id } = req.params;
      const galeria = await Galeria.findByIdAndUpdate(
        id,
        { estado: true },
        { new: true }
      );
      res.json(galeria);
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  // Inactivar una imagen de la galería
  putInactivar: async (req, res) => {
    try {
      const { id } = req.params;
      const galeria = await Galeria.findByIdAndUpdate(
        id,
        { estado: false },
        { new: true }
      );
      res.json(galeria);
    } catch (error) {
      res.status(500).json({ error });
    }
  },
};

export default httpGaleria;
