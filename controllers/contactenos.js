import Contactar from "../models/contactenos.js";
import Admin from "../models/administrador.js";
import nodemailer from "nodemailer";

const httpContactar = {
  //Get all reservas
  getAll: async (req, res) => {
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
      const { nombre, apellido, telefono, correo, mensaje } = req.body;

      // Crear la solicitud
      const contactar = new Contactar({
        nombre,
        apellido,
        telefono,
        correo,
        mensaje,
      });

      await contactar.save();

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

      // Correo para el cliente
      const enviarCorreoCliente = {
        from: process.env.userEmail,
        to: correo,
        subject: "Solicitud recibida en JuanMar",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
              <!-- Logo -->
              <div style="background-color: #fe6f61; text-align: center; padding: 10px; border-radius: 8px;">
                  <img src="https://restaurante-juanmar.vercel.app/assets/logo_sin_fondo-CC7Frmyr.png" alt="Logo de JuanMar" style="max-width: 150px;">
              </div>
  
              <!-- Contenido -->
              <h2 style="color: #E53935; text-align: center;">¡Hemos recibido tu mensaje!</h2>
              <p>Estimado(a) ${nombre} ${apellido},</p>
              <p>Gracias por ponerte en contacto con nosotros. Hemos recibido tu solicitud y nuestro equipo estará revisando tu mensaje.</p>
              <p><strong>Mensaje enviado:</strong></p>
              <blockquote style="font-size: 14px; color: #555; margin: 20px 0; padding-left: 10px; border-left: 3px solid #fe6f61;">
                ${mensaje}
              </blockquote>
              <p>Nos pondremos en contacto contigo lo más pronto posible.</p>
  
              <!-- Despedida -->
              <p style="margin-top: 20px;">Atentamente,</p>
              <p>El equipo de JuanMar</p>
          </div>
        `,
      };

      // Correo para el administrador
      const enviarCorreoAdmin = {
        from: process.env.userEmail,
        to: admin.correo,
        subject: "Nueva solicitud de contacto recibida",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
              <!-- Logo -->
              <div style="background-color: #fe6f61; text-align: center; padding: 10px; border-radius: 8px;">
                  <img src="https://restaurante-juanmar.vercel.app/assets/logo_sin_fondo-CC7Frmyr.png" alt="Logo de JuanMar" style="max-width: 150px;">
              </div>
  
              <!-- Contenido -->
              <h2 style="color: #E53935; text-align: center;">Nueva solicitud de contacto</h2>
              <p>Se ha recibido una nueva solicitud con los siguientes datos:</p>
              <ul style="font-size: 14px; margin: 20px; padding: 0 20px; list-style-type: none;">
                <li><strong>Nombre:</strong> ${nombre} ${apellido}</li>
                <li><strong>Teléfono:</strong> ${telefono}</li>
                <li><strong>Correo:</strong> ${correo}</li>
                <li><strong>Mensaje:</strong> ${mensaje}</li>
              </ul>
              <p style="font-size: 14px; text-align: center; margin-top: 20px;">
                Por favor, revisa y da seguimiento a esta solicitud.
              </p>
          </div>
        `,
      };

      // Enviar correos en paralelo
      await Promise.all([
        transporter.sendMail(enviarCorreoCliente),
        transporter.sendMail(enviarCorreoAdmin),
      ]);

      // Responder al cliente
      res.json({ message: "Solicitud creada y correos enviados", contactar });
    } catch (error) {
      console.error("Error al crear la solicitud:", error);
      res.status(500).json({ error: error.message });
    }
  },

  //Put editar contactar
  editarSolicitud: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, apellido, telefono, correo, mensaje } = req.body;

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
      );

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
