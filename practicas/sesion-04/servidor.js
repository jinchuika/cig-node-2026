// servidor.js
// API de contactos con validación y manejo central de errores.
// Antes de ejecutar: copie .env.example como .env
// Ejecute: npm run dev

import express from 'express';
import rutasContactos from './rutas-contactos.js';
import rutasPruebas from './rutas-pruebas.js';
import { registrarPeticion, noEncontrado, manejarErrores } from './middlewares.js';

const PUERTO = process.env.PUERTO;
const app = express();

// 1. Antes de las rutas
app.use(registrarPeticion);
app.use(express.json());

// 2. Rutas
app.use('/contactos', rutasContactos);
app.use('/pruebas', rutasPruebas);

// 3. Después de las rutas, en este orden:
app.use(noEncontrado);   // nadie atendió la petición: 404
app.use(manejarErrores); // siempre el último

app.listen(PUERTO, () => {
  console.log(`Servidor de contactos en http://localhost:${PUERTO}`);
});
