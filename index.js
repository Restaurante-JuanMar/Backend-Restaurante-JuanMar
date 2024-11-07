import express from "express";
import http from "http";
import "dotenv/config";
import mongoose from "mongoose";
import cors from 'cors';
import Admin from "./routes/administrador.js";
import Contactar from "./routes/contactenos.js";
import Pqr from "./routes/pqr.js";
import Menu from "./routes/menu.js";
import CartaMenu from "./routes/carta_menu.js";
import Galeria from "./routes/galeria.js";
import ListadoPlato from "./routes/listado_platos.js";
import PlatoEspecial from "./routes/plato_especial.js";
import Reserva from "./routes/reserva.js";
import TrabajaConNosotros from './routes/trabaja_nosotros.js';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.use("/api/admin", Admin);
app.use("/api/contactenos", Contactar);
app.use("/api/pqr", Pqr);
app.use("/api/menu", Menu);
app.use("/api/carta-menu", CartaMenu);
app.use("/api/galeria", Galeria);
app.use("/api/listado-plato", ListadoPlato);
app.use("/api/plato-especial", PlatoEspecial);
app.use("/api/reserva", Reserva);
app.use("/api/trabaja-con-nosotros", TrabajaConNosotros);

const server = http.createServer(app);

 mongoose.connect(`${process.env.mongoDB}`)
.then(() => console.log("Conexión a mongoDB exitosa!"));

server.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
 