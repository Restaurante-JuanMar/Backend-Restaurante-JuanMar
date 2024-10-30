import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  imagen: { url: { type: String } },
  posicion: { type: Number, required: true },
});

export default mongoose.model("Menu", menuSchema);
