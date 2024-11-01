import Reserva from "../models/reserva.js";

const httpReserva = {
  // Obtener todas las reservas
  getAll: async (req, res) => {
    try {
      const reservas = await Reserva.find();
      res.json(reservas);
    } catch (error) {
      console.error("Error al obtener todas las reservas:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener una reserva por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const reserva = await Reserva.findById(id);
      if (!reserva) {
        res.status(404).json({ message: "Reserva no encontrada" });
      } else {
        res.json(reserva);
      }
    } catch (error) {
      console.error("Error al obtener la reserva por ID:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Crear una nueva reserva
  crearReserva: async (req, res) => {
    try {
      const {
        nombre_cliente,
        apellido_cliente,
        correo_cliente,
        cedula_cliente,
        telefono_cliente,
        telefono_cliente2,
        num_personas,
        fecha_res,
        mensaje_res,
      } = req.body;

      const reserva = new Reserva({
        nombre_cliente,
        apellido_cliente,
        correo_cliente,
        cedula_cliente,
        telefono_cliente,
        telefono_cliente2,
        num_personas,
        fecha_res,
        mensaje_res,
      });
      await reserva.save();
      res.json({ message: "Reserva creada exitosamente", reserva });
    } catch (error) {
      console.error("Error al crear la reserva:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Editar una reserva por ID
  editarReserva: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        nombre_cliente,
        apellido_cliente,
        correo_cliente,
        cedula_cliente,
        telefono_cliente,
        telefono_cliente2,
        num_personas,
        fecha_res,
        mensaje_res,
        identificador,
      } = req.body;

      const reserva = await Reserva.findByIdAndUpdate(
        id,
        {
          nombre_cliente,
          apellido_cliente,
          correo_cliente,
          cedula_cliente,
          telefono_cliente,
          telefono_cliente2,
          num_personas,
          fecha_res,
          mensaje_res,
          identificador,
        },
        { new: true }
      );

      if (!reserva) {
        res.status(404).json({ message: "Reserva no encontrada" });
      } else {
        res.json({ message: "Reserva actualizada exitosamente", reserva });
      }
    } catch (error) {
      console.error("Error al editar la reserva:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Aprobar una reserva por ID
  putAprobar: async (req, res) => {
    try {
      const { id } = req.params;

      // Genera un número aleatorio de 5 dígitos y lo concatena con "2024" para el identificador
      const identificador = `2024${Math.floor(10000 + Math.random() * 90000)}`;

      const reserva = await Reserva.findByIdAndUpdate(
        id,
        { aprobado: true, identificador },
        { new: true }
      );

      if (!reserva) {
        res.status(404).json({ message: "Reserva no encontrada" });
      } else {
        res.json({ message: "Reserva aprobada exitosamente", reserva });
      }
    } catch (error) {
      console.error("Error al aprobar la reserva:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Activar una reserva
  putActivar: async (req, res) => {
    try {
      const { id } = req.params;
      const reserva = await Reserva.findByIdAndUpdate(
        id,
        { estado: true },
        { new: true }
      );
      res.json(reserva);
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  // Inactivar una reserva
  putInactivar: async (req, res) => {
    try {
      const { id } = req.params;
      const reserva = await Reserva.findByIdAndUpdate(
        id,
        { estado: false },
        { new: true }
      );
      res.json(reserva);
    } catch (error) {
      res.status(500).json({ error });
    }
  },
};

export default httpReserva;
