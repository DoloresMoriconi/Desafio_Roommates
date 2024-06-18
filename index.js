import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

//importar rutas:
import { router as roommates } from "./routes/roommates.js";
import { router as gastos } from "./routes/gastos.js";

app.use(express.json())

app.get("/", (req, res) => {
   res.sendFile(path.join(__dirname + "/index.html"))
})

app.use("/roommates", roommates)
app.use("/gastos", gastos)

app.post("/roommates", async (req, res) => {
   
})

app.listen(3000, () => {
   console.log("App en puerto 3000")
})

