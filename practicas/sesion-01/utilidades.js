// utilidades.js
// Funciones reutilizables. Lo que lleva export queda disponible para otros archivos.

// Tasa del IVA en Guatemala
export const TASA_IVA = 0.12;

// Formato de quetzales con separador de miles y dos decimales: 1234.5 queda como Q1,234.50
export function formatearQuetzales(monto) {
  return `Q${monto.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Separa la base y el IVA de un precio que ya incluye IVA
export function desglosarIva(precioConIva) {
  const base = redondear(precioConIva / (1 + TASA_IVA));
  const iva = redondear(precioConIva - base);
  return { base, iva };
}

// Sin export: esta función solo se puede usar dentro de este archivo
function redondear(numero) {
  return Math.round(numero * 100) / 100;
}
