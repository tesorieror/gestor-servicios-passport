const assert = require("chai").assert;
const mongoose = require('mongoose');
const Servicio = require("../../src/model/servicio");

const uri = 'mongodb://127.0.0.1/gestor-servicios';

describe("servicio", async function () {
	let servicio;
	// const id = '1';
	const nombre = 'Servicio 1';
	before(async function () {
		await mongoose.connect(uri);
	})
	beforeEach(async function () {
		await Servicio.deleteMany();
		servicio = new Servicio({ nombre });
		return await servicio.save();
	});
	it("constructor servicio", async function () {
		assert.exists(servicio._id);
	});
	it("get nombre", async function () {
		let actual = await Servicio.findById(servicio._id);
		assert.equal(actual.nombre, nombre);
	});

	it("set nombre", async function () {
		const nombre2 = 'Servicio 2';
		servicio.nombre = nombre2;
		await servicio.save();
		actual = await Servicio.findById(servicio._id);
		assert.equal(actual.nombre, nombre2);
	});
	afterEach(async function () {
		return await Servicio.deleteMany();
	})
	after(async function () {
		return await mongoose.disconnect();
	})
});

// const assert = require("chai").assert;
// const Servicio = require("../../src/model/servicio");
// describe("servicio", function () {
//   let servicio;
//   const id = '1';
//   const nombre = 'Servicio 1';
//   beforeEach(function () {
//     servicio = new Servicio(id, nombre)
//   });
//   it("constructor servicio", function () {
//     assert.equal(servicio._id, id);
//     assert.equal(servicio._nombre, nombre);
//   });
//   it("getter nombre", function () {
//     assert.equal(servicio.nombre, nombre);
//   });
//   it("setter nombre", function () {
//     const nombre2 = 'Servicio 2';
//     servicio.nombre = nombre2;
//     assert.equal(servicio._nombre, nombre2);
//   });
// });