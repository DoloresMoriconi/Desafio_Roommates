import axios from "axios";
import fs from "fs/promises";
import {v4 as uuidv4} from "uuid";
import path from "path";

const roommatesFile = path.join(import.meta.dirname, "../data/roommates.json")

async function crearRoommate () {
   const data = await axios.get("https://randomuser.me/api")
   const usuarioRandom =  data.data.results[0]
   const roommate = {
      id: uuidv4(),
      nombre: `${usuarioRandom.name.first} ${usuarioRandom.name.last}`,
      email: usuarioRandom.email,
      debe: 0,
      recibe: 0
   }

   fs.readFile(roommatesFile, "utf-8")
   .then(data => {
      const nuevoUsuario =  JSON.parse(data)

      nuevoUsuario.roommates.push(roommate)
      fs.writeFile(roommatesFile, JSON.stringify(nuevoUsuario))
      .then(() => {
         console.log("Roommate agregado con éxito")
      })
      .catch(err => {
         console.error(`Ha ocurrido un error: ${err}`)
      })
   })
   return roommate
}

const obtenerRoomate = async () => {
   try {
      const data = await fs.readFile(roommatesFile, "utf-8")
   
      const roommates = JSON.parse(data)
      return roommates   
   } catch (error) {
      console.error('Error', error)
      return error
   }  
}

//calcular cuanto debee cada persona

//formato para hacer visibles las funciones en el exterior 
//** con commonJS se usa: module.exports = { crearRoommate, obtenerRoommate}

//** con formato ESM se usa:
export { crearRoommate, obtenerRoomate }
