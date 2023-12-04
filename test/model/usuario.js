const assert = require("chai").assert;
const mongoose = require('mongoose');
const Usuario = require("../../src/model/usuario");

const uri = 'mongodb://127.0.0.1/gestor-servicios';

describe("usuario", async function () {
	let usuario;
	// const id = '1';
	const nombre = 'Usuario 1';
	before(async function () {
		await mongoose.connect(uri);
	})
	beforeEach(async function () {
		await Usuario.deleteMany();
		usuario = new Usuario({ nombre });
		return await usuario.save();
	});
	it("constructor usuario", async function () {
		assert.exists(usuario._id);
	});
	it("get nombre", async function () {
		let actual = await Usuario.findById(usuario._id);
		assert.equal(actual.nombre, nombre);
	});
	it("set nombre", async function () {
		const nombre2 = 'Usuario 2';
		usuario.nombre = nombre2;
		await usuario.save();
		let actual = await Usuario.findById(usuario._id);
		assert.equal(actual.nombre, nombre2);
	});
	afterEach(async function () {
		return await Usuario.deleteMany();
	})
	after(async function () {
		return await mongoose.disconnect();
	})
});