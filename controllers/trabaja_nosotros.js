import TrabajaNosotros from "../models/trabaja_nosotros.js";

const httpTrabajaNosotros = {
  // Obtener todas las solicitudes
  getAll: async (req, res) => {
    try {
      const solicitudes = await TrabajaNosotros.find();
      res.json(solicitudes);
    } catch (error) {
      console.error("Error al obtener todas las solicitudes:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener todas las solicitudes",
        error: error.message,
      });
    }
  },

  // Obtener solicitud por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const solicitud = await TrabajaNosotros.findById(id);
      if (!solicitud) {
        res
          .status(404)
          .json({ success: false, message: "Solicitud no encontrada" });
      } else {
        res.json(solicitud);
      }
    } catch (error) {
      console.error("Error al obtener la solicitud por ID:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener la solicitud por ID",
        error: error.message,
      });
    }
  },

  // Crear nueva solicitud
  crearSolicitud: async (req, res) => {
    try {
      const { nombre, apellido, correo, telefono, cargo, hoja_vida } = req.body;
      const solicitud = new TrabajaNosotros({
        nombre,
        apellido,
        correo,
        telefono,
        cargo,
        hoja_vida,
      });

      await solicitud.save();
      res.json(solicitud);
    } catch (error) {
      console.error("Error al crear la solicitud:", error);
      res.status(500).json({
        success: false,
        message: "Error al crear la solicitud",
        error: error.message,
      });
    }
  },

  // Editar una solicitud
  editarSolicitud: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, apellido, correo, telefono, cargo, hoja_vida } = req.body;

      const solicitud = await TrabajaNosotros.findByIdAndUpdate(
        id,
        { nombre, apellido, correo, telefono, cargo, hoja_vida },
        { new: true }
      );

      if (!solicitud) {
        res
          .status(404)
          .json({ success: false, message: "Solicitud no encontrada" });
      } else {
        res.json(solicitud);
      }
    } catch (error) {
      console.error("Error al editar la solicitud:", error);
      res.status(500).json({
        success: false,
        message: "Error al editar la solicitud",
        error: error.message,
      });
    }
  },

  // Activar solicitud
  putActivar: async (req, res) => {
    try {
      const { id } = req.params;
      const solicitud = await TrabajaNosotros.findByIdAndUpdate(
        id,
        { estado: true },
        { new: true }
      );
      if (!solicitud) {
        res
          .status(404)
          .json({ success: false, message: "Solicitud no encontrada" });
      } else {
        res.json(solicitud);
      }
    } catch (error) {
      console.error("Error al activar la solicitud:", error);
      res.status(500).json({
        success: false,
        message: "Error al activar la solicitud",
        error: error.message,
      });
    }
  },

  // Inactivar solicitud
  putInactivar: async (req, res) => {
    try {
      const { id } = req.params;
      const solicitud = await TrabajaNosotros.findByIdAndUpdate(
        id,
        { estado: false },
        { new: true }
      );
      if (!solicitud) {
        res
          .status(404)
          .json({ success: false, message: "Solicitud no encontrada" });
      } else {
        res.json(solicitud);
      }
    } catch (error) {
      console.error("Error al inactivar la solicitud:", error);
      res.status(500).json({
        success: false,
        message: "Error al inactivar la solicitud",
        error: error.message,
      });
    }
  },
};

export default httpTrabajaNosotros;
