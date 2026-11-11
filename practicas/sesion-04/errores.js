// errores.js
// Un error que además del mensaje sabe con qué código HTTP se responde.
// Uso: throw new ErrorHttp(404, 'Contacto no encontrado');

export class ErrorHttp extends Error {
  constructor(estado, mensaje, detalles = []) {
    super(mensaje);          // Error guarda el mensaje en this.message
    this.estado = estado;    // código HTTP: 400, 404, ...
    this.detalles = detalles; // lista de { campo, mensaje }; vacía si no aplica
  }
}
