const assert = require("chai").assert;
const { expect } = require("chai");
const mongoose = require('mongoose');

const GestorServicios = require("../../src/model/gestor-servicios");
const Usuario = require('../../src/model/usuario');
const Servicio = require('../../src/model/servicio');
const Asignacion = require('../../src/model/asignacion');

const uri = 'mongodb://127.0.0.1/gestor-servicios';
// https://www.chaijs.com/guide/styles/#differences

describe("gestor servicios", function () {
	const USUARIOS = [{ nombre: 'Usuario 1' }, { nombre: 'Usuario 2' }, { nombre: 'Usuario 3' }]
	const SERVICIOS = [{ nombre: 'Servicio 1' }, { nombre: 'Servicio 2' }, { nombre: 'Servicio 3' }]

	let gestor;

	before(async function () {
		await mongoose.connect(uri);
	})

	beforeEach(async function () {
		gestor = new GestorServicios();
		await Usuario.deleteMany();
		await Servicio.deleteMany();
		await Asignacion.deleteMany();
	});

	it("constructor gestor servicios", async function () {
		let actual = await gestor.getUsuarios();
		assert.deepEqual(actual, []);
		expect(actual).deep.equal([]);
		actual = await gestor.getServicios();
		assert.deepEqual(actual, []);
		expect(actual).deep.equal([]);
		actual = await gestor.getAsignaciones();
		assert.deepEqual(actual, []);
		expect(actual).deep.equal([]);
	});

	it("getter usuarios", async function () {
		let expected = await Promise.all(USUARIOS.map(async u => {
			return (await new Usuario(u).save()).toObject();
		}));
		// expected = expected.map(o => o.toObject());
		let actual = await gestor.getUsuarios();
		// actual = actual.map(o => o.toObject());
		assert.equal(actual.length, expected.length);
		assert.deepEqual(actual, expected);
	});

	it("agregar usuario", async function () {
		await Promise.all(USUARIOS.map(u => gestor.agregarUsuario(u.nombre)));
		let actual = await gestor.getUsuarios();
		assert.equal(actual.length, USUARIOS.length);
		actual.forEach((u, i) => {
			assert.equal(u.nombre, USUARIOS[i].nombre);
			assert.exists(u._id);
		})
	});

	it("agregar servicio", async function () {
		await Promise.all(SERVICIOS.map(s => gestor.agregarServicio(s.nombre)));
		let actual = await gestor.getServicios();
		assert.equal(actual.length, SERVICIOS.length);
		actual.forEach((s, i) => {
			assert.equal(s.nombre, SERVICIOS[i].nombre);
			assert.exists(s._id);
		})
	});

	it("asignar servicio", async function () {
		let usuarios = await Promise.all(USUARIOS.map(u => gestor.agregarUsuario(u.nombre)));
		let servicios = await Promise.all(SERVICIOS.map(s => gestor.agregarServicio(s.nombre)));

		let asignaciones = [];

		usuarios.forEach(u => {
			servicios.forEach(s => {
				asignaciones.push(gestor.asignar(u._id, s._id))
			})
		})
		asignaciones = await Promise.all(asignaciones);

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

	it("usuarioById", async function () {
		let usuarios = await Promise.all(USUARIOS.map(async u => await gestor.agregarUsuario(u.nombre)));
		usuarios.forEach(async (u) => {
			assert.deepEqual(u, await gestor.usuarioById(u._id));
		});
	});

	it("servicioById", async function () {
		let servicios = await Promise.all(SERVICIOS.map(async s => await gestor.agregarServicio(s.nombre)));
		servicios.forEach(async (s) => {
			assert.deepEqual(s, await gestor.servicioById(s._id));
		});
	});

	it("asignacionById", async function () {
		let usuarios = await Promise.all(USUARIOS.map(async u => await gestor.agregarUsuario(u.nombre)));
		let servicios = await Promise.all(SERVICIOS.map(async s => await gestor.agregarServicio(s.nombre)));

		let asignaciones = [];

		usuarios.forEach(u => {
			servicios.forEach(s => {
				asignaciones.push(gestor.asignar(u._id, s._id))
			})
		})

		asignaciones = await Promise.all(asignaciones);

		asignaciones.forEach(async (a) => {
			assert.deepEqual(a, await gestor.asignacionById(a._id));
		});

	});


	it("asignacionesByServicio", async function () {
		let usuarios = await Promise.all(USUARIOS.map(async u => await gestor.agregarUsuario(u.nombre)));
		let servicios = await Promise.all(SERVICIOS.map(async s => await gestor.agregarServicio(s.nombre)));

		let asignaciones = [];

		asignaciones.push(await gestor.asignar(usuarios[0]._id, servicios[1]._id))
		asignaciones.push(await gestor.asignar(usuarios[0]._id, servicios[2]._id))
		asignaciones.push(await gestor.asignar(usuarios[1]._id, servicios[1]._id))

		asignaciones = await Promise.all(asignaciones);

		assert.deepEqual(await gestor.asignacionesByServicio(servicios[0]._id), [])
		assert.deepEqual(await gestor.asignacionesByServicio(servicios[1]._id),
			[asignaciones[0], asignaciones[2]])
		assert.deepEqual(await gestor.asignacionesByServicio(servicios[2]._id),
			[asignaciones[1]])

	});


	it("asignacionesByUsuario", async function () {
		let usuarios = await Promise.all(USUARIOS.map(async u => await gestor.agregarUsuario(u.nombre)));
		let servicios = await Promise.all(SERVICIOS.map(async s => await gestor.agregarServicio(s.nombre)));

		let asignaciones = [];

		asignaciones.push(await gestor.asignar(usuarios[0]._id, servicios[1]._id))
		asignaciones.push(await gestor.asignar(usuarios[0]._id, servicios[2]._id))
		asignaciones.push(await gestor.asignar(usuarios[1]._id, servicios[1]._id))

		asignaciones = await Promise.all(asignaciones);

		assert.deepEqual(await gestor.asignacionesByUsuario(usuarios[0]._id), [asignaciones[0], asignaciones[1]])
		assert.deepEqual(await gestor.asignacionesByUsuario(usuarios[1]._id), [asignaciones[2]])
		assert.deepEqual(await gestor.asignacionesByUsuario(usuarios[2]._id), [])

	});

	it("usuariosByServicio", async function () {
		let usuarios = await Promise.all(USUARIOS.map(async u => await gestor.agregarUsuario(u.nombre)));
		let servicios = await Promise.all(SERVICIOS.map(async s => await gestor.agregarServicio(s.nombre)));

		let asignaciones = [];

		asignaciones.push(await gestor.asignar(usuarios[0]._id, servicios[1]._id))
		asignaciones.push(await gestor.asignar(usuarios[0]._id, servicios[2]._id))
		asignaciones.push(await gestor.asignar(usuarios[1]._id, servicios[1]._id))

		asignaciones = Promise.all(asignaciones);

		assert.deepEqual(await gestor.usuariosByServicio(servicios[0]._id), [])
		assert.deepEqual(await gestor.usuariosByServicio(servicios[1]._id), [usuarios[0], usuarios[1]])
		assert.deepEqual(await gestor.usuariosByServicio(servicios[2]._id), [usuarios[0]])

	});

	it("serviciosByUsuario", async function () {
		let usuarios = await Promise.all(USUARIOS.map(async u => await gestor.agregarUsuario(u.nombre)));
		let servicios = await Promise.all(SERVICIOS.map(async s => await gestor.agregarServicio(s.nombre)));

		let asignaciones = [];

		asignaciones.push(await gestor.asignar(usuarios[0]._id, servicios[1]._id))
		asignaciones.push(await gestor.asignar(usuarios[0]._id, servicios[2]._id))
		asignaciones.push(await gestor.asignar(usuarios[1]._id, servicios[1]._id))


		asignaciones = Promise.all(asignaciones);


		assert.deepEqual(await gestor.serviciosByUsuario(usuarios[0]._id), [servicios[1], servicios[2]])
		assert.deepEqual(await gestor.serviciosByUsuario(usuarios[1]._id), [servicios[1]])
		assert.deepEqual(await gestor.serviciosByUsuario(usuarios[2]._id), [])

	});

	// Extra

	it("eliminar usuario", async function () {
		let usuarios = await Promise.all(USUARIOS.map(async u => await gestor.agregarUsuario(u.nombre)));
		let servicios = await Promise.all(SERVICIOS.map(async s => await gestor.agregarServicio(s.nombre)));
		await gestor.asignar(usuarios[1]._id, servicios[0]._id)

		await gestor.eliminarUsuarioById(usuarios[0]._id);
		assert.equal((await gestor.getUsuarios()).length, 2);
		try {
			await gestor.eliminarUsuarioById(usuarios[1]._id);
			assert.fail('Debe dar una excepción');
		} catch (err) { }

		assert.equal((await gestor.getUsuarios()).length, 2);
		await gestor.eliminarUsuarioById(usuarios[2]._id);
		assert.equal((await gestor.getUsuarios()).length, 1);
	});

	it("eliminar servicio", async function () {
		let usuarios = await Promise.all(USUARIOS.map(async u => await gestor.agregarUsuario(u.nombre)));
		let servicios = await Promise.all(SERVICIOS.map(async s => await gestor.agregarServicio(s.nombre)));
		await gestor.asignar(usuarios[0]._id, servicios[1]._id)

		await gestor.eliminarServicioById(servicios[0]._id);
		assert.equal((await gestor.getServicios()).length, 2);
		try {
			await gestor.eliminarServicioById(servicios[1]._id);
			assert.fail('Debe dar una excepción');
		} catch (err) { }

		assert.equal((await gestor.getServicios()).length, 2);
		await gestor.eliminarServicioById(servicios[2]._id);
		assert.equal((await gestor.getServicios()).length, 1);
	});

	it("eliminar asignacion", async function () {
		let usuarios = await Promise.all(USUARIOS.map(async u => await gestor.agregarUsuario(u.nombre)));
		let servicios = await Promise.all(SERVICIOS.map(async s => await gestor.agregarServicio(s.nombre)));
		let asignaciones = [];

		asignaciones.push(await gestor.asignar(usuarios[0]._id, servicios[1]._id))
		asignaciones.push(await gestor.asignar(usuarios[0]._id, servicios[2]._id))
		asignaciones.push(await gestor.asignar(usuarios[1]._id, servicios[1]._id))

		asignaciones.forEach(async (a, i) => {
			assert.equal((await gestor.getAsignaciones()).length, asignaciones.length - i);
			await gestor.eliminarAsignacionById(a._id)
			assert.equal((await gestor.getAsignaciones()).length, asignaciones.length - i - 1);
		});
	});


});