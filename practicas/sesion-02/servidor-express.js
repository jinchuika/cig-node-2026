// servidor-express.js
// El mismo servidor de contactos, ahora con Express.
// Ejecute: npm run express
// Versión de referencia: es lo que cada participante escribe en mi-servidor.js.

import express from 'express';
import { contactos } from './contactos.js';

const PUERTO = 3000;
const app = express();

// Convierte el cuerpo JSON de cada petición en req.body.
// Sin esta línea, req.body es undefined.
app.use(express.json());

// GET /contactos  y  GET /contactos?nombre=ana
app.get('/contactos', (req, res) => {
  const { nombre } = req.query; // query: lo que va después del "?"
  if (nombre) {
    const filtrados = contactos.filter((contacto) =>
      contacto.nombre.toLowerCase().includes(nombre.toLowerCase())
    );
    return res.json(filtrados);
  }
  res.json(contactos); // res.json pone el header y convierte a texto: 200 por defecto
});

// GET /contactos/2
app.get('/contactos/:id', (req, res) => {
  const id = Number(req.params.id); // params siempre llega como texto: "2", no 2
  const contacto = contactos.find((c) => c.id === id);
  if (!contacto) {
    return res.status(404).json({ error: 'Contacto no encontrado' });
  }
  res.json(contacto);
});

// POST /contactos
app.post('/contactos', (req, res) => {
  const { nombre, telefono, correo } = req.body;
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }
  const nuevo = {
    id: Math.max(0, ...contactos.map((c) => c.id)) + 1, // el siguiente id disponible
    nombre,
    telefono,
    correo,
  };
  contactos.push(nuevo);
  res.status(201).json(nuevo); // 201: se creó un recurso nuevo
});

app.listen(PUERTO, () => {
  console.log(`Servidor Express en http://localhost:${PUERTO}`);
});
