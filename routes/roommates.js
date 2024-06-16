import { Router } from "express";
import axios from 'axios'
import fs from "fs/promises";
import path from "path";
import {v4 as uuidv4} from "uuid";
import { obtenerRoommate, calcularDeuda } from "../modulos/roommates.js";

const router = Router()

//va a leer los roommates que tenmos en la carpeta data
router.get("/", async (req, res) => {
   try {
      const roommates = await obtenerRoommate()
      res.json(roommates)

   } catch (error) {
      res.status().json({
         status: 500,
         message: "Error interno  de servidor"
      })
   }
})

router.post("/", async (req, res) => {
   try {
      const axiosResponse = await axios.get("https://randomuser.me/api/")

      const userResponded = axiosResponse.data.results[0]
      const roommatesData = {
         nombre: userResponded.name.first + " " + userResponded.name.last,
         debe: 0,
         recibe: 0
      }

      const filePath = path.join(import.meta.dirname, "../data/roommates.json")
   fs.readFile(filePath, "utf-8")
      .then(data => {
         const roommatesJson = JSON.parse(data)
         roommatesJson.roommates.push(roommatesData)
         return roommatesJson
      })
      .then(data => {
         fs.writeFile(filePath, JSON.stringify(data))
      })
      res.json(roommatesData)
   } catch (error) {
      res.status(500).json({error})
   }
})

router.get("/calcularDeudas", async (req, res) => {
   try {
      const roommates = await calcularDeuda();
      res.json({
         message: "Deudas calculadas con éxito",
         roommates
      });
} catch (error) {
      res.status(500).json({
         status: 500,
         message: "Error interno de servidor"
      });
   }
});

export { router }