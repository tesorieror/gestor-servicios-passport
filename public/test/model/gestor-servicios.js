// const assert = require("chai").assert;
// const { expect } = require("chai");
// const GestorServicios = require("../../src/model/gestor-servicios");

// https://www.chaijs.com/guide/styles/#differences

describe("gestor servicios", function () {
	const USUARIOS = [{ nombre: 'Usuario 1' }, { nombre: 'Usuario 2' }, { nombre: 'Usuario 3' }]
	const SERVICIOS = [{ nombre: 'Servicio 1' }, { nombre: 'Servicio 2' }, { nombre: 'Servicio 3' }]

	let gestor;

	beforeEach(function () {
		gestor = new GestorServicios();
	});

	it("constructor gestor servicios", function () {
		assert.deepEqual(gestor._lastId, 0);
		assert.deepEqual(gestor._usuarios, []);
		expect(gestor._usuarios).deep.equal([]);
		assert.deepEqual(gestor._servicios, []);
		expect(gestor._servicios).deep.equal([]);
		assert.deepEqual(gestor._asignaciones, []);
		expect(gestor._asignaciones).deep.equal([]);
	});

	it("getter usuarios", function () {
		assert.deepEqual(gestor._usuarios, []);
	});

	it("id generator", function () {
		assert.equal(gestor._lastId, 0);
		assert.equal(gestor.genId(), gestor._lastId)
		assert.equal(gestor._lastId, 1);
	})


	it("agregar usuario", function () {
		let usuarios = USUARIOS.map(u => gestor.agregarUsuario(u.nombre));
		assert.equal(gestor._usuarios.length, USUARIOS.length);
		USUARIOS.forEach((u, i) => {
			assert.equal(gestor._usuarios[i].nombre, USUARIOS[i].nombre);
			assert.equal(gestor._usuarios[i].nombre, usuarios[i].nombre);
			assert.exists(gestor._usuarios[i]._id);
		})
	});

	it("agregar servicio", function () {
		let servicios = SERVICIOS.map(s => gestor.agregarServicio(s.nombre));
		assert.equal(gestor._servicios.length, SERVICIOS.length);
		SERVICIOS.forEach((s, i) => {
			assert.equal(gestor._servicios[i].nombre, SERVICIOS[i].nombre);
			assert.equal(gestor._servicios[i].nombre, servicios[i].nombre);
			assert.exists(gestor._servicios[i]._id);
		})
	});

	it("asignar servicio", function () {
		let usuarios = USUARIOS.map(u => gestor.agregarUsuario(u.nombre));
		let servicios = SERVICIOS.map(s => gestor.agregarServicio(s.nombre));

		let asignaciones = [];

		usuarios.forEach(u => {
			servicios.forEach(s => {
				asignaciones.push(gestor.asignar(u._id, s._id))
			})
		})

		assert.equal(asignaciones.length, usuarios.length * servicios.length);
		assert.equal(asignaciones.length, USUARIOS.length * SERVICIOS.length);

		usuarios.forEach((u, iu) => {
			servicios.forEach((s, is) => {
				let a = asignaciones[iu * usuarios.length + is];
				assert.equal(a.usuario.nombre, u.nombre)
				assert.equal(a.servicio.nombre, s.nombre)
				assert.exists(a._id);
			})
		})
	});

	it("usuarioById", function () {
		let usuarios = USUARIOS.map(u => gestor.agregarUsuario(u.nombre));
		usuarios.forEach((u) => {
			assert.deepEqual(u, gestor.usuarioById(u._id));
		});
	});

	it("servicioById", function () {
		let servicios = SERVICIOS.map(s => gestor.agregarServicio(s.nombre));
		servicios.forEach((s) => {
			assert.deepEqual(s, gestor.servicioById(s._id));
		});
	});

	it("asignacionById", function () {
		let usuarios = USUARIOS.map(u => gestor.agregarUsuario(u.nombre));
		let servicios = SERVICIOS.map(s => gestor.agregarServicio(s.nombre));

		let asignaciones = [];

		usuarios.forEach(u => {
			servicios.forEach(s => {
				asignaciones.push(gestor.asignar(u._id, s._id))
			})
		})

		asignaciones.forEach((a) => {
			assert.deepEqual(a, gestor.asignacionById(a._id));
		});

	});


	it("asignacionesByServicio", function () {
		let usuarios = USUARIOS.map(u => gestor.agregarUsuario(u.nombre));
		let servicios = SERVICIOS.map(s => gestor.agregarServicio(s.nombre));

		let asignaciones = [];

		asignaciones.push(gestor.asignar(usuarios[0]._id, servicios[1]._id))
		asignaciones.push(gestor.asignar(usuarios[0]._id, servicios[2]._id))
		asignaciones.push(gestor.asignar(usuarios[1]._id, servicios[1]._id))

		assert.deepEqual(gestor.asignacionesByServicio(servicios[0]._id), [])
		assert.deepEqual(gestor.asignacionesByServicio(servicios[1]._id),
			[asignaciones[0], asignaciones[2]])
		assert.deepEqual(gestor.asignacionesByServicio(servicios[2]._id),
			[asignaciones[1]])

	});


	it("asignacionesByUsuario", function () {
		let usuarios = USUARIOS.map(u => gestor.agregarUsuario(u.nombre));
		let servicios = SERVICIOS.map(s => gestor.agregarServicio(s.nombre));

		let asignaciones = [];

		asignaciones.push(gestor.asignar(usuarios[0]._id, servicios[1]._id))
		asignaciones.push(gestor.asignar(usuarios[0]._id, servicios[2]._id))
		asignaciones.push(gestor.asignar(usuarios[1]._id, servicios[1]._id))

		assert.deepEqual(gestor.asignacionesByUsuario(usuarios[0]._id), [asignaciones[0], asignaciones[1]])
		assert.deepEqual(gestor.asignacionesByUsuario(usuarios[1]._id), [asignaciones[2]])
		assert.deepEqual(gestor.asignacionesByUsuario(usuarios[2]._id), [])

	});

	it("usuariosByServicio", function () {
		let usuarios = USUARIOS.map(u => gestor.agregarUsuario(u.nombre));
		let servicios = SERVICIOS.map(s => gestor.agregarServicio(s.nombre));

		let asignaciones = [];

		asignaciones.push(gestor.asignar(usuarios[0]._id, servicios[1]._id))
		asignaciones.push(gestor.asignar(usuarios[0]._id, servicios[2]._id))
		asignaciones.push(gestor.asignar(usuarios[1]._id, servicios[1]._id))

		assert.deepEqual(gestor.usuariosByServicio(servicios[0]._id), [])
		assert.deepEqual(gestor.usuariosByServicio(servicios[1]._id), [usuarios[0], usuarios[1]])
		assert.deepEqual(gestor.usuariosByServicio(servicios[2]._id), [usuarios[0]])

	});

	it("serviciosByUsuario", function () {
		let usuarios = USUARIOS.map(u => gestor.agregarUsuario(u.nombre));
		let servicios = SERVICIOS.map(s => gestor.agregarServicio(s.nombre));

		let asignaciones = [];

		asignaciones.push(gestor.asignar(usuarios[0]._id, servicios[1]._id))
		asignaciones.push(gestor.asignar(usuarios[0]._id, servicios[2]._id))
		asignaciones.push(gestor.asignar(usuarios[1]._id, servicios[1]._id))

		assert.deepEqual(gestor.serviciosByUsuario(usuarios[0]._id), [servicios[1], servicios[2]])
		assert.deepEqual(gestor.serviciosByUsuario(usuarios[1]._id), [servicios[1]])
		assert.deepEqual(gestor.serviciosByUsuario(usuarios[2]._id), [])

	});

	// Extra

	it("eliminar usuario", function () {
		let usuarios = USUARIOS.map(u => gestor.agregarUsuario(u.nombre));
		let servicios = SERVICIOS.map(s => gestor.agregarServicio(s.nombre));
		gestor.asignar(usuarios[1]._id, servicios[0]._id)

		gestor.eliminarUsuarioById(usuarios[0]._id);
		assert.equal(gestor.usuarios.length, 2);
		assert.throws(() => {
			gestor.eliminarUsuarioById(usuarios[1]._id);
		})
		assert.equal(gestor.usuarios.length, 2);
		gestor.eliminarUsuarioById(usuarios[2]._id);
		assert.equal(gestor.usuarios.length, 1);
	});

	it("eliminar servicio", function () {
		let usuarios = USUARIOS.map(u => gestor.agregarUsuario(u.nombre));
		let servicios = SERVICIOS.map(s => gestor.agregarServicio(s.nombre));
		gestor.asignar(usuarios[0]._id, servicios[1]._id)

		gestor.eliminarServicioById(servicios[0]._id);
		assert.equal(gestor.servicios.length, 2);
		assert.throws(() => {
			gestor.eliminarServicioById(servicios[1]._id);
		})
		assert.equal(gestor.servicios.length, 2);
		gestor.eliminarServicioById(servicios[2]._id);
		assert.equal(gestor.servicios.length, 1);
	});

	it("eliminar asignacion", function () {
		let usuarios = USUARIOS.map(u => gestor.agregarUsuario(u.nombre));
		let servicios = SERVICIOS.map(s => gestor.agregarServicio(s.nombre));
		let asignaciones = [];

		asignaciones.push(gestor.asignar(usuarios[0]._id, servicios[1]._id))
		asignaciones.push(gestor.asignar(usuarios[0]._id, servicios[2]._id))
		asignaciones.push(gestor.asignar(usuarios[1]._id, servicios[1]._id))

		asignaciones.forEach((a, i) => {
			assert.equal(gestor.asignaciones.length, asignaciones.length - i);
			gestor.eliminarAsignacionById(a._id)
			assert.equal(gestor.asignaciones.length, asignaciones.length - i - 1);
		});
	});


});