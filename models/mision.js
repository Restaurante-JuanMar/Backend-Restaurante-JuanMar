import mongoose from "mongoose";

const misionSchema = new mongoose.Schema({
  descripcion: { type: String, required: true },
  estado: { type: Boolean, default: 1 },
  createAT: { type: Date, default: Date.now },
});

export default mongoose.model("Mision", misionSchema);
