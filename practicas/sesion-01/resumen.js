// resumen.js
// Lee productos.json con fs/promises y calcula los totales del inventario.
// Ejecute: node resumen.js

import { readFile } from 'node:fs/promises';
import path from 'node:path';

// Ruta absoluta al archivo, armada a partir de la carpeta donde está este script.
// Así el programa funciona sin importar desde qué carpeta se ejecute.
const rutaProductos = path.join(import.meta.dirname, 'productos.json');

try {
  // await espera la lectura sin bloquear el event loop
  const contenido = await readFile(rutaProductos, 'utf8');

  // El archivo llega como texto; JSON.parse lo convierte en un arreglo de objetos
  const productos = JSON.parse(contenido);

  // Total de unidades en existencia
  const totalUnidades = productos.reduce((suma, producto) => suma + producto.existencias, 0);

  // Valor del inventario: precio por existencias de cada producto
  const valorInventario = productos.reduce(
    (suma, producto) => suma + producto.precio * producto.existencias,
    0
  );

  // Valor del inventario agrupado por categoría
  const valorPorCategoria = {};
  for (const producto of productos) {
    const valor = producto.precio * producto.existencias;
    valorPorCategoria[producto.categoria] = (valorPorCategoria[producto.categoria] ?? 0) + valor;
  }

  // Productos con menos de 10 unidades
  const porAgotarse = productos.filter((producto) => producto.existencias < 10);

  console.log(`Archivo leído: ${path.basename(rutaProductos)}`);
  console.log(`Productos: ${productos.length}`);
  console.log(`Unidades en existencia: ${totalUnidades}`);
  console.log(`Valor del inventario: Q${valorInventario.toFixed(2)}`);

  console.log('\nValor por categoría:');
  for (const [categoria, valor] of Object.entries(valorPorCategoria)) {
    console.log(`  ${categoria}: Q${valor.toFixed(2)}`);
  }

  console.log('\nProductos con menos de 10 unidades:');
  for (const producto of porAgotarse) {
    console.log(`  ${producto.nombre} (${producto.existencias})`);
  }
} catch (error) {
  // Se llega aquí si el archivo no existe o si su contenido no es JSON válido
  console.error(`No se pudo generar el resumen: ${error.message}`);
}

// Para experimentar:
// 1. Agregue un producto a productos.json y vuelva a ejecutar.
// 2. Cambie 'productos.json' en rutaProductos por un nombre que no exista. ¿Qué mensaje aparece?
// 3. Borre una coma de productos.json. ¿Qué mensaje aparece ahora?
