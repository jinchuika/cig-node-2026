// orden.js
// Práctica: predecir en qué orden se imprimen los mensajes.
// Antes de ejecutar, escriba el orden en que cree que aparecerán A, B, C, D y E.
// Ejecute dentro de esta carpeta: node orden.js

import { readFile } from 'node:fs/promises';

// Código síncrono: se ejecuta de inmediato, línea por línea
console.log('A. Inicio del programa');

// Temporizador de 0 ms: Node lo agenda para una vuelta posterior del event loop
setTimeout(() => {
  console.log('B. setTimeout de 0 ms');
}, 0);

// Lectura de archivo: Node se la delega al sistema operativo y sigue con la siguiente línea
readFile('productos.json', 'utf8').then(() => {
  console.log('C. Terminó la lectura de productos.json');
});

// Promesa ya resuelta: su .then() corre apenas termina todo el código síncrono
Promise.resolve().then(() => {
  console.log('D. Promesa resuelta');
});

// Espera síncrona de 20 ms: garantiza que el temporizador ya venció cuando arranca el event loop,
// así B siempre sale antes que C y el orden es el mismo en todas las computadoras
const inicio = Date.now();
while (Date.now() - inicio < 20) {}

// Código síncrono otra vez
console.log('E. Fin del programa');

// Para experimentar:
// 1. Cambie el 0 del setTimeout por 100 y vuelva a ejecutar. ¿Cambia el orden de B y C?
// 2. Cambie los 20 ms de la espera síncrona por 3000 y vuelva a ejecutar.
//    ¿Qué mensajes tienen que esperar a que termine el ciclo?
