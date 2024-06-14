import { Router } from "express";
import { crearRoommate, obtenerRoomate } from "../modulos/roommates.js";

const router = Router()

//va a leer los roommates que tenmos en la carpeta data
router.get("/", async (req, res) => {
   try {
      const roommates = await obtenerRoomate()
      res.json(roommates)

   } catch (error) {
      res.status().json({
         status: 500,
         message: "Error interno  de servidor"
      })
   }
})

export { router }