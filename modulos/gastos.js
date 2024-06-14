import fs from "fs/promises";
import {v4 as uuidv4} from "uuid";
import path from "path";

const gastosFile = path.join(import.meta.dirname, "../data/gastos.json")

const obtenerGastos = async () => {
   try {
      const data = await fs.readFile(gastosFile, "utf-8")

      const gastos = JSON.stringify(data)
      
      return gastos
   } catch (error) {
      console.log("error", error)
      return error
   }
}

const crearGasto = async () => {

}

const actulizarGasto = async () => {

}

const borrarGasto = async () => {

}
export { crearGasto, obtenerGastos, actulizarGasto, borrarGasto }