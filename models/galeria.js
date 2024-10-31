import mongoose from "mongoose";

const galeriaSchema = new mongoose.Schema({
  imagen: { url: { type: String } },
  descrip_gal: { type: String, required: true },
  fecha_gal: { type: Date, required: true },
  posicion: { type: Number, required: true },
  estado: { type: Boolean, default: 1 },
  createAT: { type: Date, default: Date.now },
});

export default mongoose.model("Galeria", galeriaSchema);
