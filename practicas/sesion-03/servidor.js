// servidor.js
// API de contactos con middlewares propios y un Router.
// Antes de ejecutar: copie .env.example como .env
// Ejecute: npm run dev

import express from 'express';
import rutasContactos from './rutas-contactos.js';
import { registrarPeticion, medirTiempo, permitirOrigen } from './middlewares.js';

const PUERTO = process.env.PUERTO; // viene de .env gracias a --env-file
const app = express();

// Los middlewares corren en el mismo orden en que se registran con app.use
app.use(registrarPeticion); // 1. anota la petición
app.use(medirTiempo);       // 2. empieza a medir
app.use(permitirOrigen);    // 3. CORS; contesta OPTIONS aquí mismo
app.use(express.json());    // 4. convierte el cuerpo JSON en req.body

// Todas las rutas que empiezan con /contactos las atiende el Router
app.use('/contactos', rutasContactos);

app.listen(PUERTO, () => {
  console.log(`Servidor de contactos en http://localhost:${PUERTO}`);
});
