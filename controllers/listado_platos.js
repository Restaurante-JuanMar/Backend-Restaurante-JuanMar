import ListadoPlatos from "../models/listado_platos.js";
import Reserva from "../models/reserva.js";
import Admin from "../models/administrador.js";
import nodemailer from "nodemailer";

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
      } else {
        // Si no existe, crear un nuevo documento de ListadoPlatos
        listadoPlato = new ListadoPlatos({
          archivoUrl,
          idReserva: reserva._id,
        });

        await listadoPlato.save();
      }

      const admin = await Admin.findOne();
      if (!admin) {
        return res.status(404).json({ error: "Administrador no encontrado" });
      }

      // Configurar transporte de nodemailer
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.userEmail,
          pass: process.env.password,
        },
      });

      // Enviar correo al cliente
      const enviarCorreoCliente = {
        from: process.env.userEmail,
        to: reserva.correo_cliente,
        subject: "Recepción del listado de platos para tu reserva en JuanMar",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
              <!-- Logo -->
              <div style="background-color: #fe6f61; text-align: center; padding: 10px; border-radius: 8px;">
                  <img src="https://restaurante-juanmar.vercel.app/assets/logo_sin_fondo-CC7Frmyr.png" alt="Logo de JuanMar" style="max-width: 150px;">
              </div>
  
              <!-- Contenido -->
              <h2 style="color: #E53935; text-align: center;">¡Hemos recibido tu listado de platos!</h2>
              <p>Estimado(a) ${reserva.nombre_cliente} ${reserva.apellido_cliente},</p>
              <p>Te confirmamos que hemos recibido el listado de platos para tu reserva.</p>
              <p>Nos aseguraremos de tener todo listo para el día de tu visita.</p>
              
              <!-- Mensaje final -->
              <p style="margin-top: 20px;">¡Gracias por confiar en <strong>JuanMar</strong>! Estaremos encantados de atenderte.</p>
              <p>Atentamente,</p>
              <p>El equipo de JuanMar</p>
          </div>
        `,
      };

      // Enviar correo al administrador
      const enviarCorreoAdmin = {
        from: process.env.userEmail,
        to: admin.correo,
        subject: "Nuevo listado de platos recibido",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
              <!-- Logo -->
              <div style="background-color: #fe6f61; text-align: center; padding: 10px; border-radius: 8px;">
                  <img src="https://restaurante-juanmar.vercel.app/assets/logo_sin_fondo-CC7Frmyr.png" alt="Logo de JuanMar" style="max-width: 150px;">
              </div>
  
              <!-- Contenido -->
              <h2 style="color: #E53935; text-align: center;">Listado de platos recibido</h2>
              <p>Se ha recibido un nuevo listado de platos para la siguiente reserva:</p>
              <ul style="font-size: 14px; margin: 20px; padding: 0 20px; list-style-type: none;">
                <li><strong>Cliente:</strong> ${reserva.nombre_cliente} ${
          reserva.apellido_cliente
        }</li>
                <li><strong>Teléfono:</strong> ${reserva.telefono_cliente}</li>
                <li><strong>Correo:</strong> ${reserva.correo_cliente}</li>
                                ${
                                  archivoUrl
                                    ? `<li><strong>Listado de platos: </strong> <a href="${archivoUrl}" target="_blank">Ver Archivo</a></li>`
                                    : `<li><strong>Listado de platos: </strong> No proporcionada</li>`
                                }
              </ul>
              <p style="font-size: 14px; text-align: center; margin-top: 20px;">
                Por favor, verifica y gestiona esta información en el sistema.
              </p>
          </div>
        `,
      };

      // Enviar correos en paralelo
      await Promise.all([
        transporter.sendMail(enviarCorreoCliente),
        transporter.sendMail(enviarCorreoAdmin),
      ]);

      // Respuesta al cliente
      res.json({
        message: "Listado de platos creado/actualizado y correos enviados",
        listadoPlato,
      });
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
