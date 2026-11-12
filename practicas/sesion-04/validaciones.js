// validaciones.js
// El esquema es un objeto de reglas: una función por campo.
// Cada regla recibe el valor y devuelve un mensaje si está mal, o null si está bien.

const reglas = {
  nombre: (valor) => {
    if (typeof valor !== 'string' || valor.trim() === '') return 'El nombre es obligatorio';
    return null;
  },
  telefono: (valor) => {
    // ^ y $ obligan a que TODO el texto sean exactamente 8 dígitos
    if (typeof valor !== 'string' || !/^\d{8}$/.test(valor)) return 'Debe tener 8 dígitos';
    return null;
  },
  correo: (valor) => {
    if (typeof valor !== 'string' || !/^[^\s@]+@serviclima\.com$/.test(valor)) {
      return 'Correo no válido. Debe ser un correo válido y tener el dominio @serviclima.com';
    }
    return null;
  },
};

// Revisa todos los campos del esquema y devuelve:
//   limpios:  solo los campos conocidos (lo demás se ignora)
//   detalles: un { campo, mensaje } por cada campo inválido
export function validarContacto(datos) {
  const limpios = {};
  const detalles = [];

  for (const campo in reglas) {
    const mensaje = reglas[campo](datos[campo]);
    if (mensaje) {
      detalles.push({ campo, mensaje });
    } else {
      limpios[campo] = datos[campo];
    }
  }

  return { limpios, detalles };
}
