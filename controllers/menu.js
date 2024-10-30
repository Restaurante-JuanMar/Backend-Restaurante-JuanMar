import Menu from "../models/menu.js";

const httpMenu = {
  // Obtener todos los menús
  getAll: async (req, res) => {
    try {
      const menus = await Menu.find();
      res.json(menus);
    } catch (error) {
      console.error("Error al obtener todos los menús:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener un menú por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const menu = await Menu.findById(id);
      if (!menu) {
        res.status(404).json({ message: "Menú no encontrado" });
      } else {
        res.json(menu);
      }
    } catch (error) {
      console.error("Error al obtener el menú por ID:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener menús por posición
  getByPosition: async (req, res) => {
    try {
      const menus = await Menu.find({
        posicion: { $ne: null, $exists: true },
      }).sort({ posicion: 1 });

      res.status(200).json(menus);
    } catch (error) {
      console.error("Error al obtener los menús por posición:", error);
      res.status(500).json({ error: error.message });
    }
  },

  crearOActualizarMenu: async (req, res) => {
    try {
      const { imagen, posicion } = req.body;

      // Buscar si ya existe un menú en esa posición
      let menu = await Menu.findOne({ posicion });

      if (menu) {
        // Si existe, actualizar el menú
        menu = await Menu.findByIdAndUpdate(
          menu._id,
          { imagen, posicion },
          { new: true }
        );
        res.json({ message: "Menú actualizado exitosamente", menu });
      } else {
        // Si no existe, crear un nuevo menú
        menu = new Menu({
          imagen,
          posicion,
        });
        await menu.save();
        res.json({ message: "Menú creado exitosamente", menu });
      }
    } catch (error) {
      console.error("Error al crear o actualizar el menú:", error);
      res.status(500).json({ error: error.message });
    }
  },

  //Put activar menu
  putActivar: async (req, res) => {
    try {
      const { id } = req.params;
      const menu = await Menu.findByIdAndUpdate(
        id,
        { estado: true },
        { new: true }
      );
      res.json(menu);
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  //Put inactivar menu
  putInactivar: async (req, res) => {
    try {
      const { id } = req.params;
      const menu = await Menu.findByIdAndUpdate(
        id,
        { estado: false },
        { new: true }
      );
      res.json(menu);
    } catch (error) {
      res.status(500).json({ error });
    }
  },
};

export default httpMenu;
