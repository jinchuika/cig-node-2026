// consultar.js
// Las tres formas de ejecutar una consulta preparada: get, all y run.
// Antes ejecute: node crear.js
// Ejecute: node consultar.js

import { db } from './db.js';

// get: una fila. Si no existe, undefined (igual que find en un arreglo)
const buscarPorId = db.prepare('SELECT * FROM contactos WHERE id = ?');
console.log('get: contacto 2');
console.table([buscarPorId.get(2)]);
console.log('get: contacto 99:', buscarPorId.get(99));

// all: varias filas. Si no hay ninguna, un arreglo vacío
// % en LIKE significa "cualquier texto": nombres que terminan en "ez"
const terminanEn = db.prepare('SELECT nombre, telefono FROM contactos WHERE nombre LIKE ? ORDER BY nombre');
console.log('\nall: nombres que terminan en "ez"');
console.table(terminanEn.all('%ez'));
console.log('all: nombres que terminan en "zz":', terminanEn.all('%zz'));

// run: INSERT, UPDATE y DELETE. No devuelve filas sino { changes, lastInsertRowid }
const insertar = db.prepare('INSERT INTO contactos (nombre, telefono, correo) VALUES (?, ?, ?)');
const nuevo = insertar.run('Lucía Morales', '51112233', 'lucia.morales@correo.com');
console.log('\nrun INSERT:', nuevo);

const cambiar = db.prepare('UPDATE contactos SET telefono = ? WHERE id = ?');
console.log('run UPDATE:', cambiar.run('59998877', nuevo.lastInsertRowid));

const borrar = db.prepare('DELETE FROM contactos WHERE id = ?');
console.log('run DELETE:', borrar.run(nuevo.lastInsertRowid));

// changes: 0 significa que la fila no existía. Así se sabe cuándo responder 404
console.log('run DELETE de un id que no existe:', borrar.run(99));
