import mongoose from "mongoose";

const pqrSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  tipoDocumento: { type: String, required: true }, 
  numDocumento: { type: String, required: true },
  correo: { type: String, required: true },
  telefono: { type: Number, required: true },
  tipoPqr: { type: String, required: true },        
  asunto: { type: String, required: true },
  descripcion: { type: String, required: true },
  archivoUrl: { type: String },
  estado: { type: Boolean, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Pqr", pqrSchema);