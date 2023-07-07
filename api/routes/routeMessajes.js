import express from "express";
import controller from "../controllers/messageController.js";
const router = express.Router();

//Definimos las rutas de la app

//Endpoint para mandar mensajes
router.post("/save", controller.save);
//Endpoint para obtener los mensajes
router.get("/messages", controller.getMessages);

export default router;
