import mongoose from "mongoose";

const platoEspecialSchema = new mongoose.Schema({
  nombre_plat: { type: String, required: true },
  descrip_plat: { type: String, required: true },
  imagen: { url: { type: String } },
  estado: { type: Boolean, default: 1 },
  createAT: { type: Date, default: Date.now },
});

export default mongoose.model("PlatoEspecial", platoEspecialSchema);
