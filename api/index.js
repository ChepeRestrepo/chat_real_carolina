import dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import { Server as SocketServer } from "socket.io";
import mongoose from "mongoose";
import Message from "./models/message.js";
import router from "./routes/routeMessajes.js";

const url = process.env.MONGODB_URI;
mongoose.connect(url);

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  core: {
    origin: "*",
  },
});
//Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api", router);
// Configuración de Socket.IO para la comunicación en tiempo real
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  // Evento para recibir mensajes de los clientes
  socket.on("sendMessage", (data) => {
    // Guardar el mensaje en la base de datos
    const { message, from } = data;
    const newMessage = new Message({ message, from });
    newMessage.save((err) => {
      if (err) {
        console.error("Error al guardar el mensaje:", err);
        return;
      }
      // Emitir el mensaje a través de Socket.IO para actualizar la interfaz del chat en tiempo real
      io.emit("newMessage", newMessage);
    });
  });
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error de conexión a MongoDB:"));
db.once("open", () => {
  console.log("Conexión exitosa a MongoDB");
});
// Iniciar el servidor
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
