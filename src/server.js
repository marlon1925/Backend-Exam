import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import routerVeterinarios from './routers/veterinario_routes.js'
import routerPacientes from './routers/paciente_routes.js'
// Swagger
import { swaggerDocs as V1SwaggerDocs } from './v1/swagger.js' 


// Inicializaciones
const app = express()
dotenv.config()

// Configuraciones 
app.set('port',process.env.port || 3000)

// Aquí declaras las opciones de cors
const corsOptions = {
    origin: 'https://veterinaria-exam.vercel.app/', // Aquí pones el origen de tus solicitudes
    credentials: true,
    optionSuccessStatus: 200
  }

// Aquí usas el paquete cors con las opciones que declaraste
app.use(cors(corsOptions));

// Middlewares 
app.use(express.json())

// Variables globales

// Rutas 
app.use('/api',routerVeterinarios)
app.use('/api',routerPacientes)


// Swagger 
V1SwaggerDocs(app, app.get('port'))


// Manejo de una ruta que no sea encontrada
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))


export default  app