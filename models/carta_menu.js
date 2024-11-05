import mongoose from "mongoose";

const cartaMenuSchema = new mongoose.Schema({
    archivoUrl: { url: { type: String } },
    estado: { type: Boolean, default: 1 },
    createAT: { type: Date, default: Date.now },
});

export default mongoose.model("Carta", cartaMenuSchema);