describe("gestor servicios proxy", function () {

	const USUARIOS = [
		{ nombre: 'Usuario 1' },
		{ nombre: 'Usuario 2' },
		{ nombre: 'Usuario 3' }]
	const SERVICIOS = [
		{ nombre: 'Servicio 1' },
		{ nombre: 'Servicio 2' },
		{ nombre: 'Servicio 3' }]

	let usuarios, servicios, asignaciones;

	let proxy;

	beforeEach(async function () {
		proxy = new GestorServiciosProxy('http://localhost:3000/gestor-servicios/api');
		// Usuarios
		usuarios = USUARIOS.map(u => {
			let usuario = new Usuario();
			Object.assign(usuario, u);
			return usuario;
		})
		usuarios = await proxy.setUsuarios(usuarios);
		assert.equal(usuarios.length, USUARIOS.length)
		USUARIOS.forEach((u, iu) => {
			assert.exists(usuarios[iu]._id);
			assert.equal(usuarios[iu].nombre, u.nombre);
		})
		// Servicios
		servicios = SERVICIOS.map(u => {
			let servicio = new Servicio();
			Object.assign(servicio, u);
			return servicio;
		})
		servicios = await proxy.setServicios(servicios);
		assert.equal(servicios.length, SERVICIOS.length)
		SERVICIOS.forEach((u, iu) => {
			assert.exists(servicios[iu]._id);
			assert.equal(servicios[iu].nombre, u.nombre);
		})
		// Asignaciones
		asignaciones = [];
		usuarios.forEach(u =>
			servicios.forEach(s => {
				let asignacion = new Asignacion();
				asignacion.usuario = u;
				asignacion.servicio = s;
				asignaciones.push(asignacion);
			}))
		asignaciones = await proxy.setAsignaciones(asignaciones);
		assert.equal(asignaciones.length, usuarios.length * servicios.length)

		usuarios.forEach((u, iu) =>
			servicios.forEach((s, is) => {
				let asignacion = asignaciones[iu * usuarios.length + is];
				assert.exists(asignacion._id);
				assert.exists(asignacion.fecha);
				assert.deepEqual(asignacion.usuario, u);
				assert.deepEqual(asignacion.servicio, s);
			}));

	});

	// Usuario

	it("getter usuarios", async function () {
		let resultado = await proxy.getUsuarios();
		assert.deepEqual(resultado, usuarios);
	});

	it("setter usuarios", async function () {
		const USUARIOS2 = [
			{ nombre: 'Usuario A' },
			{ nombre: 'Usuario B' },
			{ nombre: 'Usuario C' }];

		usuarios = USUARIOS2.map(u => {
			let usuario = new Usuario();
			Object.assign(usuario, u);
			return usuario;
		})
		usuarios = await proxy.setUsuarios(usuarios);
		assert.equal(usuarios.length, USUARIOS2.length);
		USUARIOS2.forEach((u, iu) => {
			assert.exists(usuarios[iu]._id);
			assert.equal(usuarios[iu].nombre, u.nombre);
		})
	});


	it("agregar usuario", async function () {
		let USUARIO = { nombre: 'Usuario 4' };
		let usuario = await proxy.agregarUsuario(USUARIO.nombre);
		assert.exists(usuario._id)
		usuario = await proxy.usuarioById(usuario._id);
		assert.exists(usuario._id)
		assert.equal(usuario.nombre, USUARIO.nombre);
		usuarios = await proxy.getUsuarios();
		assert.equal(usuarios.length, USUARIOS.length + 1);
	});

	it("agregar usuario", async function () {
		let USUARIO = { nombre: 'Usuario 4' };
		let usuario = await proxy.agregarUsuario(USUARIO.nombre);
		assert.exists(usuario._id)
		usuario = await proxy.usuarioById(usuario._id);
		assert.exists(usuario._id)
		assert.equal(usuario.nombre, USUARIO.nombre);
		usuarios = await proxy.getUsuarios();
		assert.equal(usuarios.length, USUARIOS.length + 1);
	});


	it("usuarioById", async function () {
		usuarios.forEach(async (u) => {
			let usuario = await proxy.usuarioById(u._id);
			assert.deepEqual(u, usuario);
		});
	});


	it("asignacionesByUsuario", async function () {
		let usuario = usuarios[1];
		let asignacionesUsuario = await proxy.asignacionesByUsuario(usuario._id);
		console.log('AU', asignacionesUsuario)
		console.log('AS', [asignaciones[3], asignaciones[4], asignaciones[5]])
		assert.deepEqual(asignacionesUsuario, [asignaciones[3], asignaciones[4], asignaciones[5]])
	});


	it("eliminar usuario", async function () {
		let usuario = usuarios[1];

		let error = false;
		try { await proxy.eliminarUsuarioById(usuario._id); }
		catch (e) { error = e; }
		assert.isTrue(!!error, `Debe haber una excepción`);

		let asignacionesUsuario = await proxy.asignacionesByUsuario(usuario._id);
		asignacionesUsuario.forEach(async a => { await proxy.eliminarAsignacionById(a._id); })

		await proxy.eliminarUsuarioById(usuario._id);

		let usuarios2 = await proxy.getUsuarios();
		assert.equal(usuarios2.length, 2);
		assert.deepEqual(usuarios2, [usuarios[0], usuarios[2]]);
	});

	it("serviciosByUsuario", async function () {
		let usuario = usuarios[1];
		let serviciosUsuario = await proxy.serviciosByUsuario(usuario._id);
		assert.deepEqual(serviciosUsuario, servicios)
	});

	// Servicios

	it("getter servicios", async function () {
		let resultado = await proxy.getServicios();
		assert.deepEqual(resultado, servicios);
	});

	it("setter servicios", async function () {
		const SERVICIOS2 = [
			{ nombre: 'Servicio A' },
			{ nombre: 'Servicio B' },
			{ nombre: 'Servicio C' }];

		servicios = SERVICIOS2.map(u => {
			let servicio = new Servicio();
			Object.assign(servicio, u);
			return servicio;
		})
		servicios = await proxy.setServicios(servicios);
		assert.equal(servicios.length, SERVICIOS2.length);
		SERVICIOS2.forEach((u, iu) => {
			assert.exists(servicios[iu]._id);
			assert.equal(servicios[iu].nombre, u.nombre);
		})
	});


	it("agregar servicio", async function () {
		let SERVICIO = { nombre: 'Servicio 4' };
		let servicio = await proxy.agregarServicio(SERVICIO.nombre);
		assert.exists(servicio._id)
		servicio = await proxy.servicioById(servicio._id);
		assert.exists(servicio._id)
		assert.equal(servicio.nombre, SERVICIO.nombre);
		servicios = await proxy.getServicios();
		assert.equal(servicios.length, SERVICIOS.length + 1);
	});

	it("agregar servicio", async function () {
		let SERVICIO = { nombre: 'Servicio 4' };
		let servicio = await proxy.agregarServicio(SERVICIO.nombre);
		assert.exists(servicio._id)
		servicio = await proxy.servicioById(servicio._id);
		assert.exists(servicio._id)
		assert.equal(servicio.nombre, SERVICIO.nombre);
		servicios = await proxy.getServicios();
		assert.equal(servicios.length, SERVICIOS.length + 1);
	});


	it("servicioById", async function () {
		servicios.forEach(async (u) => {
			let servicio = await proxy.servicioById(u._id);
			assert.deepEqual(u, servicio);
		});
	});


	it("asignacionesByServicio", async function () {
		let servicio = servicios[1];
		let asignacionesServicio = await proxy.asignacionesByServicio(servicio._id);
		assert.deepEqual(asignacionesServicio, [asignaciones[1], asignaciones[4], asignaciones[7]])
	});


	it("eliminar servicio", async function () {
		let servicio = servicios[1];

		let error = false;
		try { await proxy.eliminarServicioById(servicio._id); }
		catch (e) { error = e; }
		assert.isTrue(!!error, `Debe haber una excepción`);

		let asignacionesServicio = await proxy.asignacionesByServicio(servicio._id);
		asignacionesServicio.forEach(async a => { await proxy.eliminarAsignacionById(a._id); })

		await proxy.eliminarServicioById(servicio._id);

		let servicios2 = await proxy.getServicios();
		assert.equal(servicios2.length, 2);
		assert.deepEqual(servicios2, [servicios[0], servicios[2]]);
	});

	it("usuariosByServicio", async function () {
		let servicio = servicios[1];
		let usuariosServicio = await proxy.usuariosByServicio(servicio._id);
		assert.deepEqual(usuariosServicio, usuarios)
	});


	// Asignaciones

	it("getter asignaciones", async function () {
		let resultado = await proxy.getAsignaciones();
		assert.deepEqual(resultado, asignaciones);
	});

	it("setter asignaciones", async function () {
		asignaciones2 = [];
		servicios.forEach(s =>
			usuarios.forEach(u => {
				let asignacion = new Asignacion();
				asignacion.usuario = u;
				asignacion.servicio = s;
				asignaciones2.push(asignacion);
			}))
		asignaciones = await proxy.setAsignaciones(asignaciones2);

		assert.equal(asignaciones.length, usuarios.length * servicios.length)

		servicios.forEach((s, iu) =>
			usuarios.forEach((u, is) => {
				let asignacion = asignaciones[iu * usuarios.length + is];
				assert.exists(asignacion._id);
				assert.exists(asignacion.fecha);
				assert.deepEqual(asignacion.usuario, u);
				assert.deepEqual(asignacion.servicio, s);
			}));
	});


	it("asignar", async function () {
		let usuario = await proxy.agregarUsuario('Usuario 4');
		let servicio = await proxy.agregarServicio('Servicio 4');
		asignacion = await proxy.asignar(usuario._id, servicio._id);
		assert.exists(asignacion._id)
		asignacion = await proxy.asignacionById(asignacion._id);
		assert.exists(asignacion._id)
		assert.exists(asignacion.fecha)
		assert.deepEqual(asignacion.usuario, usuario);
		assert.deepEqual(asignacion.servicio, servicio);
		let asignaciones2 = await proxy.getAsignaciones();
		assert.equal(asignaciones2.length, asignaciones.length + 1);
	});

	it("asignacionById", async function () {
		asignaciones.forEach(async (a) => {
			let asignacion = await proxy.asignacionById(a._id);
			assert.deepEqual(a, asignacion);
		});
	});


	it("eliminar asignacion", async function () {
		let asignacion = asignaciones[0];
		let asignacion2 = await proxy.eliminarAsignacionById(asignacion._id);
		assert.deepEqual(asignacion2, asignacion);
		let asignaciones2 = await proxy.getAsignaciones();
		assert.equal(asignaciones2.length, asignaciones.length - 1);
	});



});