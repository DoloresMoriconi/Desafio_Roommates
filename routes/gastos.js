import { Router } from "express";
import { obtenerGastos } from "../modulos/gastos.js"

const router = Router()

router.get("/", async (req, res) => {
   try {
      const data = await obtenerGastos()
      const gastos = JSON.parse(data)

      res.json(gastos)
   } catch (error) {
      res.status(500).json({
         status: 500,
         message: "Error interno de servidor"
      })
   }
})

export { router } 