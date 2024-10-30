import Contactar from "../models/contactenos.js";
import nodemailer from "nodemailer";

const httpContactar = {
  //Get all reservas
  getTodo: async (req, res) => {
    try {
      const contactenos = await Contactar.find();
      res.json(contactenos);
    } catch (error) {
      res.status(500).json({ error });
      console.log(error);
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const contactar = await Contactar.findById(id);
      if (!contactar) {
        res.status(404).json({ message: "Solicitud no encontrada" });
      } else {
        res.json(contactar);
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  //Post crear contactar
  crearSolicitud: async (req, res) => {
    try {
      const {
        nombre,
        apellido,
        telefono,
        correo,
        mensaje,
      } = req.body;

      // Crear la contactar
      const contactar = new Contactar({
        nombre,
        apellido,
        telefono,
        correo,
        mensaje,
      });

      await contactar.save();

      res.json(contactar);
    } catch (error) {
      console.error("Error al crear la solicitud:", error);
      res.status(500).json({ error: error.message });
    }
  },

  //Put editar contactar
  editarSolicitud: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        nombre,
        apellido,
        telefono,
        correo,
        mensaje,
      } = req.body;

      const contactar = await Contactar.findByIdAndUpdate(
        id,
        {
            nombre,
            apellido,
            telefono,
            correo,
            mensaje,
        },
        { new: true }
      )

      res.json(contactar);
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  //Put activar contactar
  putActivar: async (req, res) => {
    try {
      const { id } = req.params;
      const contactar = await Contactar.findByIdAndUpdate(
        id,
        { estado: true },
        { new: true }
      );
      res.json(contactar);
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  //Put inactivar contactar
  putInactivar: async (req, res) => {
    try {
      const { id } = req.params;
      const contactar = await Contactar.findByIdAndUpdate(
        id,
        { estado: false },
        { new: true }
      );
      res.json(contactar);
    } catch (error) {
      res.status(500).json({ error });
    }
  },
};

export default httpContactar;
