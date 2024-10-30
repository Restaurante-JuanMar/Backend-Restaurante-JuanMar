import mongoose from "mongoose";

const cartaMenuSchema = new mongoose.Schema({
    archivoUrl: { type: String },
});

export default mongoose.model("Carta", cartaMenuSchema);