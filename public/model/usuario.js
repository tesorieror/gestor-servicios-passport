  class Usuario extends Identificable {
    _nombre;
    constructor(_id, nombre) {
      super(_id);
      this._nombre = nombre;
    }
    get nombre() { return this._nombre; }
    set nombre(nombre) { this._nombre = nombre; }
  }
