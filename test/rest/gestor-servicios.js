const assert = require("chai").assert;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const URL = 'http://localhost:3000/gestor-servicios/api';

describe(URL, function () {
	// let lastId = 0;
	const USUARIOS = [], SERVICIOS = [], ASIGNACIONES = [];
	let usuarios, servicios, asignaciones;

	before(async function () {
		USUARIOS.push({ nombre: "Usuario 1" });
		USUARIOS.push({ nombre: "Usuario 2" });
		USUARIOS.push({ nombre: "Usuario 3" });

		SERVICIOS.push({ nombre: "Servicio 1" });
		SERVICIOS.push({ nombre: "Servicio 2" });
		SERVICIOS.push({ nombre: "Servicio 3" });

		USUARIOS.forEach(usuario => {
			SERVICIOS.forEach(servicio => {
				// ASIGNACIONES.push({ _fecha: (new Date()).toISOString() });
				ASIGNACIONES.push({});
			})
		})
	});


	beforeEach(async function () {

		response = await chai.request(URL).put(`/usuarios`).send(USUARIOS);
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		usuarios = response.body;
		// console.log(usuarios);
		usuarios.forEach((u, iu) => {
			assert.exists(u._id)
			assert.equal(u.nombre, USUARIOS[iu].nombre);
		})

		response = await chai.request(URL).put(`/servicios`).send(SERVICIOS);
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		servicios = response.body;
		servicios.forEach((s, is) => {
			assert.exists(s._id)
			assert.equal(s.nombre, SERVICIOS[is].nombre);
		})

		usuarios.forEach((usuario, iu) => {
			servicios.forEach((servicio, is) => {
				let ASIGNACION = ASIGNACIONES[is + iu * usuarios.length];
				Object.assign(ASIGNACION, { usuario, servicio });
			})
		})

		response = await chai.request(URL).put(`/asignaciones`).send(ASIGNACIONES);
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		asignaciones = response.body;
		// console.log(asignaciones);
		asignaciones.forEach((a, ia) => {
			assert.exists(a._id)
			assert.exists(a.fecha)
			// assert.equal(a.fecha, ASIGNACIONES[ia]._fecha);
			assert.deepEqual(a.usuario, ASIGNACIONES[ia].usuario._id);
			assert.deepEqual(a.servicio, ASIGNACIONES[ia].servicio._id);
		})

	})


	it(`GET ${URL}/usuarios`, async function () {
		let response = await chai.request(URL).get('/usuarios').send();
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		let resultado = response.body;
		// assert.deepEqual(resultado, usuarios);
		assert.equal(resultado.length, usuarios.length)

		resultado.forEach(r => {
			let u = usuarios.find(u => u._id == r._id);
			assert.deepEqual(r, u);
		})

	});

	it(`GET ${URL}/usuarios/:uid`, async function () {
		let uid = usuarios[0]._id;
		let response = await chai.request(URL).get(`/usuarios/${uid}`).send();
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		let usuario = response.body;
		assert.exists(usuario._id);
		assert.equal(usuario.nombre, USUARIOS[0].nombre);
	});

	it(`GET ${URL}/usuarios/:uid/asignaciones`, async function () {
		let usuario = usuarios[1];
		let uid = usuario._id;
		let response = await chai.request(URL).get(`/usuarios/${uid}/asignaciones`).send();
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		let resultado = response.body;
		// console.log('ACTUAL', resultado)

		// assert.deepEqual(resultado, [asignaciones[3], asignaciones[4], asignaciones[5]]);
		let asignaciones2 = [asignaciones[3], asignaciones[4], asignaciones[5]];
		assert.equal(resultado.length, asignaciones2.length);

		resultado.forEach(r => {
			let a = asignaciones2.find(a => a._id == r._id);
			// assert.deepEqual(r, a)
			assert.equal(r._id, a._id)
			assert.equal(r.fecha, a.fecha)
			assert.equal(r.servicio._id, a.servicio)
			assert.equal(r.usuario._id, a.usuario)
		})

	});

	it(`GET ${URL}/usuarios/:uid/servicios`, async function () {
		let uid = usuarios[1]._id;
		let response = await chai.request(URL).get(`/usuarios/${uid}/servicios`).send();
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		let resultado = response.body;
		// assert.deepEqual(resultado, [servicios[0], servicios[1], servicios[2]]);
		let servicios2 = [servicios[0], servicios[1], servicios[2]];
		assert.equal(resultado.length, servicios.length);
		resultado.forEach(r => {
			let s = servicios2.find(s => s._id == r._id)
			assert.deepEqual(r, s);
		})
	});


	it(`PUT ${URL}/usuarios`, async function () {

		let USUARIOS2 = [
			{ nombre: "Usuario D" },
			{ nombre: "Usuario E" }
		];

		let response = await chai.request(URL).put(`/usuarios`).send(USUARIOS2);
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		let resultado = response.body;
		assert.equal(resultado.length, USUARIOS2.length);
		resultado.forEach((u, iu) => {
			assert.deepEqual(u.nombre, USUARIOS2[iu].nombre);
		})

		usuarios = resultado;

		response = await chai.request(URL).get(`/usuarios`).send();
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		resultado = response.body;
		assert.deepEqual(resultado, usuarios);
	});




	it(`PUT ${URL}/usuarios/:uid`, async function () {
		let USUARIO = { nombre: "Usuario B" };
		let usuario = usuarios[1];
		let uid = usuario._id;
		usuario.nombre = USUARIO.nombre;

		let response = await chai.request(URL).put(`/usuarios/${uid}`).send(usuario);
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		let actualizado = response.body;
		assert.deepEqual(actualizado, usuario);

		response = await chai.request(URL).get(`/usuarios/${uid}`).send();
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		actualizado = response.body;
		assert.deepEqual(actualizado, usuario);

	});

	it(`DELETE ${URL}/usuarios/:uid`, async function () {
		let usuario = usuarios[1];
		let uid = usuario._id;
		let response = await chai.request(URL).delete(`/usuarios/${uid}`).send();
		assert.equal(response.status, 500);
		assert.isFalse(response.ok);

		response = await chai.request(URL).get(`/usuarios/${uid}/asignaciones`).send();
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		let resultado = response.body;
		// console.log(resultado);
		await Promise.all(resultado.map(async a => await chai.request(URL).delete(`/asignaciones/${a._id}`).send()));
		response = await chai.request(URL).delete(`/usuarios/${uid}`).send();
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		resultado = response.body;
		assert.deepEqual(resultado, usuario);

		response = await chai.request(URL).get(`/usuarios`).send();
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		resultado = response.body;
		assert.deepEqual(resultado, usuarios.filter(u => u._id != uid));

	});


	it(`POST ${URL}/usuarios`, async function () {

		let USUARIO = { nombre: "Usuario D" }

		let response = await chai.request(URL).post(`/usuarios`).send(USUARIO);
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		let usuario = response.body;
		assert.exists(usuario._id)
		assert.deepEqual(usuario.nombre, USUARIO.nombre);

		response = await chai.request(URL).get(`/usuarios/${usuario._id}`).send();
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		let respuesta = response.body;
		assert.deepEqual(respuesta, usuario);
	});



	it(`GET ${URL}/servicios`, async function () {
		let response = await chai.request(URL).get('/servicios').send();
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		let respuesta = response.body;
		// assert.deepEqual(respuesta, servicios);

		respuesta.forEach(r => {
			let s = servicios.find(s => s._id == r._id);
			assert.deepEqual(r, s);
		})

	});

	it(`GET ${URL}/servicios/:sid`, async function () {
		let servicio = servicios[1];
		let sid = servicio._id;
		let response = await chai.request(URL).get(`/servicios/${sid}`).send();
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		let resultado = response.body;
		assert.deepEqual(resultado, servicio);
	});



	it(`POST ${URL}/servicios`, async function () {

		let SERVICIO = { nombre: "Servicio D" }

		let response = await chai.request(URL).post(`/servicios`).send(SERVICIO);
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		let servicio = response.body;
		assert.exists(servicio._id);
		assert.exists(servicio._id);
		assert.equal(servicio.nombre, SERVICIO.nombre);


		response = await chai.request(URL).get(`/servicios/${servicio._id}`).send();
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		let resultado = response.body;
		assert.deepEqual(resultado, servicio);
	});

	it(`PUT ${URL}/servicios`, async function () {

		let SERVICIOS2 = [
			{ nombre: "Servicio D" },
			{ nombre: "Servicio E" }
		];

		let response = await chai.request(URL).put(`/servicios`).send(SERVICIOS2);
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		let resultado = response.body;
		assert.equal(resultado.length, SERVICIOS2.length);
		resultado.forEach((s, is) => {
			assert.equal(s.nombre, SERVICIOS2[is].nombre);
		})

		servicios = resultado;

		response = await chai.request(URL).get(`/servicios`).send();
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		resultado = response.body;
		assert.equal(resultado.length, servicios.length);
		// assert.deepEqual(resultado, servicios);
		assert.equal(resultado.length, servicios.length);
		resultado.forEach(r => {
			let s = servicios.find(s => s._id == r._id);
			assert.deepEqual(r, s);
		})

		assert.deepEqual(resultado, servicios);

	});

	it(`PUT ${URL}/servicios/:sid`, async function () {
		let servicio = servicios[2]
		let sid = servicio._id;
		let SERVICIO = { nombre: "Servicio C" };
		servicio.nombre = SERVICIO.nombre;
		let response = await chai.request(URL).put(`/servicios/${sid}`).send(servicio);
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		let resultado = response.body;
		assert.deepEqual(resultado, servicio);

		response = await chai.request(URL).get(`/servicios/${sid}`).send();
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		resultado = response.body;
		assert.deepEqual(resultado, servicio);

	});

	it(`GET ${URL}/servicios/:sid/asignaciones`, async function () {
		let servicio = servicios[1]
		let sid = servicio._id;
		let response = await chai.request(URL).get(`/servicios/${sid}/asignaciones`).send();
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		let resultado = response.body;
		assert.equal(resultado.length, 3);

		// assert.deepEqual(resultado, [asignaciones[1], asignaciones[4], asignaciones[7]]);
		[asignaciones[1], asignaciones[4], asignaciones[7]].forEach(a => {
			let r = resultado.find(r => r._id == a._id);
			assert.equal(r._id, a._id);
			assert.equal(r.fecha, a.fecha);
			assert.equal(r.usuario._id, a.usuario);
			assert.equal(r.servicio._id, a.servicio);
		});
	});

	it(`GET ${URL}/servicios/:sid/usuarios`, async function () {
		let servicio = servicios[1];
		let sid = servicio._id;
		let response = await chai.request(URL).get(`/servicios/${sid}/usuarios`).send();
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		let resultado = response.body;
		assert.equal(resultado.length, 3);
		assert.deepEqual(resultado, [usuarios[0], usuarios[1], usuarios[2]]);
	});

	it(`DELETE ${URL}/servicios/:sid`, async function () {
		let servicio = servicios[0];
		let sid = servicio._id;
		let response = await chai.request(URL).delete(`/servicios/${sid}`).send();
		assert.equal(response.status, 500);
		assert.isFalse(response.ok);

		response = await chai.request(URL).get(`/servicios/${sid}/asignaciones`).send();
		let resultado = response.body;
		await Promise.all(resultado.map(async (a) => await chai.request(URL).delete(`/asignaciones/${a._id}`).send()));

		response = await chai.request(URL).delete(`/servicios/${sid}`).send();
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		resultado = response.body;
		assert.deepEqual(resultado, servicio);

		response = await chai.request(URL).get(`/servicios`).send();
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		resultado = response.body;
		assert.deepEqual(resultado, [servicios[1], servicios[2]]);

	});


	// // Asignaciones

	it(`GET ${URL}/asignaciones`, async function () {
		let response = await chai.request(URL).get('/asignaciones').send();
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		let resultado = response.body;
		// assert.deepEqual(resultado, asignaciones);
		resultado.forEach(r => {
			let a = asignaciones.find(a => a._id == r._id);
			assert.deepEqual(r, a);
		})
		asignaciones.forEach(r => {
			let a = resultado.find(a => a._id == r._id);
			assert.deepEqual(r, a);
		})
	});

	it(`GET ${URL}/asignaciones/:aid`, async function () {
		let asignacion = asignaciones[0];
		let aid = asignacion._id;
		let response = await chai.request(URL).get(`/asignaciones/${aid}`).send();
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		let resultado = response.body;
		assert.equal(resultado._id, asignacion._id)
		assert.equal(resultado.usuario._id, asignacion.usuario)
		assert.equal(resultado.servicio._id, asignacion.servicio)
		assert.equal(resultado.fecha, asignacion.fecha)
		// assert.deepEqual(resultado, asignacion);
	});



	it(`PUT ${URL}/asignaciones`, async function () {

		let ASIGNACIONES2 = [
			{ usuario: usuarios[0], servicio: servicios[0] },
			{ usuario: usuarios[1], servicio: servicios[1] },
			{ usuario: usuarios[2], servicio: servicios[2] }
		];

		let response = await chai.request(URL).put(`/asignaciones`).send(ASIGNACIONES2);
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		let resultado = response.body;
		assert.equal(resultado.length, ASIGNACIONES2.length);
		resultado.forEach((a, ia) => {
			assert.exists(a._id);
			assert.exists(a.fecha);
			assert.deepEqual(a.usuario, ASIGNACIONES2[ia].usuario._id);
			assert.deepEqual(a.servicio, ASIGNACIONES2[ia].servicio._id);
		});


		asignaciones = resultado;


		response = await chai.request(URL).get(`/asignaciones`).send();
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		resultado = response.body;
		assert.equal(resultado.length, ASIGNACIONES2.length);
		assert.deepEqual(resultado, asignaciones);


	});

	it(`PUT ${URL}/asignaciones/:aid`, async function () {
		let asignacion = asignaciones[0];
		let aid = asignacion._id;
		let ASIGNACION = { usuario: usuarios[1]._id, servicio: servicios[1]._id, fecha: (new Date()).toISOString() };
		// console.log(asignacion);
		// console.log(ASIGNACION);
		let response = await chai.request(URL).put(`/asignaciones/${aid}`).send(ASIGNACION);
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);

		let resultado = response.body;
		assert.exists(resultado._id);
		assert.exists(resultado.fecha);
		assert.deepEqual(resultado.usuario, ASIGNACION.usuario);
		assert.deepEqual(resultado.servicio, ASIGNACION.servicio);

		asignacion = resultado;

		response = await chai.request(URL).get(`/asignaciones/${aid}`).send();
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		resultado = response.body;
		// assert.deepEqual(resultado, asignacion);

		assert.equal(resultado._id, asignacion._id)
		assert.equal(resultado.usuario._id, asignacion.usuario)
		assert.equal(resultado.servicio._id, asignacion.servicio)
		assert.equal(resultado.fecha, asignacion.fecha)

	});

	it(`DELETE ${URL}/asignaciones/:uid`, async function () {
		let asignacion = asignaciones[3];
		let aid = asignacion._id;
		let response = await chai.request(URL).delete(`/asignaciones/${aid}`).send();
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		let resultado = response.body;

		// assert.deepEqual(resultado, asignaciones[3]);
		assert.equal(resultado._id, asignacion._id)
		assert.equal(resultado.usuario._id, asignacion.usuario)
		assert.equal(resultado.servicio._id, asignacion.servicio)
		assert.equal(resultado.fecha, asignacion.fecha)

		response = await chai.request(URL).get(`/asignaciones`).send();
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		resultado = response.body;
		// assert.deepEqual(resultado, asignaciones.filter(a => a._id != aid));

		let asignaciones2 = asignaciones
			.filter((a) => a._id != aid);

		assert.equal(resultado.length, asignaciones2.length)
		resultado.forEach(r => {
			let a = asignaciones2.find(a => a._id == r._id);
			assert.deepEqual(r, a);
		})
		asignaciones2.forEach(r => {
			let a = resultado.find(a => a._id == r._id);
			assert.deepEqual(r, a);
		})
	});

	it(`POST ${URL}/asignaciones`, async function () {
		let ASIGNACION = { uid: usuarios[2]._id, sid: servicios[2]._id }
		let response = await chai.request(URL).post(`/asignaciones`).send(ASIGNACION);
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		let asignacion = response.body;


		assert.deepEqual(asignacion.usuario, usuarios[2]);
		assert.deepEqual(asignacion.servicio, servicios[2]);
		assert.exists(asignacion._id);
		assert.exists(asignacion.fecha);

		response = await chai.request(URL).get(`/asignaciones/${asignacion._id}`).send();
		assert.equal(response.status, 200);
		assert.isTrue(response.ok);
		let asignacion2 = response.body;
		assert.deepEqual(asignacion2, asignacion);
	});




})