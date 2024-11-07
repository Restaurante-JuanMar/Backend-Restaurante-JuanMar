import mongoose from "mongoose";

const trabajaNostrosSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  correo: { type: String, required: true },
  telefono: { type: Number, required: true },
  cargo: { type: String, required: true },
  hoja_vida: { url: { type: String } },
  estado: { type: Boolean, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("TrabajaNosotros", trabajaNostrosSchema);