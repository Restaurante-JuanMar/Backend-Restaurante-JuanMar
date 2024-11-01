import mongoose from "mongoose";

const reservaSchema = new mongoose.Schema({
  nombre_cliente: { type: String, required: true },
  apellido_cliente: { type: String, required: true },
  correo_cliente: { type: String, required: true },
  cedula_cliente: { type: String, required: true },
  telefono_cliente: { type: String, required: true },
  telefono_cliente2: { type: String },
  num_personas: { type: String, required: true },
  fecha_res: { type: Date, required: true },
  mensaje_res: { type: String },
  identificador: { type: String },
  aprobado: { type: Boolean, default: 0 },
  createdAt: { type: Date, default: Date.now },
  estado: { type: Boolean, default: 1 }
});

export default mongoose.model("Reserva", reservaSchema);
