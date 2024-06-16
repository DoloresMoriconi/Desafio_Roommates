import axios from "axios";
import fs from "fs/promises";
import {v4 as uuidv4} from "uuid";
import path from "path";
import { fileURLToPath } from 'url';
import { error } from "console";

// Obtener la ruta correcta del archivo en un entorno ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const roommatesFile = path.join(__dirname, "../data/roommates.json")
const gastosFile = path.join(__dirname, "../data/gastos.json");

async function crearRoommate () {
   try {
      const data = await axios.get("https://randomuser.me/api")
      const usuarioRandom =  data.data.results[0]
      const roommate = {
         id: uuidv4(),
         nombre: `${usuarioRandom.name.first} ${usuarioRandom.name.last}`,
         email: usuarioRandom.email,
         debe: 0,
         recibe: 0
      }

      const dataRoommates = await fs.readFile(roommatesFile, "utf-8")
      const nuevoUsuario =  JSON.parse(data)

      nuevoUsuario.roommates.push(roommate)

      await fs.writeFile(roommatesFile, JSON.stringify(nuevoUsuario))
      
      console.log("Roommate agregado con éxito")
      
      return roommate
      } catch(error) {
         console.error(`Ha ocurrido un error: ${error}`)   
      }
   }


const obtenerRoommate = async () => {
   try {
      const data = await fs.readFile(roommatesFile, "utf-8")
   
      const roommates = JSON.parse(data)

      // Agregar IDs si faltan
      roommates.roommates = roommates.roommates.map(roommate => {
         if (!roommate.id) {
            roommate.id = uuidv4();
         }
         return roommate;
      })
      
      await fs.writeFile(roommatesFile, JSON.stringify(roommates, null, 2));

      return roommates   
   } catch (error) {
      console.error('Error', error)
      return error
   }  
}

//calcular cuanto debe cada persona
const calcularDeuda = async () => {
   try{
      const dataRoommates = await fs.readFile(roommatesFile, "utf-8")
      const dataGastos = await fs.readFile(gastosFile, "utf-8")

      // Obtiene los arreglos de roommates y de gastos
      let {roommates} = JSON.parse(dataRoommates)
      const {gastos} = JSON.parse(dataGastos)

      // Reseteamos roomates para calcular
      roommates = roommates.map(r => {
         r.debe = 0
         r.recibe = 0
         r.total = 0
      
         return r
   })

   // obtiene el largo del arreglo roommates, y lo asigna a totalRoommates
   const { length: totalRoommates } = roommates

   // itera sobre cada gasto
   gastos.forEach(gasto => {
     // obtiene el monto del gasto actual, y quien hizo el gasto
     // asignandolo a la variable "quienGasto"
      const { monto, roommate: quienGasto } = gasto
      const montoPorPersona = monto/totalRoommates

     // para este gasto particular, itera sobre los roommates y asigna 
     // Cuanto debe cada roommate y cuanto le deben a la persona que hizo el gasto
      roommates = roommates.map( roommate => {
      const { nombre } = roommate

      if ( quienGasto === nombre ) {
         roommate.recibe += montoPorPersona * (totalRoommates - 1)
         
      } else {
         roommate.debe += montoPorPersona
      
      }

         roommate.total = Math.round((roommate.recibe - roommate.debe)* 100)/100

         return roommate
      })
   });

   // una vez terminado el ciclo de asignación, escribe nuevamente el archivo con los datos
   // de cuanto debe y cuando recibe cada roommate
   await fs.writeFile(roommatesFile, JSON.stringify({roommates}))
   
   console.log('Deudas calculadas correctamente:', roommates);
   
   } catch (error) {
      console.error('Error al calcular las deudas', error)
   }
}


//formato para hacer visibles las funciones en el exterior 
//** con commonJS se usa: module.exports = { crearRoommate, obtenerRoommate}

//** con formato ESM se usa:
export { crearRoommate, obtenerRoommate, calcularDeuda }
