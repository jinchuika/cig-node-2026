// db.js
// Abre (o crea) el archivo agenda.db en esta carpeta.
// Los otros scripts importan db desde aquí: una sola conexión.
// node:sqlite viene con Node: no hay nada que instalar con npm.

import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';

// import.meta.dirname es la carpeta de este archivo
const rutaDb = path.join(import.meta.dirname, 'agenda.db');

// Si agenda.db no existe, SQLite lo crea vacío
export const db = new DatabaseSync(rutaDb);
