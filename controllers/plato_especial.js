import PlatoEspecial from "../models/plato_especial.js";

const httpPlatoEspecial = {
  // Obtener todos los platos especiales
  getAll: async (req, res) => {
    try {
      const platos = await PlatoEspecial.find();
      res.json(platos);
    } catch (error) {
      console.error("Error al obtener todos los platos especiales:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener un plato especial por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const plato = await PlatoEspecial.findById(id);
      if (!plato) {
        res.status(404).json({ message: "Plato especial no encontrado" });
      } else {
        res.json(plato);
      }
    } catch (error) {
      console.error("Error al obtener el plato especial por ID:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Crear un nuevo plato especial
  crearPlato: async (req, res) => {
    try {
      const { nombre_plat, descrip_plat, imagen } = req.body;

      const newPlato = new PlatoEspecial({
        nombre_plat,
        descrip_plat,
        imagen,
      });

      await newPlato.save();
      res.json(newPlato);
    } catch (error) {
      console.error("Error al crear el plato especial:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar un plato especial por ID
  editarPlato: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre_plat, descrip_plat, imagen } = req.body;

      const updatedPlato = await PlatoEspecial.findByIdAndUpdate(
        id,
        { nombre_plat, descrip_plat, imagen },
        { new: true }
      );

      if (!updatedPlato) {
        res.status(404).json({ message: "Plato especial no encontrado" });
      } else {
        res.json(updatedPlato);
      }
    } catch (error) {
      console.error("Error al actualizar el plato especial:", error);
      res.status(500).json({ error: error.message });
    }
  },

  //Put activar plato especial
  putActivar: async (req, res) => {
    try {
      const { id } = req.params;
      const platoespecial = await PlatoEspecial.findByIdAndUpdate(
        id,
        { estado: true },
        { new: true }
      );
      res.json(platoespecial);
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  //Put inactivar plato especial
  putInactivar: async (req, res) => {
    try {
      const { id } = req.params;
      const platoespecial = await PlatoEspecial.findByIdAndUpdate(
        id,
        { estado: false },
        { new: true }
      );
      res.json(platoespecial);
    } catch (error) {
      res.status(500).json({ error });
    }
  },
};

export default httpPlatoEspecial;
