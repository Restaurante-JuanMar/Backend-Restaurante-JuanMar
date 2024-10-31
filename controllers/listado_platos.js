import ListadoPlatos from "../models/listado_plato.js";

const httpListadoPlatos = {
  // Obtener todos los documentos de ListadoPlatos
  getAll: async (req, res) => {
    try {
      const listadoPlatos = await ListadoPlatos.find().populate("idReserva");
      res.json(listadoPlatos);
    } catch (error) {
      console.error("Error al obtener todos los documentos de listado de platos:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener un documento de ListadoPlatos por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const listadoPlato = await ListadoPlatos.findById(id).populate("idReserva");
      if (!listadoPlato) {
        res.status(404).json({ message: "Documento de listado de platos no encontrado" });
      } else {
        res.json(listadoPlato);
      }
    } catch (error) {
      console.error("Error al obtener el documento de listado de platos por ID:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Crear un nuevo documento en ListadoPlatos
  crearListadoPlato: async (req, res) => {
    try {
      const { archivoUrl, idReserva } = req.body;

      const listadoPlato = new ListadoPlatos({ archivoUrl, idReserva });
      await listadoPlato.save();
      res.json({ message: "Documento de listado de platos creado exitosamente", listadoPlato });
    } catch (error) {
      console.error("Error al crear el documento de listado de platos:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Editar un documento de ListadoPlatos por ID
  editarListadoPlato: async (req, res) => {
    try {
      const { id } = req.params;
      const { archivoUrl, idReserva } = req.body;

      const listadoPlato = await ListadoPlatos.findByIdAndUpdate(
        id,
        { archivoUrl, idReserva },
        { new: true }
      ).populate("idReserva");

      if (!listadoPlato) {
        res.status(404).json({ message: "Documento de listado de platos no encontrado" });
      } else {
        res.json({ message: "Documento de listado de platos actualizado exitosamente", listadoPlato });
      }
    } catch (error) {
      console.error("Error al editar el documento de listado de platos:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Activar un documento de ListadoPlatos por ID
  putActivar: async (req, res) => {
    try {
      const { id } = req.params;
      const listadoPlato = await ListadoPlatos.findByIdAndUpdate(
        id,
        { estado: true },
        { new: true }
      );
      res.json(listadoPlato);
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  // Inactivar un documento de ListadoPlatos por ID
  putInactivar: async (req, res) => {
    try {
      const { id } = req.params;
      const listadoPlato = await ListadoPlatos.findByIdAndUpdate(
        id,
        { estado: false },
        { new: true }
      );
      res.json(listadoPlato);
    } catch (error) {
      res.status(500).json({ error });
    }
  },
};

export default httpListadoPlatos;