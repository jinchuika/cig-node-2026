// servidor-http.js
// Servidor de contactos con node:http puro, sin framework.
// Ejecute: npm run http
// Sirve para comparar: cada cosa que aquí se hace a mano, Express la resuelve sola.

import http from 'node:http';
import { contactos } from './contactos.js';

const PUERTO = 3000;

// Responder JSON a mano: código de estado, header y cuerpo convertido a texto
function enviarJSON(res, estado, datos) {
  res.writeHead(estado, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(datos));
}

// Leer el cuerpo a mano: llega en pedazos (chunks) y hay que juntarlos
async function leerCuerpo(req) {
  let texto = '';
  for await (const pedazo of req) {
    texto += pedazo;
  }
  return texto ? JSON.parse(texto) : {};
}

const servidor = http.createServer(async (req, res) => {
  // req.url trae ruta y query juntas ("/contactos?nombre=ana"): hay que separarlas
  const url = new URL(req.url, `http://localhost:${PUERTO}`);
  const partes = url.pathname.split('/').filter(Boolean); // "/contactos/2" => ["contactos", "2"]

  console.log(req.method, req.url);

  // GET /contactos y GET /contactos?nombre=...
  if (req.method === 'GET' && url.pathname === '/contactos') {
    const nombre = url.searchParams.get('nombre');
    if (nombre) {
      const filtrados = contactos.filter((contacto) =>
        contacto.nombre.toLowerCase().includes(nombre.toLowerCase())
      );
      return enviarJSON(res, 200, filtrados);
    }
    return enviarJSON(res, 200, contactos);
  }

  // GET /contactos/:id  (el id hay que sacarlo de la ruta a mano)
  if (req.method === 'GET' && partes[0] === 'contactos' && partes.length === 2) {
    const id = Number(partes[1]);
    const contacto = contactos.find((c) => c.id === id);
    if (!contacto) {
      return enviarJSON(res, 404, { error: 'Contacto no encontrado' });
    }
    return enviarJSON(res, 200, contacto);
  }

  // POST /contactos
  if (req.method === 'POST' && url.pathname === '/contactos') {
    let datos;
    try {
      datos = await leerCuerpo(req);
    } catch {
      return enviarJSON(res, 400, { error: 'El cuerpo no es JSON válido' });
    }
    if (!datos.nombre) {
      return enviarJSON(res, 400, { error: 'El nombre es obligatorio' });
    }
    const nuevo = { id: Math.max(0, ...contactos.map((c) => c.id)) + 1, ...datos };
    contactos.push(nuevo);
    return enviarJSON(res, 201, nuevo);
  }

  // Ninguna ruta coincidió
  enviarJSON(res, 404, { error: 'Ruta no encontrada' });
});

servidor.listen(PUERTO, () => {
  console.log(`Servidor node:http en http://localhost:${PUERTO}`);
});
