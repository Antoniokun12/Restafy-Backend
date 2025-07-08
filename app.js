import  express  from "express"
import 'dotenv/config'
import dbConexion from "./database/cnxmongoose.js";
import cors from 'cors';

import Usuario from "./routes/usuario.js";
import Empleado from "./routes/empleado.js";
import Gasto from "./routes/gasto.js";

const app = express()
app.use(express.json())
app.use(cors());

app.use("/api/usuario",Usuario)
app.use("/api/empleado",Empleado)
app.use("/api/gasto",Gasto)

app.listen(process.env.PORT,()=>{
    console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
    dbConexion()
})