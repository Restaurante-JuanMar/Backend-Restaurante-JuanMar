import bcryptjs from "bcryptjs";
import Administrador from "../models/administrador.js";
import helpersGeneral from "../helpers/generales.js";
import nodemailer from "nodemailer";
import { generarJWT } from "../middlewares/validar-jwt.js";

let codigoEnviado = {};

function generarNumeroAleatorio() {
  let primerDigito = Math.floor(Math.random() * 9) + 1;
  
  let restoNumero = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
  
  let numero = primerDigito + restoNumero;
  
  let fechaCreacion = new Date();
  codigoEnviado = { codigo: numero, fechaCreacion };

  return numero;
}


const httpAdministrador = {
  //Get all administradores
  getAll: async (req, res) => {
    try {
      const administradores = await Administrador.find();
      res.json(administradores);
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  //Get administrador by ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const administrador = await Administrador.findById(id);
      if (!administrador) {
        res.status(404).json({ message: "Administrador no encontrado" });
      } else {
        res.json(administrador);
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  //Post crear administrador
  crearUsuario: async (req, res) => {
    try {
      const { nombre, apellido, cedula, correo, telefono, password } =
        req.body;

      const mayusNombre = await helpersGeneral.mayusAllPalabras(nombre.trim());
      const mayusApellido = await helpersGeneral.mayusAllPalabras(apellido.trim());
      
      const administrador = new Administrador({
        nombre: mayusNombre,
        apellido: mayusApellido,
        cedula,
        correo,
        telefono,
        password,
      });

      const salt = bcryptjs.genSaltSync();
      administrador.password = bcryptjs.hashSync(password, salt);

      await administrador.save();

      res.json(administrador);
    } catch (error) {
      res.status(500).json({ error });
      console.log(error)
    }
  },

  login: async (req, res) => {
    const { cedula, password } = req.body;

    try {
      const administrador = await Administrador.findOne({ cedula });
      console.log("a", administrador);

      if (!administrador) {
        return res.status(400).json({
          error: "Identificación o Contraseña no son correctos",
        });
      }
      if (administrador.estado == false) {
        return res.status(400).json({
          error: "Administrador Inactivo",
        });
      }
      const validPassword = bcryptjs.compareSync(password, administrador.password);
      if (!validPassword) {
        return res.status(401).json({
          error: "Identificación o Contraseña no son correctos",
        });
      }
      const token = await generarJWT(administrador.id);
      res.json({ administrador, token });
    } catch (error) {
      return res.status(500).json({
        error: "Hable con el WebMaster",
      });
    }
  },

  //Put editar administrador
  editarUsuario: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, apellido, cedula, correo, telefono } = req.body;

      const mayusNombre = await helpersGeneral.mayusAllPalabras(nombre.trim());
      const mayusApellido = await helpersGeneral.mayusAllPalabras(apellido.trim());

      const administrador = await Administrador.findByIdAndUpdate(
        id,
        {
          nombre: mayusNombre,
          apellido: mayusApellido,
          cedula,
          correo,
          telefono,
        },
        { new: true }
      );

      res.json(administrador);
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  codigoRecuperar: async (req, res) => {
    try {
      const { correo } = req.params;

      const codigo = generarNumeroAleatorio();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.userEmail,
          pass: process.env.password,
        },
      });

      const mailOptions = {
        from: process.env.userEmail,
        to: correo,
        subject: "Recuperación de Contraseña",
        text: "Tu código para restablecer tu contraseña es: " + codigo,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.status(500).json({
            success: false,
            error: "Error al enviar el correo electrónico.",
          });
        } else {
          console.log("Correo electrónico enviado: " + info.response);
          res.json({
            success: true,
            msg: "Correo electrónico enviado con éxito.",
          });
        }
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({ error });
    }
  },

  confirmarCodigo: async (req, res) => {
    try {
      const { codigo } = req.params;

      if (!codigoEnviado) {
        return res.status(400).json({ error: "Código no generado" });
      }

      const { codigo: codigoGuardado, fechaCreacion } = codigoEnviado;
      const tiempoExpiracion = 30; // Tiempo de expiración en minutos

      const tiempoActual = new Date();
      const tiempoDiferencia = tiempoActual - new Date(fechaCreacion);
      const minutosDiferencia = tiempoDiferencia / (1000 * 60);

      if (minutosDiferencia > tiempoExpiracion) {
        return res.status(400).json({ error: "El código ha expirado" });
      }

      if (codigo == codigoGuardado) {
        return res.json({ msg: "Código correcto" });
      }

      return res.status(400).json({ error: "Código incorrecto" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Error, hable con el WebMaster",
      });
    }
  },

  nuevaPassword: async (req, res) => {
    try {
      const { codigo, password } = req.body;

      const { codigo: codigoGuardado, fechaCreacion } = codigoEnviado;
      const tiempoExpiracion = 30; // Tiempo de expiración en minutos

      const tiempoActual = new Date();
      const tiempoDiferencia = tiempoActual - new Date(fechaCreacion);
      const minutosDiferencia = tiempoDiferencia / (1000 * 60);

      if (minutosDiferencia > tiempoExpiracion) {
        return res.status(400).json({ error: "El código ha expirado" });
      }

      if (codigo == codigoGuardado) {
        codigoEnviado = {};

        const administrador = req.AdministradorUpdate;

        const salt = bcryptjs.genSaltSync();
        const newPassword = bcryptjs.hashSync(password, salt);

        await Administrador.findByIdAndUpdate(
          administrador.id,
          { password: newPassword },
          { new: true }
        );

        return res
          .status(200)
          .json({ msg: "Contraseña actualizada con éxito" });
      }

      return res.status(400).json({ error: "Código incorrecto" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Error, hable con el WebMaster",
      });
    }
  },

  putCambioPassword: async (req, res) => {
    try {
      const { id } = req.params;
      const { password, newPassword } = req.body;
      const administrador = await Administrador.findById(id);

      if (!administrador) {
        return res.status(404).json({ error: "Administrador no encontrado" });
      }

      const passAnterior = administrador.password;

      const validPassword = bcryptjs.compareSync(
        String(password),
        String(passAnterior)
      );

      if (!validPassword) {
        return res.status(401).json({ error: "Contraseña actual incorrecta" });
      }

      const salt = bcryptjs.genSaltSync();
      const cryptNewPassword = bcryptjs.hashSync(newPassword, salt);

      await Administrador.findByIdAndUpdate(
        administrador.id,
        { password: cryptNewPassword },
        { new: true }
      );

      return res.status(200).json({ msg: "Contraseña actualizada con éxito" });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ msgError: "Error interno del servidor", error });
    }
  },

  //Put activar administrador
  putActivar: async (req, res) => {
    try {
      const { id } = req.params;
      const administrador = await Administrador.findByIdAndUpdate(
        id,
        { estado: true },
        { new: true }
      );
      res.json(administrador);
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  //Put inactivar administrador
  putInactivar: async (req, res) => {
    try {
      const { id } = req.params;
      const administrador = await Administrador.findByIdAndUpdate(
        id,
        { estado: false },
        { new: true }
      );
      res.json(administrador);
    } catch (error) {
      res.status(500).json({ error });
    }
  },
};

export default httpAdministrador;
