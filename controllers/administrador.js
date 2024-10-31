import bcryptjs from "bcryptjs";
import Administrador from "../models/administrador.js";
import helpersGeneral from "../helpers/generales.js";
import { generarJWT } from "../middlewares/validar-jwt.js";

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
        rol,
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
