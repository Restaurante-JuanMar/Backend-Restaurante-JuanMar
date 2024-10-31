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

  // Crear una nueva imagen en la galería
  crearGaleria: async (req, res) => {
    try {
      const { imagen, descrip_gal, fecha_gal, posicion } = req.body;

      const galeria = new Galeria({ imagen, descrip_gal, fecha_gal, posicion });
      await galeria.save();
      res.json({ message: "Imagen de galería creada exitosamente", galeria });
    } catch (error) {
      console.error("Error al crear la imagen de la galería:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Editar una imagen de la galería por ID
  editarGaleria: async (req, res) => {
    try {
      const { id } = req.params;
      const { imagen, descrip_gal, fecha_gal, posicion } = req.body;

      const galeria = await Galeria.findByIdAndUpdate(
        id,
        { imagen, descrip_gal, fecha_gal, posicion },
        { new: true }
      );

      if (!galeria) {
        res.status(404).json({ message: "Imagen de galería no encontrada" });
      } else {
        res.json({ message: "Imagen de galería actualizada exitosamente", galeria });
      }
    } catch (error) {
      console.error("Error al editar la imagen de la galería:", error);
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
