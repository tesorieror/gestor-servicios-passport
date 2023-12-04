class Asignacion extends Identificable {
  _usuario;
  _servicio;
  _fecha;
  constructor(_id, usuario, servicio) {
    super(_id);
    this._usuario = usuario;
    this._servicio = servicio;
    this._fecha = new Date().toISOString();
  }
  get usuario() { return this._usuario }
  set usuario(usuario) { this._usuario = usuario }
  get servicio() { return this._servicio }
  set servicio(servicio) { this._servicio = servicio }
  get fecha() { return this._fecha };
  set fecha(fecha) { throw new Error('No puedo modificar la fecha') }
}
