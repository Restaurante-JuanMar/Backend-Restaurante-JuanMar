import Pqr from "../models/pqr.js";

const httpPqr = {
  // Obtener todas las PQRs
  getAll: async (req, res) => {
    try {
      const pqrs = await Pqr.find();
      res.json(pqrs);
    } catch (error) {
      console.error("Error al obtener todas las PQRs:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener PQR por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const pqr = await Pqr.findById(id);
      if (!pqr) {
        res.status(404).json({ message: "PQR no encontrada" });
      } else {
        res.json(pqr);
      }
    } catch (error) {
      console.error("Error al obtener la PQR por ID:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Crear nueva PQR
  crearPqr: async (req, res) => {
    try {
      const {
        nombre,
        apellido,
        tipoDocumento,
        numDocumento,
        correo,
        telefono,
        tipoPqr,
        asunto,
        descripcion,
        archivoUrl,
      } = req.body;

      const pqr = new Pqr({
        nombre,
        apellido,
        tipoDocumento,
        numDocumento,
        correo,
        telefono,
        tipoPqr,
        asunto,
        descripcion,
        archivoUrl,
      });

      await pqr.save();
      res.json(pqr);
    } catch (error) {
      console.error("Error al crear la PQR:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Editar una PQR
  editarPqr: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        nombre,
        apellido,
        tipoDocumento,
        numDocumento,
        correo,
        telefono,
        tipoPqr,
        asunto,
        descripcion,
        archivoUrl,
      } = req.body;

      const pqr = await Pqr.findByIdAndUpdate(
        id,
        {
          nombre,
          apellido,
          tipoDocumento,
          numDocumento,
          correo,
          telefono,
          tipoPqr,
          asunto,
          descripcion,
          archivoUrl,
        },
        { new: true }
      );

      if (!pqr) {
        res.status(404).json({ message: "PQR no encontrada" });
      } else {
        res.json(pqr);
      }
    } catch (error) {
      console.error("Error al editar la PQR:", error);
      res.status(500).json({ error: error.message });
    }
  },

  //Put activar pqr
  putActivar: async (req, res) => {
    try {
      const { id } = req.params;
      const pqr = await Pqr.findByIdAndUpdate(
        id,
        { estado: true },
        { new: true }
      );
      res.json(pqr);
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  //Put inactivar pqr
  putInactivar: async (req, res) => {
    try {
      const { id } = req.params;
      const pqr = await Pqr.findByIdAndUpdate(
        id,
        { estado: false },
        { new: true }
      );
      res.json(pqr);
    } catch (error) {
      res.status(500).json({ error });
    }
  },
};

export default httpPqr;
