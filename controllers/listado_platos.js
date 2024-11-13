import ListadoPlatos from "../models/listado_platos.js";
import Reserva from "../models/reserva.js";

const httpListadoPlatos = {
  // Obtener todos los documentos de ListadoPlatos
  getAll: async (req, res) => {
    try {
      const listadoPlatos = await ListadoPlatos.find().populate("idReserva");
      res.json(listadoPlatos);
    } catch (error) {
      console.error(
        "Error al obtener todos los documentos de listado de platos:",
        error
      );
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener un documento de ListadoPlatos por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const listadoPlato = await ListadoPlatos.findById(id).populate(
        "idReserva"
      );
      if (!listadoPlato) {
        res
          .status(404)
          .json({ message: "Documento de listado de platos no encontrado" });
      } else {
        res.json(listadoPlato);
      }
    } catch (error) {
      console.error(
        "Error al obtener el documento de listado de platos por ID:",
        error
      );
      res.status(500).json({ error: error.message });
    }
  },

  // Crear un documento de ListadoPlatos asociado a una reserva por identificador
  crearListadoPlato: async (req, res) => {
    try {
      const { archivoUrl, identificador } = req.body;

      // Verificar si la reserva con el identificador existe
      const reserva = await Reserva.findOne({ identificador });

      if (!reserva) {
        return res.status(404).json({
          error: "Reserva no encontrada",
        });
      }

      // Buscar si ya existe un ListadoPlatos para esta reserva
      let listadoPlato = await ListadoPlatos.findOne({
        idReserva: reserva._id,
      });

      if (listadoPlato) {
        // Si ya existe, actualizar el archivoUrl
        listadoPlato.archivoUrl = archivoUrl;
        await listadoPlato.save();

        res.json(listadoPlato);
      } else {
        // Si no existe, crear un nuevo documento de ListadoPlatos
        listadoPlato = new ListadoPlatos({
          archivoUrl,
          idReserva: reserva._id,
        });

        await listadoPlato.save();

        res.json(listadoPlato);
      }
    } catch (error) {
      console.error(
        "Error al crear o actualizar el documento de listado de platos:",
        error
      );
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
      );

      if (!listadoPlato) {
        res
          .status(404)
          .json({ message: "Documento de listado de platos no encontrado" });
      } else {
        res.json({
          message: "Documento de listado de platos actualizado exitosamente",
          listadoPlato,
        });
      }
    } catch (error) {
      console.error(
        "Error al editar el documento de listado de platos:",
        error
      );
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

  // Inactivar un documento de ListadoPlatos por ID y también inactivar la reserva asociada
  putInactivar: async (req, res) => {
    try {
      const { id } = req.params;

      // Inactivar el documento de ListadoPlatos
      const listadoPlato = await ListadoPlatos.findByIdAndUpdate(
        id,
        { estado: false },
        { new: true }
      );

      if (!listadoPlato) {
        return res
          .status(404)
          .json({ error: "Listado de platos no encontrado" });
      }

      // Inactivar la Reserva asociada usando el idReserva de listadoPlato
      await Reserva.findByIdAndUpdate(
        listadoPlato.idReserva,
        { estado: false },
        { new: true }
      );

      res.json(listadoPlato);
    } catch (error) {
      console.error(
        "Error al inactivar el documento de listado de platos y su reserva asociada:",
        error
      );
      res.status(500).json({ error: error.message });
    }
  },
};

export default httpListadoPlatos;
