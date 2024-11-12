import Mision from "../models/mision.js";

const httpMision = {
    // Obtener todas las misiones
    getAll: async (req, res) => {
        try {
            const misiones = await Mision.find();
            res.json(misiones);
        } catch (error) {
            console.error("Error al obtener todas las misiones:", error);
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener una misión por ID
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const mision = await Mision.findById(id);
            if (!mision) {
                res.status(404).json({ message: "Misión no encontrada" });
            } else {
                res.json(mision);
            }
        } catch (error) {
            console.error("Error al obtener la misión por ID:", error);
            res.status(500).json({ error: error.message });
        }
    },

    // Crear o actualizar una única misión
    agregarOEditarMision: async (req, res) => {
        try {
            const { descripcion, estado } = req.body;

            // Buscar si ya existe una misión
            let mision = await Mision.findOne();

            if (mision) {
                // Si existe, actualizar la misión
                mision.descripcion = descripcion;
                mision.estado = estado;
                await mision.save();
                res.json({
                    message: "Misión actualizada exitosamente",
                    mision,
                });
            } else {
                // Si no existe, crear una nueva misión
                mision = new Mision({ descripcion, estado });
                await mision.save();
                res.json({ message: "Misión creada exitosamente", mision });
            }
        } catch (error) {
            console.error("Error al gestionar la misión:", error);
            res.status(500).json({ error: error.message });
        }
    },

    // Activar una misión
    putActivar: async (req, res) => {
        try {
            const { id } = req.params;
            const mision = await Mision.findByIdAndUpdate(
                id,
                { estado: true },
                { new: true }
            );
            res.json(mision);
        } catch (error) {
            console.error("Error al activar la misión:", error);
            res.status(500).json({ error });
        }
    },

    // Inactivar una misión
    putInactivar: async (req, res) => {
        try {
            const { id } = req.params;
            const mision = await Mision.findByIdAndUpdate(
                id,
                { estado: false },
                { new: true }
            );
            res.json(mision);
        } catch (error) {
            console.error("Error al inactivar la misión:", error);
            res.status(500).json({ error });
        }
    },
};

export default httpMision;
