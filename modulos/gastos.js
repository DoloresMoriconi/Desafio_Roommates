import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

//define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const gastosFile = `${__dirname}/../data/gastos.json`;

export const obtenerGastos = async () => {
   try {
      const data = await fs.readFile(gastosFile, "utf-8")
      const gastosData = JSON.parse(data)
      return { gastos: gastosData.gastos } 

   } catch (error) {
      console.log("Error al obtener gastos:", error)
      return error
   }
}

export const crearGasto = async (gasto) => {
   try {
      const data = await fs.readFile(gastosFile, "utf-8")
      const gastosData = JSON.parse(data)
      
      // Ingresa un nuevo gasto al arreglo
      gastosData.gastos.push(gasto)
      await fs.writeFile(gastosFile, JSON.stringify(gastosData))  
      return gastosData.gastos

   } catch (error) {
      console.error("Error al crear gastos:", error)
      return error
   }
}


export const editarGasto = async (payload) => {
   try {
      const data = await fs.readFile(gastosFile, "utf-8")
      const gastosData = JSON.parse(data)
      const { id } = payload

      // Actualiza el gasto con el ID coincidente
      gastosData.gastos = gastosData.gastos.map(gasto =>
         gasto.id === id ? { ...gasto, ...payload } : gasto
      );
      await fs.writeFile(gastosFile, JSON.stringify(gastosData))
      return gastosData.gastos

   } catch (error) {
      console.error("Error al editar gasto:", error)
      return error
   }
}


export const borrarGasto = async (id) => {
   try {
      const data = await fs.readFile(gastosFile, "utf-8")
      const gastosData = JSON.parse(data)
      
     // Filtra el arreglo para excluir el gasto con el ID especificado
      gastosData.gastos = gastosData.gastos.filter(gasto => gasto.id !== id)
      await fs.writeFile(gastosFile, JSON.stringify(gastosData))
      return gastosData.gastos

   } catch (error) {
      console.error("Error al borrar gasto:", error)
      return error;
   }
}
