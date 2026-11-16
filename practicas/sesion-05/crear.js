// crear.js
// Crea la tabla contactos e inserta los 4 contactos de la agenda.
// Ejecute: node crear.js
// Ejecútelo dos veces: la segunda no duplica nada.

import { db } from './db.js';

// exec: corre SQL que no recibe datos de nadie
// IF NOT EXISTS: si la tabla ya existe, no hace nada
db.exec(`
    CREATE TABLE IF NOT EXISTS contactos (
        id       INTEGER PRIMARY KEY,
        nombre   TEXT NOT NULL,
        telefono TEXT NOT NULL,
        correo   TEXT NOT NULL
    )
`);
console.log('Tabla contactos lista');

// get: devuelve UNA fila (o undefined)
const { total } = db.prepare('SELECT COUNT(*) AS total FROM contactos').get();

if (total > 0) {
    console.log(`La tabla ya tiene ${total} contactos: no se inserta nada`);
} else {
    const contactos = [
        { nombre: 'Ana López', telefono: '55123456', correo: 'ana.lopez@correo.com' },
        { nombre: 'Carlos Pérez', telefono: '44987654', correo: 'carlos.perez@correo.com' },
        { nombre: 'María Ajú', telefono: '33456789', correo: 'maria.aju@correo.com' },
        { nombre: 'Jorge Castillo', telefono: '52345678', correo: 'jorge.castillo@correo.com' },
    ];

    // prepare: la consulta se prepara UNA vez, con ? donde van los datos
    const insertar = db.prepare('INSERT INTO contactos (nombre, telefono, correo) VALUES (?, ?, ?)');

    for (const contacto of contactos) {
        // run: ejecuta y devuelve { changes, lastInsertRowid }
        const resultado = insertar.run(contacto.nombre, contacto.telefono, contacto.correo);
        console.log(`Insertado ${contacto.nombre} con id ${resultado.lastInsertRowid}`);
    }
}

// all: devuelve TODAS las filas en un arreglo de objetos
console.table(db.prepare('SELECT * FROM contactos').all());
