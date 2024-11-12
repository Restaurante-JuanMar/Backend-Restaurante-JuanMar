import ValoresCorporativos from "../models/valores_corporativos.js";

const httpValoresCorporativos = {
  // Obtener todos los valores corporativos
  getAll: async (req, res) => {
    try {
      const valores = await ValoresCorporativos.find();
      res.json(valores);
    } catch (error) {
      console.error("Error al obtener todos los valores corporativos:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener un valor corporativo por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const valor = await ValoresCorporativos.findById(id);
      if (!valor) {
        res.status(404).json({ message: "Valor corporativo no encontrado" });
      } else {
        res.json(valor);
      }
    } catch (error) {
      console.error("Error al obtener el valor corporativo por ID:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Crear un nuevo valor corporativo
  crearValor: async (req, res) => {
    try {
      const { nombre, descripcion } = req.body;

      const nuevoValor = new ValoresCorporativos({
        nombre,
        descripcion,
      });

      await nuevoValor.save();
      res.json(nuevoValor);
    } catch (error) {
      console.error("Error al crear el valor corporativo:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Editar un valor corporativo por ID
  editarValor: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, descripcion  } = req.body;

      const valorActualizado = await ValoresCorporativos.findByIdAndUpdate(
        id,
        { nombre, descripcion },
        { new: true }
      );

      if (!valorActualizado) {
        res.status(404).json({ message: "Valor corporativo no encontrado" });
      } else {
        res.json(valorActualizado);
      }
    } catch (error) {
      console.error("Error al actualizar el valor corporativo:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Activar un valor corporativo
  putActivar: async (req, res) => {
    try {
      const { id } = req.params;
      const valor = await ValoresCorporativos.findByIdAndUpdate(
        id,
        { estado: true },
        { new: true }
      );
      res.json(valor);
    } catch (error) {
      console.error("Error al activar el valor corporativo:", error);
      res.status(500).json({ error });
    }
  },

  // Inactivar un valor corporativo
  putInactivar: async (req, res) => {
    try {
      const { id } = req.params;
      const valor = await ValoresCorporativos.findByIdAndUpdate(
        id,
        { estado: false },
        { new: true }
      );
      res.json(valor);
    } catch (error) {
      console.error("Error al inactivar el valor corporativo:", error);
      res.status(500).json({ error });
    }
  },
};

export default httpValoresCorporativos;