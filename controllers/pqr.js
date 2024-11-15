import Pqr from "../models/pqr.js";
import Admin from "../models/administrador.js";
import nodemailer from "nodemailer";

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

      // Crear la PQR
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
        subject: `Hemos recibido tu ${tipoPqr} en JuanMar`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
              <!-- Logo -->
              <div style="background-color: #fe6f61; text-align: center; padding: 10px; border-radius: 8px;">
                  <img src="https://restaurante-juanmar.vercel.app/assets/logo_sin_fondo-CC7Frmyr.png" alt="Logo de JuanMar" style="max-width: 150px;">
              </div>
  
              <!-- Contenido -->
              <p>Estimado(a) ${nombre} ${apellido},</p>
              <p>Hemos recibido tu ${tipoPqr} con el asunto <strong>${asunto}</strong>.</p>
              <p><strong>Descripción enviada:</strong></p>
              <blockquote style="font-size: 14px; color: #555; margin: 20px 0; padding-left: 10px; border-left: 3px solid #fe6f61;">
                ${descripcion}
              </blockquote>
              ${
                archivoUrl
                  ? `<p>Hemos recibido también tu archivo adjunto. Nuestro equipo lo revisará cuidadosamente.</p>`
                  : `<p>No hemos recibido ningún archivo adjunto en esta solicitud.</p>`
              }
              <p>Nos pondremos en contacto contigo en el menor tiempo posible para responder a tu ${tipoPqr}.</p>
  
              <!-- Despedida -->
              <p style="margin-top: 20px;">Atentamente,</p>
              <p>El equipo de JuanMar</p>
          </div>
        `,
      };

      // Correo para el administrador
      const enviarCorreoAdmin = {
        from: process.env.userEmail,
        to: admin.correo, // Correo del administrador desde variables de entorno
        subject: `Nueva solicitud PQR recibida en JuanMar`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
              <!-- Logo -->
              <div style="background-color: #fe6f61; text-align: center; padding: 10px; border-radius: 8px;">
                  <img src="https://restaurante-juanmar.vercel.app/assets/logo_sin_fondo-CC7Frmyr.png" alt="Logo de JuanMar" style="max-width: 150px;">
              </div>
  
              <!-- Contenido -->
              <h2 style="color: #E53935; text-align: center;">Nueva ${tipoPqr} recibida</h2>
              <p>Se ha recibido una nueva ${tipoPqr} con los siguientes datos:</p>
              <ul style="font-size: 14px; margin: 20px; padding: 0 20px; list-style-type: none;">
                <li><strong>Nombre:</strong> ${nombre} ${apellido}</li>
                <li><strong>Tipo de Documento:</strong> ${tipoDocumento}</li>
                <li><strong>Número de Documento:</strong> ${numDocumento}</li>
                <li><strong>Teléfono:</strong> ${telefono}</li>
                <li><strong>Correo:</strong> ${correo}</li>
                <li><strong>Asunto:</strong> ${asunto}</li>
                <li><strong>Descripción:</strong> ${descripcion}</li>
                ${
                  archivoUrl
                    ? `<li><strong>Archivo Adjunto:</strong> <a href="${archivoUrl.url}" target="_blank">Ver Archivo</a></li>`
                    : `<li><strong>Archivo Adjunto:</strong> No proporcionado</li>`
                }
              </ul>
              <p style="font-size: 14px; text-align: center; margin-top: 20px;">
                Por favor, revisa y gestiona esta ${tipoPqr} en el sistema.
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
      res.json({ message: "PQR creada y correos enviados", pqr });
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
