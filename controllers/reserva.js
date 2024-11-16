import Reserva from "../models/reserva.js";
import Admin from "../models/administrador.js";
import ListadoPlatos from "../models/listado_platos.js";
import nodemailer from "nodemailer";

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
      // 1. Validar y obtener datos de la solicitud
      const {
        nombre_cliente,
        apellido_cliente,
        correo_cliente,
        telefono_cliente,
        telefono_cliente2,
        num_personas,
        fecha_res,
        mensaje_res,
      } = req.body;

      // 2. Crear una nueva reserva
      const reserva = new Reserva({
        nombre_cliente,
        apellido_cliente,
        correo_cliente,
        telefono_cliente,
        telefono_cliente2,
        num_personas,
        fecha_res,
        mensaje_res,
      });

      await reserva.save();

      // 3. Obtener datos del administrador para enviarle un correo de notificación
      const admin = await Admin.findOne();
      if (!admin) {
        return res.status(404).json({ error: "Administrador no encontrado" });
      }

      // 4. Configurar el transporte de nodemailer
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.userEmail,
          pass: process.env.password,
        },
      });

      // Parsear y formatear fecha
      const fechaResParsed = new Date(fecha_res + "T00:00:00");
      const fechaReservaFormateada = new Intl.DateTimeFormat("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(fechaResParsed);

      const fechaFormateada = new Intl.DateTimeFormat("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date());

      // 5. Enviar correos
      // Correo del cliente
      const enviarCorreoCliente = {
        from: process.env.userEmail,
        to: correo_cliente,
        subject: "Detalles de tu reserva en JuanMar",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
              <!-- Logo con fondo -->
              <div style="background-color: #fe6f61; text-align: center; padding: 10px;">
                  <img src="https://restaurante-juanmar.vercel.app/assets/logo_sin_fondo-CC7Frmyr.png" alt="Logo de JuanMar" style="max-width: 100px;">
              </div>
              
              <!-- Mensaje de inicio -->
              <h2 style="color: #E53935;">¡Gracias por elegir a JuanMar!</h2>
              <p>
                ¡Gracias por elegir a <strong>JuanMar</strong> para tu próxima experiencia gastronómica!
                Nos complace confirmar tu reserva. A continuación, te compartimos algunos detalles importantes
                para asegurar que tu visita sea perfecta.
              </p>
              
              <!-- Detalles de la reserva -->
              <p style="font-size: 14px; color: #000000; font-weight: bold;"><strong>Detalles de tu reserva:</strong></p>
              <p>Nombre: ${nombre_cliente} ${apellido_cliente}</p>
              <p>Correo: ${correo_cliente}</p>
              <p>Teléfono: ${telefono_cliente}</p>
              <p>Teléfono secundario: ${telefono_cliente2 || "No proporcionado"}</p>
              <p>Número de personas: ${num_personas}</p>
              <p>Fecha solicitada: ${fechaReservaFormateada}</p>
              <p>Mensaje: ${mensaje_res || "Sin mensaje adicional"}</p>
              
              <!-- Instrucciones adicionales -->
              <h3 style="color: #E53935; margin-top: 20px;">Información importante:</h3>
              <ol style="font-size: 14px; line-height: 1.6;">
                <li>
                  <strong>Información para grupos grandes:</strong> Si tu reserva es para un grupo grande, 
                  te agradeceríamos que recuerdes el envío de la lista con los platos que deseas tener listos a tu llegada. 
                  Esto nos ayudará a garantizar que todo esté preparado y disponible para ti.
                </li>
                <li>
                  <strong>Opciones de pago:</strong> Aceptamos pagos a través de <strong>Nequi</strong> y <strong>Bancolombia</strong>. 
                  Por favor, indícanos tu preferencia para facilitar el proceso.
                </li>
                <li>
                  <strong>Política de cancelación:</strong> Si no puedes asistir a tu reserva, te pedimos que la canceles 
                  con al menos <strong>5 horas de anticipación</strong>. Esto nos permitirá ofrecer el espacio a otros clientes 
                  y mejorar nuestro servicio.
                </li>
              </ol>
      
              <!-- Mensaje final -->
              <p style="margin-top: 20px;">
                Estamos comprometidos a brindarte una experiencia memorable. Si tienes alguna pregunta o necesitas asistencia 
                adicional, no dudes en ponerte en contacto con nosotros. ¡Estamos ansiosos por recibirte!
              </p>
          </div>
        `,
      };

      const enviarCorreoAdmin = {
        from: process.env.userEmail,
        to: admin.correo,
        subject: `Nueva solicitud de reserva en JuanMar de ${nombre_cliente} ${apellido_cliente}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
              <div style="background-color: #fe6f61; text-align: center; padding: 10px;">
                  <img src="https://restaurante-juanmar.vercel.app/assets/logo_sin_fondo-CC7Frmyr.png" alt="Logo de JuanMar" style="max-width: 100px;">
              </div>
              <h2 style="color: #E53935;">Nueva solicitud de reserva recibida</h2>
              <p>Detalles de la solicitud:</p>
              <p>Nombre cliente: ${nombre_cliente} ${apellido_cliente}</p>
              <p>Correo cliente: ${correo_cliente}</p>
              <p>Teléfono cliente: <a href="https://wa.me/57${telefono_cliente}">${telefono_cliente}</a></p>
              <p>Teléfono secundario: ${telefono_cliente2
            ? `<a href="https://wa.me/57${telefono_cliente2}">${telefono_cliente2}</a>`
            : "No proporcionado"
          }</p>
              <p>Número de personas: ${num_personas}</p>
              <p>Fecha solicitada: ${fechaReservaFormateada}</p>
              <p>Mensaje del cliente: ${mensaje_res || "Sin mensaje adicional"
          }</p>
              <p>Reserva enviada el: ${fechaFormateada}</p>
              <p style="font-size: 14px; color: #E53935; font-weight: bold;">
                  Por favor, revisa esta solicitud y confirma la reserva si es posible.
              </p>
          </div>
        `,
      };

      // Enviar correos de forma asíncrona
      await Promise.all([
        transporter.sendMail(enviarCorreoCliente),
        transporter.sendMail(enviarCorreoAdmin),
      ]);

      // 6. Responder con la reserva creada
      res.json({ message: "Reserva creada exitosamente", reserva });
    } catch (error) {
      console.error("Error al crear la reserva:", error);
      res.status(500).json({ error: "Error interno del servidor" });
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
      let identificador;
      let unique = false;

      // Obtener el año actual dinámicamente
      const currentYear = new Date().getFullYear();

      // Generar un identificador único
      while (!unique) {
        identificador = `${currentYear}${Math.floor(
          10000 + Math.random() * 90000
        )}`;

        // Verificar si el identificador ya existe en otra reserva
        const existingReserva = await Reserva.findOne({ identificador });
        if (!existingReserva) {
          unique = true;
        }
      }

      // Actualizar la reserva con el identificador único
      const reserva = await Reserva.findByIdAndUpdate(
        id,
        { aprobado: true, identificador },
        { new: true }
      );

      if (!reserva) {
        return res.status(404).json({ message: "Reserva no encontrada" });
      }

      // Configurar el transporte de nodemailer
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.userEmail,
          pass: process.env.password,
        },
      });

      const admin = await Admin.findOne();
      if (!admin) {
        return res.status(404).json({ error: "Administrador no encontrado" });
      }

      // Enviar correo al cliente
      const enviarCorreoCliente = {
        from: process.env.userEmail,
        to: reserva.correo_cliente,
        subject: "Tu reserva en JuanMar ha sido confirmada",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
              <!-- Logo con fondo -->
              <div style="background-color: #fe6f61; text-align: center; padding: 10px; border-radius: 8px;">
                  <img src="https://restaurante-juanmar.vercel.app/assets/logo_sin_fondo-CC7Frmyr.png" alt="Logo de JuanMar" style="max-width: 150px;">
              </div>
              
              <!-- Título del correo -->
              <h2 style="color: #E53935;">¡Tu reserva ha sido confirmada!</h2>
              
              <!-- Saludo al cliente -->
              <p>Estimado(a) ${reserva.nombre_cliente} ${reserva.apellido_cliente},</p>
              <p>Nos complace informarte que tu reserva en el restaurante <strong>JuanMar</strong> ha sido confirmada.</p>
              
              <!-- Instrucciones adicionales -->
              <p>Para completar tu reserva, por favor sigue estos pasos:</p>
              <ol style="font-size: 14px; line-height: 1.6;">
                <li>
                  Dirígete a la sección de reservas en nuestra página web, baja o haz scroll hasta donde dice 
                  <strong>¿Ya tienes una reserva confirmada?</strong>, haz clic en el botón <strong>"Clic aquí"</strong> y luego ingresa el siguiente número de ticket.
                </li>
                <li>
                  Adjunta un archivo en formato PDF con los platos que deseas solicitar para esta reserva.
                </li>
              </ol>
              
              <!-- Número de ticket destacado -->
              <p style="font-size: 18px; color: #E53935; font-weight: bold; text-align: center; margin-top: 20px;">
                Número de Ticket: ${identificador}
              </p>
              
              <!-- Nota adicional -->
              <p style="font-size: 14px; margin-top: 20px;">
                Este número es único para tu reserva y será necesario para procesar tus solicitudes. No olvides cargar el archivo con tus platos al completar los detalles de tu reserva.
              </p>
              
              <!-- Despedida -->
              <p style="margin-top: 20px;">¡Gracias por elegir <strong>JuanMar</strong>, estaremos encantados de atenderte!</p>
              <p>Atentamente,</p>
              <p>El equipo de JuanMar</p>
          </div>
        `,
      };

      const enviarCorreoAdmin = {
        from: process.env.userEmail,
        to: admin.correo,
        subject: "Reserva aprobada en JuanMar",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
              <!-- Logo con fondo -->
              <div style="background-color: #fe6f61; text-align: center; padding: 10px; border-radius: 8px;">
                  <img src="https://restaurante-juanmar.vercel.app/assets/logo_sin_fondo-CC7Frmyr.png" alt="Logo de JuanMar" style="max-width: 150px;">
              </div>
              
              <!-- Título del correo -->
              <h2 style="color: #E53935; text-align: center;">Reserva Aprobada</h2>
              
              <!-- Detalles del cliente -->
              <p style="font-size: 14px; text-align: center;">
                Una reserva ha sido aprobada en el sistema con los siguientes detalles:
              </p>
              <ul style="font-size: 14px; margin: 20px; padding: 0 20px; list-style-type: none;">
                <li><strong>Cliente:</strong> ${reserva.nombre_cliente} ${reserva.apellido_cliente}</li>
                <li><strong>Teléfono:</strong> ${reserva.telefono_cliente}</li>
                <li><strong>Correo:</strong> ${reserva.correo_cliente}</li>
              </ul>
              
              <!-- Número de ticket destacado -->
              <p style="font-size: 18px; color: #E53935; font-weight: bold; text-align: center; margin: 20px 0;">
                Número de Ticket: ${identificador}
              </p>
              
              <!-- Mensaje de cierre -->
              <p style="font-size: 14px; text-align: center; margin-top: 20px;">
                Este ticket está ahora disponible para la gestión correspondiente.
              </p>
          </div>
        `,
      };

      // Enviar correos al cliente y al administrador
      await Promise.all([
        transporter.sendMail(enviarCorreoCliente),
        transporter.sendMail(enviarCorreoAdmin),
      ]);

      // Responder con la reserva aprobada
      res.json({
        message: "Reserva aprobada y correo enviado exitosamente",
        reserva,
      });
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

  // Inactivar una reserva y también inactivar el documento de ListadoPlatos asociado (si solo existe uno)
  putInactivar: async (req, res) => {
    try {
      const { id } = req.params;

      // Inactivar la reserva
      const reserva = await Reserva.findByIdAndUpdate(
        id,
        { estado: false },
        { new: true }
      );

      if (!reserva) {
        return res.status(404).json({ message: "Reserva no encontrada" });
      }

      // Inactivar el documento de ListadoPlatos asociado a esta reserva
      await ListadoPlatos.findOneAndUpdate(
        { idReserva: id },
        { estado: false }
      );

      res.json({
        message:
          "Reserva y documento de listado de platos asociado inactivados exitosamente",
        reserva,
      });
    } catch (error) {
      console.error(
        "Error al inactivar la reserva y el documento de listado de platos asociado:",
        error
      );
      res.status(500).json({ error: error.message });
    }
  },
};

export default httpReserva;
