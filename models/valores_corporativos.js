import mongoose from "mongoose";

const valoresCorpSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    estado: { type: Boolean, default: 1 },
    createAT: { type: Date, default: Date.now },
});

export default mongoose.model("ValoresCorporativos", valoresCorpSchema);