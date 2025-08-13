import  express  from "express"
import 'dotenv/config'
import dbConexion from "./database/cnxmongoose.js";
import cors from 'cors';

import Usuario from "./routes/usuario.js";
import Empleado from "./routes/empleado.js";
import Gasto from "./routes/gasto.js";
import Inventario from "./routes/inventario.js";
import Producto from "./routes/producto.js";
import uploadRoutes from "./routes/upload.js";
import Pedido from "./routes/pedido.js";

const app = express()
app.use(express.json())
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use('/api/upload', uploadRoutes)

app.use("/api/usuario",Usuario)
app.use("/api/empleado",Empleado)
app.use("/api/gasto",Gasto)
app.use("/api/inventario",Inventario)
app.use("/api/producto",Producto)
app.use("/api/pedido",Pedido)

app.listen(process.env.PORT,()=>{
    console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
    dbConexion()
})