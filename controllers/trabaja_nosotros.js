import TrabajaNosotros from "../models/trabaja_nosotros.js";
import Admin from "../models/administrador.js";
import nodemailer from "nodemailer";

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
  
      // Crear la solicitud en la base de datos
      const solicitud = new TrabajaNosotros({
        nombre,
        apellido,
        correo,
        telefono,
        cargo,
        hoja_vida,
      });
  
      await solicitud.save();
  
      // Buscar el correo del administrador
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
        subject: "Solicitud recibida en JuanMar - Trabaja con Nosotros",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
              <!-- Logo -->
              <div style="background-color: #fe6f61; text-align: center; padding: 10px; border-radius: 8px;">
                  <img src="https://restaurante-juanmar.vercel.app/assets/logo_sin_fondo-CC7Frmyr.png" alt="Logo de JuanMar" style="max-width: 150px;">
              </div>
  
              <!-- Contenido -->
              <h2 style="color: #E53935; text-align: center;">¡Gracias por tu interés en unirte a nuestro equipo!</h2>
              <p>Estimado(a) ${nombre} ${apellido},</p>
              <p>Hemos recibido tu solicitud para el cargo de <strong>${cargo}</strong>.</p>
              ${
                hoja_vida
                  ? `<p>Hemos recibido también tu hoja de vida. Nuestro equipo la revisará cuidadosamente.</p>`
                  : `<p>No hemos recibido una hoja de vida en esta solicitud.</p>`
              }
              <p>Nos pondremos en contacto contigo si tu perfil se ajusta a lo que estamos buscando.</p>
  
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
        subject: "Nueva solicitud en Trabaja con Nosotros - JuanMar",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
              <!-- Logo -->
              <div style="background-color: #fe6f61; text-align: center; padding: 10px; border-radius: 8px;">
                  <img src="https://restaurante-juanmar.vercel.app/assets/logo_sin_fondo-CC7Frmyr.png" alt="Logo de JuanMar" style="max-width: 150px;">
              </div>
  
              <!-- Contenido -->
              <h2 style="color: #E53935; text-align: center;">Nueva solicitud en Trabaja con Nosotros</h2>
              <p>Se ha recibido una nueva solicitud con los siguientes datos:</p>
              <ul style="font-size: 14px; margin: 20px; padding: 0 20px; list-style-type: none;">
                <li><strong>Nombre:</strong> ${nombre} ${apellido}</li>
                <li><strong>Teléfono:</strong> ${telefono}</li>
                <li><strong>Correo:</strong> ${correo}</li>
                <li><strong>Cargo:</strong> ${cargo}</li>
                ${
                  hoja_vida
                    ? `<li><strong>Hoja de Vida:</strong> <a href="${hoja_vida.url}" target="_blank">Ver Hoja de Vida</a></li>`
                    : `<li><strong>Hoja de Vida:</strong> No proporcionada</li>`
                }
              </ul>
              <p style="font-size: 14px; text-align: center; margin-top: 20px;">
                Por favor, revisa y gestiona esta solicitud en el sistema.
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
      res.json({ message: "Solicitud creada y correos enviados", solicitud });
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
