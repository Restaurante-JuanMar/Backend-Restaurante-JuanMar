import Vision from "../models/vision.js";

const httpVision = {
  // Obtener todas las visiones
  getAll: async (req, res) => {
    try {
      const visiones = await Vision.find();
      res.json(visiones);
    } catch (error) {
      console.error("Error al obtener todas las visiones:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener una visión por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const vision = await Vision.findById(id);
      if (!vision) {
        res.status(404).json({ message: "Visión no encontrada" });
      } else {
        res.json(vision);
      }
    } catch (error) {
      console.error("Error al obtener la visión por ID:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Crear o actualizar una única visión
  agregarOEditarVision: async (req, res) => {
    try {
      const { descripcion, estado } = req.body;

      // Buscar si ya existe una visión
      let vision = await Vision.findOne();

      if (vision) {
        // Si existe, actualizar la visión
        vision.descripcion = descripcion;
        vision.estado = estado;
        await vision.save();
        res.json({
          message: "Visión actualizada exitosamente",
          vision,
        });
      } else {
        // Si no existe, crear una nueva visión
        vision = new Vision({ descripcion, estado });
        await vision.save();
        res.json({ message: "Visión creada exitosamente", vision });
      }
    } catch (error) {
      console.error("Error al gestionar la visión:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Activar una visión
  putActivar: async (req, res) => {
    try {
      const { id } = req.params;
      const vision = await Vision.findByIdAndUpdate(
        id,
        { estado: true },
        { new: true }
      );
      res.json(vision);
    } catch (error) {
      console.error("Error al activar la visión:", error);
      res.status(500).json({ error });
    }
  },

  // Inactivar una visión
  putInactivar: async (req, res) => {
    try {
      const { id } = req.params;
      const vision = await Vision.findByIdAndUpdate(
        id,
        { estado: false },
        { new: true }
      );
      res.json(vision);
    } catch (error) {
      console.error("Error al inactivar la visión:", error);
      res.status(500).json({ error });
    }
  },
};

export default httpVision;