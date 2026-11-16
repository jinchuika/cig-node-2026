// inyeccion.js
// La misma búsqueda escrita dos veces: armando el texto del SQL y con parámetros.
// Antes ejecute: node crear.js
// Ejecute: node inyeccion.js

import { db } from './db.js';

// MAL: el dato del usuario se pega dentro del texto del SQL
function buscarInseguro(nombre) {
    const sql = `SELECT * FROM contactos WHERE nombre = '${nombre}'`;
    console.log('  SQL que se ejecuta:', sql);
    return db.prepare(sql).all();
}

// BIEN: el SQL es fijo y el dato viaja aparte, en el ?
// SQLite nunca lo interpreta como código, solo como un valor
function buscarSeguro(nombre) {
    console.log('  SQL que se ejecuta: SELECT * FROM contactos WHERE nombre = ?');
    return db.prepare('SELECT * FROM contactos WHERE nombre = ?').all(nombre);
}

const normal = 'Ana López';
// Lo que escribiría alguien en el buscador para ver toda la agenda
const malicioso = "x' OR '1'='1";

console.log(`\n1. Inseguro con "${normal}"`);
console.log('  Filas:', buscarInseguro(normal).length);

console.log(`\n2. Inseguro con "${malicioso}"`);
console.log('  Filas:', buscarInseguro(malicioso).length);

console.log(`\n3. Seguro con "${normal}"`);
console.log('  Filas:', buscarSeguro(normal).length);

console.log(`\n4. Seguro con "${malicioso}"`);
console.log('  Filas:', buscarSeguro(malicioso).length);
