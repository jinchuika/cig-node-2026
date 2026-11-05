// mi-servidor.js
// Servidor de contactos con Express.
// Ejecute: npm run mio

import express from 'express';
import { contactos } from './contactos.js';

const PUERTO = 3000;
const app = express();
app.use(express.json());

// GET /contactos: la lista completa
app.get('/contactos', (req, res) => {
    const { nombre } = req.query;
    if (nombre) {
        const filtrados = contactos.filter((contacto) => {
            return contacto.nombre.toLowerCase().includes(nombre.toLowerCase());
        });
        return res.json(filtrados);
    }
    res.json(contactos);
});

app.get('/contactos/:id', (req, res) => {
    const id = Number(req.params.id);
    const contacto = contactos.find((c) => c.id === id);
    if (!contacto) {
        return res.status(404).json({ error: 'No se encuentra el contacto' });
    }
    return res.json(contacto);
});

// POST /contactos: crea un contacto con los datos del cuerpo
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
