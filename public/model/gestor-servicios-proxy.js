class GestorServiciosProxy {

	_base;

	constructor(base) {
		this._base = base;
	}

	get base() { return this._base; }

	async handleError(response) {		
		let message = 'Error no definido';
		try {
			let error = await response.json();			
			message = error.message;
		} catch (e) {			
			message = response.statusText;
		} finally {			
			console.error(message);
			throw new Error(message);
		}
	}

	async getUsuarios() {
		let response = await fetch(`${this.base}/usuarios`);
		if (response.ok) {
			let usuarios = await response.json();
			usuarios = usuarios.map(u => {
				let usuario = new Usuario();
				Object.assign(usuario, u);
				return usuario;
			});
			return usuarios;
		}
		else await this.handleError(response);
	}

	async setUsuarios(usuarios) {
		console.log(usuarios);
		let response = await fetch(`${this.base}/usuarios`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify(usuarios),
		});
		if (response.ok) {
			let resultado = await response.json();
			resultado = resultado.map(u => {
				let usuario = new Usuario();
				Object.assign(usuario, u);
				return usuario;
			});
			return resultado;
		} else await this.handleError(response);
	}

	async agregarUsuario(nombre) {
		let usuario = new Usuario();
		usuario.nombre = nombre;
		let response = await fetch(`${this.base}/usuarios`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify(usuario),
		})
		if (response.ok) {
			let resultado = await response.json();
			let usuario = new Usuario();
			Object.assign(usuario, resultado);
			return usuario;
		} else await this.handleError(response);
	}

	async usuarioById(id) {
		let response = await fetch(`${this.base}/usuarios/${id}`);
		if (response.ok) {
			let resultado = await response.json();
			let usuario = new Usuario();
			Object.assign(usuario, resultado);
			return usuario;
		}
		else await this.handleError(response);
	}

	async eliminarUsuarioById(id) {				
		let response = await fetch(`${this.base}/usuarios/${id}`, {
			method: 'DELETE'
		});		
		if (response.ok) {
			let resultado = await response.json();
			let usuario = new Usuario();
			Object.assign(usuario, resultado);
			return usuario;
		}
		else {									
			await this.handleError(response);			
		}
	}

	async serviciosByUsuario(id) {
		let response = await fetch(`${this.base}/usuarios/${id}/servicios`);
		if (response.ok) {
			let resultado = await response.json();
			console.log(resultado)
			return resultado.map(s=>{
				let servicio = new Servicio();
				Object.assign(servicio,s);
				return servicio;
			})
		}
		else this.handleError(response);
	}

	// Servicios

	async getServicios() {
		let response = await fetch(`${this.base}/servicios`);
		if (response.ok) {
			let servicios = await response.json();
			servicios = servicios.map(u => {
				let servicio = new Servicio();
				Object.assign(servicio, u);
				return servicio;
			});
			return servicios;
		}
		else this.handleError(response);
	}

	async setServicios(servicios) {
		let response = await fetch(`${this.base}/servicios`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify(servicios),
		});
		if (response.ok) {
			let resultado = await response.json();
			resultado = resultado.map(u => {
				let servicio = new Servicio();
				Object.assign(servicio, u);
				return servicio;
			});
			return resultado;
		} else this.handleError(response);
	}

	async agregarServicio(nombre) {
		let servicio = new Servicio();
		servicio.nombre = nombre;
		let response = await fetch(`${this.base}/servicios`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify(servicio),
		})
		if (response.ok) {
			let resultado = await response.json();
			let servicio = new Servicio();
			Object.assign(servicio, resultado);
			return servicio;
		} else this.handleError(response);
	}

	async servicioById(id) {
		let response = await fetch(`${this.base}/servicios/${id}`);
		if (response.ok) {
			let resultado = await response.json();
			let servicio = new Servicio();
			Object.assign(servicio, resultado);
			return servicio;
		}
		else await this.handleError(response);
	}

	async eliminarServicioById(id) {				
		let response = await fetch(`${this.base}/servicios/${id}`, {
			method: 'DELETE'
		});		
		if (response.ok) {
			let resultado = await response.json();
			let servicio = new Servicio();
			Object.assign(servicio, resultado);
			return servicio;
		}
		else {						
			await this.handleError(response);			
		}
	}

	async usuariosByServicio(id) {
		let response = await fetch(`${this.base}/servicios/${id}/usuarios`);
		if (response.ok) {
			let resultado = await response.json();			
			return resultado.map(u=>{
				let usuario = new Usuario();
				Object.assign(usuario, u);
				return usuario;
			})
		}
		else await this.handleError(response);
	}



	// Asignaciones

	async getAsignaciones() {
		let response = await fetch(`${this.base}/asignaciones`);
		if (response.ok) {
			let asignaciones = await response.json();
			asignaciones = asignaciones.map(u => {
				let asignacion = new Asignacion();
				Object.assign(asignacion, u);
				let usuario = new Usuario();
				Object.assign(usuario, asignacion.usuario);
				asignacion.usuario = usuario;
				let servicio = new Servicio();
				Object.assign(servicio, asignacion.servicio);
				asignacion.servicio = servicio;
				return asignacion;
			});
			return asignaciones;
		}
		else await this.handleError(response);
	}

	async setAsignaciones(asignaciones) {
		let response = await fetch(`${this.base}/asignaciones`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify(asignaciones),
		});
		if (response.ok) {
			let resultado = await response.json();

			resultado = resultado.map(u => {
				let asignacion = new Asignacion();

				Object.assign(asignacion, u);
				let usuario = new Usuario();
				Object.assign(usuario, asignacion.usuario);
				asignacion.usuario = usuario;
				let servicio = new Servicio();
				Object.assign(servicio, asignacion.servicio);
				asignacion.servicio = servicio;
				return asignacion;
			});
			return resultado;
		} else await this.handleError(response);
	}

	async asignar(uid, sid) {
		let response = await fetch(`${this.base}/asignaciones`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({ uid, sid }),
		})
		if (response.ok) {
			let resultado = await response.json();
			let asignacion = new Asignacion();
			Object.assign(asignacion, resultado);
			let usuario = new Usuario();
			Object.assign(usuario, asignacion.usuario);
			asignacion.usuario = usuario;
			let servicio = new Servicio();
			Object.assign(servicio, asignacion.servicio);
			asignacion.servicio = servicio;
			return asignacion;
		} else await this.handleError(response);
	}

	async asignacionById(id) {
		let response = await fetch(`${this.base}/asignaciones/${id}`);
		if (response.ok) {
			let resultado = await response.json();
			let asignacion = new Asignacion();
			Object.assign(asignacion, resultado);
			let usuario = new Usuario();
			Object.assign(usuario, asignacion.usuario);
			asignacion.usuario = usuario;
			let servicio = new Servicio();
			Object.assign(servicio, asignacion.servicio);
			asignacion.servicio = servicio;
			return asignacion;
		}
		else await this.handleError(response);
	}

	async asignacionesByUsuario(id) {
		let response = await fetch(`${this.base}/usuarios/${id}/asignaciones`);
		if (response.ok) {
			let resultado = await response.json();
			resultado = resultado.map(a => {
				let asignacion = new Asignacion();
				Object.assign(asignacion, a);
				let usuario = new Usuario();
				Object.assign(usuario, asignacion.usuario);
				asignacion.usuario = usuario;
				let servicio = new Servicio();
				Object.assign(servicio, asignacion.servicio);
				asignacion.servicio = servicio;
				return asignacion;
			});
			return resultado;
		}
		else await this.handleError(response);
	}

	async asignacionesByServicio(id) {
		let response = await fetch(`${this.base}/servicios/${id}/asignaciones`);
		if (response.ok) {
			let resultado = await response.json();
			resultado = resultado.map(a => {
				let asignacion = new Asignacion();
				Object.assign(asignacion, a);
				let usuario = new Usuario();
				Object.assign(usuario, asignacion.usuario);
				asignacion.usuario = usuario;
				let servicio = new Servicio();
				Object.assign(servicio, asignacion.servicio);
				asignacion.servicio = servicio;
				return asignacion;
			});
			return resultado;
		}
		else await this.handleError(response);
	}

	async eliminarAsignacionById(id) {
		let response = await fetch(`${this.base}/asignaciones/${id}`, {
			method: 'DELETE'
		});
		if (response.ok) {
			let resultado = await response.json();
			let asignacion = new Asignacion();
			Object.assign(asignacion, resultado);
			let usuario = new Usuario();
			Object.assign(usuario, asignacion.usuario);
			asignacion.usuario = usuario;
			let servicio = new Servicio();
			Object.assign(servicio, asignacion.servicio);
			asignacion.servicio = servicio;
			return asignacion;
		}
		else await this.handleError(response);
	}

}