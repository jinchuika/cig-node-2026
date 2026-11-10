// middlewares.js
// Cuatro middlewares propios. Todos reciben (req, res, next):
//   - llaman a next() para que la petición siga al siguiente, o
//   - responden (res.json, res.sendStatus) y la cadena se corta ahí.

// 1. Log: anota cada petición que llega
export function registrarPeticion(req, res, next) {
  const inicio = new Date().toISOString();
  console.log(`[log ${inicio}] ${req.method} ${req.originalUrl}`);
  next(); // sin esta línea la petición se queda esperando para siempre
}

// 2. Tiempo: mide cuánto tarda la respuesta
export function medirTiempo(req, res, next) {
  const inicio = performance.now();

  // 'finish' ocurre cuando la respuesta ya salió.
  // Por eso este mensaje se imprime al final, aunque el middleware corre al inicio.
  res.on('finish', () => {
    const ms = (performance.now() - inicio).toFixed(1);
    console.log(`[tiempo] ${req.method} ${req.originalUrl} respondió ${res.statusCode} en ${ms} ms`);
  });

  next();
}

// 3. Llave: deja pasar solo si el header x-llave coincide con LLAVE del .env
export function exigirLlave(req, res, next) {
  const llave = req.get('x-llave'); // lee un header de la petición

  if (llave !== process.env.LLAVE) {
    console.log('[llave] rechazada');
    return res.status(401).json({ error: 'Falta la llave o no es válida' }); // corta la cadena
  }

  console.log('[llave] aceptada');
  next();
}

// 4. CORS: autoriza al navegador a llamar a esta API desde otro origen
const ORIGEN_PERMITIDO = 'http://localhost:5173'; // el frontend de Serviclima

export function permitirOrigen(req, res, next) {
  res.set('Access-Control-Allow-Origin', ORIGEN_PERMITIDO);
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.set('Access-Control-Allow-Headers', 'Content-Type, x-llave');

  // OPTIONS es la pregunta previa del navegador (preflight): se contesta aquí
  // con 204 (sin cuerpo) y no sigue a las rutas.
  if (req.method === 'OPTIONS') {
    console.log('[cors] preflight respondido');
    return res.sendStatus(204);
  }

  next();
}
