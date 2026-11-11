// rutas-pruebas.js
// Dos rutas que fallan a propósito para ver al manejador central en acción.

import { Router } from 'express';
import { readFile } from 'node:fs/promises';

const router = Router();

// GET /pruebas/error: un error que no es ErrorHttp termina en 500
router.get('/error', (req, res) => {
  throw new Error('Falla a propósito');
});

// GET /pruebas/async: readFile falla porque respaldo.json no existe.
// Express 5 atrapa el rechazo de la función async y lo manda al manejador,
// sin try/catch. (En Express 4 la petición se quedaba colgada.)
router.get('/async', async (req, res) => {
  const texto = await readFile('respaldo.json', 'utf8');
  res.json(JSON.parse(texto));
});

export default router;
