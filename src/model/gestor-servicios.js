const Usuario = require('./usuario');
const Servicio = require('./servicio');
const Asignacion = require('./asignacion');

const bcrypt = require('bcrypt');
const User = require('./user');

class GestorServicios {

	constructor() {

	}


	async getUsuarios() { return (await Usuario.find()).map(d => d.toObject()); }
	async getServicios() { return (await Servicio.find()).map(d => d.toObject()); }
	// async getAsignaciones() { return (await Asignacion.find().populate(['usuario','servicio'])).map(d => d.toObject()); }
	async getAsignaciones() { return (await Asignacion.find()).map(d => d.toObject()); }

	async setUsuarios(usuarios) {
		await Usuario.deleteMany();
		return (await Promise.all(usuarios.map(async u => { return new Usuario(u).save(); }))).map(d => d.toObject());
	}
	async setServicios(servicios) {
		await Servicio.deleteMany();
		return (await Promise.all(servicios.map(s => { return new Servicio(s).save(); }))).map(d => d.toObject());
	}
	async setAsignaciones(asignaciones) {
		await Asignacion.deleteMany();
		return (await Promise.all(asignaciones.map(a => { return new Asignacion(a).save(); }))).map(d => d.toObject());
	}

	async agregarUsuario(nombre) { return (await new Usuario({ nombre }).save()).toObject(); }

	async agregarServicio(nombre) { return (await new Servicio({ nombre }).save()).toObject(); }


	async setUsuario(u) {
		let uid = u._id;
		let usuario = await Usuario.findById(u._id);
		if (!usuario)
			res.status(404).json({ message: `Usuario con id ${uid} no encontrado` });
		else {
			usuario.nombre = u.nombre;
			return (await usuario.save()).toObject();
		}
	}

	async setServicio(s) {
		let sid = s._id;
		let servicio = await Servicio.findById(s._id);
		if (!servicio)
			throw new Error(`Servicio con id ${sid} no encontrado`);
		else {
			servicio.nombre = s.nombre;
			return (await servicio.save()).toObject();
		}
	}

	async setAsignacion(a) {
		let aid = a._id;
		let asignacion = await Asignacion.findById(a._id);
		if (!asignacion)
			throw new Error(`Asignación con id ${aid} no encontrado`);
		else {
			// console.log('A1', asignacion);
			asignacion.fecha = a.fecha;
			asignacion.servicio = a.servicio;
			asignacion.usuario = a.usuario;
			// console.log('A', a);
			asignacion = (await asignacion.save());
			// console.log('A2', asignacion);
			return asignacion.toObject();
		}
	}



	async asignar(uId, sId) {
		let a = await new Asignacion({ usuario: uId, servicio: sId }).save();
		return await this.asignacionById(a._id);
		// let servicio = await this.servicioById(sId);
		// let usuario = await this.usuarioById(uId);
		// this.asignaciones.push(asignacion);
		// return asignacion;
	}

	async usuarioById(uid) {
		return (await Usuario.findById(uid)).toObject();
		// return this.usuarios.find((u) => u._id == uid);
	}
	async servicioById(sid) {
		return (await Servicio.findById(sid)).toObject();
		// return this.servicios.find((s) => s._id == sid);
	}
	async asignacionById(aid) {
		return (await Asignacion.findById(aid).populate(['usuario', 'servicio']).exec()).toObject();
		// return this.asignaciones.find((a) => a._id == aid);
	}
	async asignacionesByServicio(sid) {
		// return this.asignaciones.filter((a) => a.servicio._id == sid)
		return (await Asignacion.find({ servicio: sid }).populate(['usuario', 'servicio']).exec()).map(d => d.toObject());
	}
	async asignacionesByUsuario(uid) {
		// return this.asignaciones.filter((a) => a.usuario._id == uid)
		return (await Asignacion.find({ usuario: uid }).populate(['usuario', 'servicio']).exec()).map(d => d.toObject());
	}
	async usuariosByServicio(sid) {
		// return this.asignacionesByServicio(sid).map((a) => a.usuario);
		return (await Asignacion.find({ servicio: sid }).populate('usuario').exec()).map(a => a.usuario.toObject());
	}
	async serviciosByUsuario(uid) {
		// return this.asignacionesByUsuario(uid).map((a) => a.servicio);
		return (await Asignacion.find({ usuario: uid }).populate('servicio').exec()).map(a => a.servicio.toObject());
	}

	// Nuevas
	async eliminarUsuarioById(id) {
		// let asignaciones = this.asignacionesByUsuario(id);
		let asignaciones = await this.asignacionesByUsuario(id);
		if (asignaciones.length > 0) throw new Error(`El usuario ${id} tiene ${asignaciones.length} asignaciones`);
		// this.usuarios = this.usuarios.filter(u => u._id != id)
		let resultado = await this.usuarioById(id);
		if (!resultado) throw new Error(`Usuario con id: ${id} no encontrado `);
		await Usuario.findByIdAndDelete(id);
		return resultado;
	}

	async eliminarServicioById(id) {
		// let asignaciones = this.asignacionesByServicio(id);
		let asignaciones = await this.asignacionesByServicio(id);
		if (asignaciones.length > 0) throw new Error(`El servicio ${id} tiene ${asignaciones.length} asignaciones`);
		let resultado = await this.servicioById(id);
		if (!resultado) throw new Error(`Servicio con id:${id} no encontrado`);
		// this.servicios = this.servicios.filter(s => s._id != id)
		await Servicio.findByIdAndDelete(id);
		return resultado;
	}

	async eliminarAsignacionById(id) {
		// this.asignaciones = this.asignaciones.filter(a => a._id != id)
		let resultado = await this.asignacionById(id);
		if (!resultado) throw new Error(`Asignación con id:${id} no encotnrada`);
		await Asignacion.findByIdAndDelete(id);
		return resultado;
	}

	/**
	 * Autenticación y Autorización
	 */



	async signup(newUser) {
		let user = await User.findOne({ username: newUser.username });
		if (!user) {
			user = new User();
			user.username = newUser.username;
			user.password = await bcrypt.hash(newUser.password, 10);
			return await user.save();
		} else throw new Error(`El usuario ya existe`);
	}

	async signin(user) {

	}

	async cleanUsers(){
		await User.deleteMany();
	}



}
module.exports = GestorServicios;