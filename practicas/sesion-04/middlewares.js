// middlewares.js
// Middlewares de la práctica. El último, manejarErrores, recibe 4 parámetros:
// así sabe Express que es el manejador de errores.

import { ErrorHttp } from './errores.js';
import { validarContacto } from './validaciones.js';

// 1. Log: método, ruta, código de estado y duración, en una sola línea
export function registrarPeticion(req, res, next) {
  const inicio = performance.now();
  res.on('finish', () => {
    const ms = (performance.now() - inicio).toFixed(1);
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms} ms`);
  });
  next();
}

// 2. Validación: si el contacto trae errores, lanza un 400 con los detalles.
//    Si está bien, deja en req.body solo los campos conocidos y sigue.
export function exigirContactoValido(req, res, next) {
  // Sin Content-Type: application/json, req.body llega undefined
  const { limpios, detalles } = validarContacto(req.body ?? {});
  if (detalles.length > 0) {
    throw new ErrorHttp(400, 'El contacto tiene datos inválidos', detalles);
  }
  req.body = limpios;
  next();
}

// 3. 404: si una petición llegó hasta aquí, ninguna ruta la atendió
export function noEncontrado(req, res, next) {
  throw new ErrorHttp(404, `No existe la ruta ${req.method} ${req.originalUrl}`);
}

// 4. Manejador central: todos los errores terminan aquí, con el mismo formato
export function manejarErrores(error, req, res, next) {
  // Errores que lanzamos nosotros: ya traen su código
  if (error instanceof ErrorHttp) {
    return res.status(error.estado).json({ error: error.message, detalles: error.detalles });
  }

  // express.json() no pudo leer el cuerpo: JSON mal escrito
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo no es un JSON válido', detalles: [] });
  }

  // Cualquier otro error es un fallo nuestro: se anota completo en la terminal
  // y al cliente solo se le dice que algo falló.
  console.error(error);
  res.status(500).json({ error: 'Error interno del servidor', detalles: [] });
}
