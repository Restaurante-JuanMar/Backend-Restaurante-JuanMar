import mongoose from "mongoose";

const listadoPlatoSchema = new mongoose.Schema({
  archivoUrl: { type: String },
  idReserva: { type: mongoose.Schema.Types.ObjectId, ref: "Reserva", required: true },
  estado: { type: Boolean, default: 1 },
  createAT: { type: Date, default: Date.now },
});

export default mongoose.model("ListadoPlatos", listadoPlatoSchema);
