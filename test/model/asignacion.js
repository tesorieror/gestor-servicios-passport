const assert = require("chai").assert;
const mongoose = require('mongoose');
const Usuario = require("../../src/model/usuario");
const Servicio = require("../../src/model/servicio");
const Asignacion = require("../../src/model/asignacion");
const uri = 'mongodb://127.0.0.1/gestor-servicios';

describe("asignacion", function () {
	let asignacion;
	let usuario;
	let servicio;

	before(async function () {
		await mongoose.connect(uri);
	})
	beforeEach(async function () {
		await Usuario.deleteMany();
		await Servicio.deleteMany();
		await Asignacion.deleteMany();
		let nombre = 'Usuario 1';
		usuario = new Usuario({ nombre });
		await usuario.save();
		nombre = 'Servicio 1'
		servicio = new Servicio({ nombre });
		await servicio.save();
		asignacion = new Asignacion();
		asignacion.usuario = usuario._id;
		asignacion.servicio = servicio._id;
		asignacion.fecha = new Date();
		return await asignacion.save();
	});
	it("constructor asignacion", function () {
		assert.exists(asignacion._id);
	});
	it("getter fecha", async function () {
		let actual = await Asignacion.findById(asignacion._id);
		actual = actual.toObject();
		assert.equal(actual.fecha.toISOString(), asignacion.fecha.toISOString());
	});
	it("getter usuario", async function () {
		let actual = await Asignacion.findById(asignacion._id).populate('usuario').exec();
		actual = actual.toObject();
		assert.deepEqual(actual.usuario, usuario.toObject());
	});
	it("setter usuario", async function () {
		const nombre2 = 'Usuario 2'
		const usuario2 = new Usuario({ nombre: nombre2 });
		await usuario2.save();
		asignacion.usuario = usuario2;
		await asignacion.save();
		let actual = await Asignacion.findById(asignacion._id).populate('usuario').exec();
		actual = actual.toObject();
		assert.deepEqual(actual.usuario, usuario2.toObject());
	});

	it("getter servicio", async function () {
		let actual = await Asignacion.findById(asignacion._id).populate('servicio').exec();
		actual = actual.toObject();
		assert.deepEqual(actual.servicio, servicio.toObject());
	});
	it("setter servicio", async function () {
		const nombre2 = 'Servicio 2'
		const servicio2 = new Servicio({ nombre: nombre2 });
		await servicio2.save();
		asignacion.servicio = servicio2;
		await asignacion.save();
		let actual = await Asignacion.findById(asignacion._id).populate('servicio').exec();
		actual = actual.toObject();
		assert.deepEqual(actual.servicio, servicio2.toObject());
	});

	afterEach(async function () {
		await Usuario.deleteMany();
		await Servicio.deleteMany();
		await Asignacion.deleteMany();
	})
	after(async function () {
		return await mongoose.disconnect();
	})
});


// const assert = require("chai").assert;
// const Usuario = require("../../src/model/usuario");
// const Servicio = require("../../src/model/servicio");
// const Asignacion = require("../../src/model/asignacion");
// describe("asignacion", function () {
//   let asignacion;
//   const uId = '1';
//   const sId = '2';
//   const aId = '3';
//   let usuario;
//   let servicio;
//   beforeEach(function () {
//     usuario = new Usuario(uId, "Usuario 1");
//     servicio = new Servicio(sId, "Servicio A");
//     asignacion = new Asignacion(aId, usuario, servicio)
//   });
//   it("constructor asignacion", function () {
//     assert.equal(asignacion._id, aId);
//     assert.equal(asignacion._usuario, usuario);
//     assert.equal(asignacion._servicio, servicio);
//     assert.exists(asignacion.fecha);
//   });
//   it("getter fecha", function () {
//     assert.equal(asignacion._fecha, asignacion.fecha);
//   });
//   it("getter usuario", function () {
//     assert.equal(asignacion.usuario, usuario);
//   });
//   it("setter usuario", function () {
//     const uId2 = '4';
//     const nombre2 = 'Usuario 2'
//     const usuario2 = new Usuario(uId2, nombre2);
//     asignacion.usuario = usuario2;
//     assert.equal(asignacion.usuario, usuario2);
//   });
//   it("getter servicio", function () {
//     assert.equal(asignacion.servicio, servicio);
//   });
//   it("setter servicio", function () {
//     const uId2 = '4';
//     const nombre2 = 'Servicio 2'
//     const servicio2 = new Usuario(uId2, nombre2);
//     asignacion.servicio = servicio2;
//     assert.equal(asignacion.servicio, servicio2);
//   });
// });