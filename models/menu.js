import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  imagen: { url: { type: String } },
  posicion: { type: Number, required: true },
  estado: { type: Boolean, default: 1 },
  createAT: { type: Date, default: Date.now },
});

export default mongoose.model("Menu", menuSchema);
