// principal.js
// Importa funciones de utilidades.js y las usa.
// Ejecute: node principal.js

// En ES Modules la ruta de un archivo propio empieza con ./ y lleva la extensión .js
import { TASA_IVA, formatearQuetzales, desglosarIva } from './utilidades.js';

const precio = 1150;
const { base, iva } = desglosarIva(precio);

console.log(`Precio con IVA: ${formatearQuetzales(precio)}`);
console.log(`Precio sin IVA: ${formatearQuetzales(base)}`);
console.log(`IVA (${TASA_IVA * 100} %): ${formatearQuetzales(iva)}`);

// Para experimentar:
// 1. Agregue redondear a la lista del import. ¿Qué error aparece y por qué?
// 2. Quite la extensión .js del import. ¿Qué error aparece?
// 3. Ejecute npm run dev, cambie el precio y guarde el archivo: el programa se vuelve a ejecutar solo.
