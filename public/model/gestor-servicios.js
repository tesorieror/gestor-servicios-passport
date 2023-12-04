// const Usuario = require('./usuario');
// const Servicio = require('./servicio');
// const Asignacion = require('./asignacion');

class GestorServicios {
	_lastId;
	_usuarios;
	_servicios;
	_asignaciones;

	constructor() {
		this._lastId = 0;
		this._usuarios = [];
		this._servicios = [];
		this._asignaciones = [];
	}

	genId() { return ++this._lastId; }

	get usuarios() { return this._usuarios; }
	get servicios() { return this._servicios; }
	get asignaciones() { return this._asignaciones; }

	set usuarios(usuarios) { this._usuarios = usuarios; }
	set servicios(servicios) { this._servicios = servicios; }
	set asignaciones(asignaciones) { this._asignaciones = asignaciones; }
	agregarUsuario(nombre) {
		let usuario = new Usuario(this.genId(), nombre);
		this.usuarios.push(usuario);
		return usuario;
	}
	agregarServicio(nombre) {
		let servicio = new Servicio(this.genId(), nombre);
		this.servicios.push(servicio);
		return servicio;
	}
	asignar(uId, sId) {
		let servicio = this.servicioById(sId);
		let usuario = this.usuarioById(uId);
		let asignacion = new Asignacion(this.genId(), usuario, servicio);
		this.asignaciones.push(asignacion);
		return asignacion;
	}
	usuarioById(uid) {
		return this.usuarios.find((u) => u._id == uid);
	}
	servicioById(sid) {
		return this.servicios.find((s) => s._id == sid);
	}
	asignacionById(aid) {
		return this.asignaciones.find((a) => a._id == aid);
	}
	asignacionesByServicio(sid) {
		return this.asignaciones.filter((a) => a.servicio._id == sid)
	}
	asignacionesByUsuario(uid) {
		return this.asignaciones.filter((a) => a.usuario._id == uid)
	}
	usuariosByServicio(sid) {
		return this.asignacionesByServicio(sid).map((a) => a.usuario);
	}
	serviciosByUsuario(uid) {
		return this.asignacionesByUsuario(uid).map((a) => a.servicio);
	}

	// Nuevas
	eliminarUsuarioById(id) {
		let asignaciones = this.asignacionesByUsuario(id);
		if (asignaciones.length > 0) throw new Error(`El usuario ${id} tiene asignaciones ${asignaciones.length}`);
		this.usuarios = this.usuarios.filter(u => u._id != id)
	}

	eliminarServicioById(id) {
		let asignaciones = this.asignacionesByServicio(id);
		if (asignaciones.length > 0) throw new Error(`El servicio ${id} tiene asignaciones ${asignaciones.length}`);
		this.servicios = this.servicios.filter(s => s._id != id)
	}

	eliminarAsignacionById(id) {
		this.asignaciones = this.asignaciones.filter(a => a._id != id)
	}

}
// module.exports = GestorServicios;