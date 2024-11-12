import mongoose from "mongoose";

const visionSchema = new mongoose.Schema({
  descripcion: { type: String, required: true },
  estado: { type: Boolean, default: 1 },
  createAT: { type: Date, default: Date.now },
});

export default mongoose.model("Vision", visionSchema);
