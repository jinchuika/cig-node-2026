// rutas-contactos.js
// Las rutas de /contactos agrupadas en un Router.
// Dentro del Router las rutas no repiten "/contactos": el prefijo lo pone
// servidor.js con app.use('/contactos', rutasContactos).

import { Router } from 'express';
import { contactos } from './contactos.js';
import { exigirLlave } from './middlewares.js';

const router = Router();

// GET /contactos  y  GET /contactos?nombre=ana
router.get('/', (req, res) => {
  const { nombre } = req.query;
  if (nombre) {
    const filtrados = contactos.filter((contacto) =>
      contacto.nombre.toLowerCase().includes(nombre.toLowerCase())
    );
    return res.json(filtrados);
  }
  res.json(contactos);
});

// GET /contactos/2
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const contacto = contactos.find((c) => c.id === id);
  if (!contacto) {
    return res.status(404).json({ error: 'Contacto no encontrado' });
  }
  res.json(contacto);
});

// POST /contactos
// exigirLlave va entre la ruta y la función: solo protege esta ruta.
router.post('/', exigirLlave, (req, res) => {
  const { nombre, telefono, correo } = req.body;
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }
  const nuevo = {
    id: Math.max(0, ...contactos.map((c) => c.id)) + 1,
    nombre,
    telefono,
    correo,
  };
  contactos.push(nuevo);
  res.status(201).json(nuevo);
});

export default router;
