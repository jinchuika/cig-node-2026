// rutas-contactos.js
// Las rutas ya no responden errores a mano: los lanzan y los atiende manejarErrores.

import { Router } from 'express';
import { contactos } from './contactos.js';
import { ErrorHttp } from './errores.js';
import { exigirContactoValido } from './middlewares.js';

const router = Router();

// GET /contactos
router.get('/', (req, res) => {
  res.json(contactos);
});

// GET /contactos/2
router.get('/:id', (req, res) => {
  const contacto = contactos.find((c) => c.id === Number(req.params.id));
  if (!contacto) {
    throw new ErrorHttp(404, `No existe el contacto ${req.params.id}`);
  }
  res.json(contacto);
});

// POST /contactos
// exigirContactoValido corre antes: si llega aquí, req.body ya es válido.
router.post('/', exigirContactoValido, (req, res) => {
  const nuevo = {
    id: Math.max(0, ...contactos.map((c) => c.id)) + 1,
    ...req.body,
  };
  contactos.push(nuevo);
  res.status(201).json(nuevo);
});

export default router;
