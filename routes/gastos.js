import { Router } from "express";
import {v4 as uuidv4} from "uuid";
import { obtenerGastos, crearGasto, editarGasto, borrarGasto } from "../modulos/gastos.js"
import { calcularDeuda } from "../modulos/roommates.js";
import enviarCorreo from "../services/emailService.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router()
const roommatesFile = path.join(__dirname, "../data/roommates.json");


router.get("/", async (req, res) => {
   try {
      const gastos = await obtenerGastos()

      res.json(gastos)
   } catch (error) {
      console.error("Error en GET /gastos:", error);

      res.status(500).json({
         status: 500,
         message: "Error interno de servidor",
         error: error.message 
   
      })
   }
})

router.post("/", async (req, res) => {
   const { roommate, monto, descripcion } = req.body

   console.log("Datos recibidos en POST /gastos:", { roommate, monto, descripcion });


   // analizamos que la solicitud traiga lo necesario
   if ( !roommate || !monto || !descripcion) {
      res.status(400).json({
         status: 400,
         message: 'Faltan elementos en el cuerpo de la solicitud'
      })
   } else {
      const gasto = {
         roommate,
         monto,
         descripcion,
         fecha: new Date(),
         id: uuidv4()
      }
   
      try {
         console.log("Intentando crear gasto:", gasto);
         
         // intentamos hacer operación de lectura escritura
         await crearGasto(gasto)

         console.log("Gasto creado, recalculando deudas...");
   
         const roommates = await calcularDeuda();  // Recalcular deudas después de añadir un gasto
         
         console.log("Deudas recalculadas:", roommates);

         // Leer el archivo de roommates para obtener la lista de correos electrónicos
         const roommatesData = await fs.readFile(roommatesFile, 'utf-8');
         const { roommates: roommateList } = JSON.parse(roommatesData);
         const emailList = roommateList.map(roommate => roommate.email);
         
         // Enviar correo electrónico a todos los roommates
         const subject = 'Nuevo gasto registrado';
         const text = `Se ha registrado un nuevo gasto por ${gasto.monto} a nombre de ${gasto.roommate}.`;
         await Promise.all(emailList.map(email => enviarCorreo(email, subject, text)));

         // respondemos con status creado
         res.status(201).json({
            message: 'Gasto Creado con éxito',
            gasto,
            roommates //enviar los roommatess actualizados
         })
      } catch (error) {
         console.error("Error en POST /gastos:", error);
            
       // respondemos con error interno
         res.status(500).json({
            message: "Error interno de servidor",
            status: 500,
            error: error.message
         })
      }
   }

})

router.put("/", async (req, res) => {
   // Obtenemos id del queryString y payload
   const { id } = req.query
   const payload = req.body

   console.log("Datos recibidos en PUT /gastos:", { id, payload });


   if (Object.values(payload).some(value => value === '')) {
      res.status(400).json({
         status: 400,
         message: 'Faltan elementos en el cuerpo de la solicitud',
      });
   } else {
      try {
         payload.id = id;
         await editarGasto(payload);
         const roommates = await calcularDeuda();  // Recalcular deudas después de editar un gasto

         console.log("Deudas recalculadas después de editar gasto:", roommates);


         res.status(200).json({
            message: 'Gasto editado con éxito',
            roommates  // Enviar los roommates actualizados
         });
      } catch (error) {
         console.error("Error en PUT /gastos:", error);

         res.status(500).json({
            status: 500,
            message: 'Error interno de servidor',
            error: error.message
         });
      }
   }
})

router.delete("/", async (req, res) => {
   const {id} = req.query

   console.log("ID recibido en DELETE /gastos:", id);


   if(!id) {
      res.status(400).json({
         message: 'Missing id',
         status: 400
      })
   } else {
      try {
         await borrarGasto(id)
         const roommates = await calcularDeuda();  // Recalcular deudas después de borrar un gasto

         console.log("Deudas recalculadas después de borrar gasto:", roommates);

   
         res.json({
         message: 'Gasto borrado con éxito',
         roommates  // Enviar los roommates actualizados
         })
      } catch (error) {
         console.error("Error en DELETE /gastos:", error);

         res.status(500).json({
            message: 'Error interno de servidor',
            error: error.message
         })
      }
   }
})

export { router } 