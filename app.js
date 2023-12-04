const express = require('express');
const app = express();
const path = require('path');
var mongoose = require('mongoose');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var uri = 'mongodb://127.0.0.1/gestor-servicios';
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('connecting', function () {
	console.log('Connecting to ', uri);
});
db.on('connected', function () {
	console.log('Connected to ', uri);
});
db.on('disconnecting', function () {
	console.log('Disconnecting from ', uri);
});
db.on('disconnected', function () {
	console.log('Disconnected from ', uri);
});
db.on('error', function (err) {
	console.error('Error ', err.message);
});



const GestorServicios = require('./src/model/gestor-servicios');
let model = new GestorServicios();
//
// Usuarios
//
app.get('/gestor-servicios/api/usuarios', async (req, res) => {
	try {
		let resultado = await model.getUsuarios();
		res.status(200).json(resultado);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: err.message })
	}
});

app.get('/gestor-servicios/api/usuarios/:uid', async (req, res) => {
	try {
		let uid = req.params.uid
		let usuario = await model.usuarioById(uid);
		if (!usuario) {
			let message = `Usuario con id ${uid} no encontrado`;
			console.error(message);
			res.status(404).json({ message });
		} else res.status(200).json(usuario);
	} catch (err) {
		console.error(e);
		res.status(500).json({ message: err.message });
	}
});

app.get('/gestor-servicios/api/usuarios/:uid/asignaciones', async (req, res) => {
	let uid = req.params.uid;
	try {
		let usuario = await model.usuarioById(uid);
		if (!usuario) {
			let message = `Usuario con id ${uid} no encontrado`;
			console.error(message);
			res.status(404).json({ message });
		} else {
			let asignaciones = await model.asignacionesByUsuario(uid);
			res.status(200).json(asignaciones);
		}
	}
	catch (err) {
		console.error(err);
		res.status(500).json({ message: err.message });
	}
});

app.get('/gestor-servicios/api/usuarios/:uid/servicios', async (req, res) => {
	let uid = req.params.uid;
	try {
		let usuario = await model.usuarioById(uid);
		if (!usuario) res.status(404).json({ message: `Usuario con id ${uid} no encontrado` });
		else {
			let servicios = await model.serviciosByUsuario(uid);
			res.status(200).json(servicios);
		}
	} catch (err) {
		console.error(e);
		res.status(500).json({ message: err.message });
	}
});

app.post('/gestor-servicios/api/usuarios', async (req, res) => {
	try {
		let usuario = req.body;
		usuario = await model.agregarUsuario(usuario.nombre)
		res.status(200).json(usuario);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: err.message });
	}
});

// app.delete('/gestor-servicios/api/usuarios', async (req, res) => {
// 	try {
// 		await model.setUsuarios([]);
// 		let usuarios = await model.getUsuarios();
// 		console.log('DELETE USUARIOS', usuarios)
// 		res.status(200).json(usuarios);
// 	} catch (err) {
// 		console.error(err);
// 		res.status(500).json({ message: err.message });
// 	}
// });

app.delete('/gestor-servicios/api/usuarios/:uid', async (req, res) => {
	try {
		let uid = req.params.uid;
		let usuario = await model.usuarioById(uid);
		if (!usuario) res.status(404).json({ message: `Usuario con id ${uid} no encontrado` });
		else {
			await model.eliminarUsuarioById(uid);
			res.status(200).json(usuario);
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: err.message });
	}
});

app.put('/gestor-servicios/api/usuarios', async (req, res) => {
	try {
		let usuarios = req.body;
		// let respuesta = usuarios.map(async u => {
		// 	let usuario = await model.agregarUsuario(u._nombre);
		// 	Object.assign(usuario, u)
		// 	return usuario.save();
		// });		
		res.status(200).json(await model.setUsuarios(usuarios));
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: err.message });
	}

});

app.put('/gestor-servicios/api/usuarios/:uid', async (req, res) => {
	try {
		let uid = req.params.uid;
		let usuario = req.body;
		usuario._id = uid;
		res.status(200).json((await model.setUsuario(usuario)));
	}
	catch (err) {
		console.error(err);
		res.status(500).json({ message: err.message });
	}

});

//
// Servicios
//

app.get('/gestor-servicios/api/servicios', async (req, res) => {
	try {
		let resultado = await model.getServicios();
		res.status(200).json(resultado);
	}
	catch (err) {
		console.error(e);
		res.status(500).json({ message: err.message });
	}
});

app.get('/gestor-servicios/api/servicios/:sid', async (req, res) => {
	try {
		let sid = req.params.sid
		let servicio = await model.servicioById(sid);
		if (!servicio) res.status(404).json({ message: `Servicio con id ${sid} no encontrado` });
		else res.status(200).json(servicio);
	}
	catch (err) {
		console.error(e);
		res.status(500).json({ message: err.message });
	}
});

// INC
app.get('/gestor-servicios/api/servicios/:sid/asignaciones', async (req, res) => {
	try {
		let sid = req.params.sid
		let servicio = await model.servicioById(sid);
		if (!servicio) res.status(404).json({ message: `Servicio con id ${sid} no encontrado` });
		else {
			let asignaciones = await model.asignacionesByServicio(sid);
			res.status(200).json(asignaciones);
		}
	} catch (err) {
		console.error(e);
		res.status(500).json({ message: err.message });
	}
});

// INC
app.get('/gestor-servicios/api/servicios/:sid/usuarios', async (req, res) => {
	try {
		let sid = req.params.sid
		let servicio = await model.servicioById(sid);
		if (!servicio) res.status(404).json({ message: `Servicio con id ${sid} no encontrado` });
		else {
			let usuarios = await model.usuariosByServicio(sid);
			res.status(200).json(usuarios);
		}
	} catch (err) {
		console.error(e);
		res.status(500).json({ message: err.message });
	}
});

// INC
app.post('/gestor-servicios/api/servicios', async (req, res) => {
	try {
		let servicio = req.body;
		servicio = await model.agregarServicio(servicio.nombre)
		res.status(200).json(servicio);
	} catch (err) {
		console.error(e);
		res.status(500).json({ message: err.message });
	}
});

app.delete('/gestor-servicios/api/servicios/:sid', async (req, res) => {
	try {
		let sid = req.params.sid;
		let servicio = await model.servicioById(sid);
		if (!servicio)
			res.status(404).json({ message: `Servicio con id ${sid} no encontrado` });
		else {
			await model.eliminarServicioById(sid);
			res.status(200).json(servicio);
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: err.message });
	}
});

app.put('/gestor-servicios/api/servicios', async (req, res) => {
	try {
		let servicios = req.body;
		// let respuesta = servicios.map(async s => {
		// 	let servicio = await model.agregarServicio(s._nombre);
		// 	Object.assign(servicio, s)
		// 	return servicio.save();
		// });
		res.status(200).json(await model.setServicios(servicios));
	} catch (err) {
		console.error(e);
		res.status(500).json({ message: err.message });
	}
});

app.put('/gestor-servicios/api/servicios/:sid', async (req, res) => {
	try {
		let servicio = req.body;
		servicio._id = req.params.sid;
		res.status(200).json((await model.setServicio(servicio)));
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: err.message });
	}

});

//
// Asignaciones
//
app.get('/gestor-servicios/api/asignaciones', async (req, res) => {
	try {
		let respuesta = await model.getAsignaciones();
		res.status(200).json(respuesta);
	} catch (err) {
		console.error(e);
		res.status(500).json({ message: err.message });
	}
});

app.get('/gestor-servicios/api/asignaciones/:aid', async (req, res) => {
	try {
		let aid = req.params.aid
		let asignacion = await model.asignacionById(aid);
		if (!asignacion) res.status(404).json({ message: `Asignación con id ${aid} no encontrada` });
		else res.status(200).json(asignacion);
	} catch (err) {
		console.error(e);
		res.status(500).json({ message: err.message });
	}

});

app.post('/gestor-servicios/api/asignaciones', async (req, res) => {
	try {
		let asignacion = req.body;
		asignacion = await model.asignar(asignacion.uid, asignacion.sid)
		res.status(200).json(asignacion);
	} catch (err) {
		console.error(e);
		res.status(500).json({ message: err.message });
	}
});

app.delete('/gestor-servicios/api/asignaciones/:aid', async (req, res) => {
	try {
		let aid = req.params.aid;
		let asignacion = await model.asignacionById(aid);
		if (!asignacion)
			res.status(404).json({ message: `Asignación con id ${aid} no encontrada` });
		else {
			await model.eliminarAsignacionById(aid);
			res.status(200).json(asignacion);
		}
	} catch (err) {
		console.error(e);
		res.status(500).json({ message: err.message });
	}

});

app.put('/gestor-servicios/api/asignaciones', async (req, res) => {
	let asignaciones = req.body;
	// let resultado = asignaciones.map(async a => {
	// 	let asignacion = await model.asignar(a._usuario._id, a._servicio._id);
	// 	// Error:  Object.assign(asignacion, a); 
	// 	// asignacion.fecha = a._fecha;
	// 	return asignacion;
	// });
	try {
		res.status(200).json(await model.setAsignaciones(asignaciones));
	} catch (err) {
		console.error(e);
		res.status(500).json({ message: err.message });
	}
});

app.put('/gestor-servicios/api/asignaciones/:aid', async (req, res) => {
	try {
		let asignacion = req.body;
		// console.log('ASIGNACION  ', asignacion)
		asignacion._id = req.params.aid;
		// console.log('ASIGNACION 2', asignacion);
		asignacion = await model.setAsignacion(asignacion);
		// console.log('ASIGNACION 3', asignacion);
		res.status(200).json(asignacion);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: err.message });
	}
});

// Not found

app.get('/gestor-servicios/api/*', (req, res) => {
	res.status(501).send('Not implemented, yet!');
});

app.use('/gestor-servicios/components', express.static(path.join(__dirname, 'public/components')));
app.use('/gestor-servicios/model', express.static(path.join(__dirname, 'public/model')));
app.use('/gestor-servicios/test', express.static(path.join(__dirname, 'public/test')));

app.use(/^\/gestor-servicios/, (req, res) => {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});


const PORT = 3000;

(async function () {
	try {
		await mongoose.connect(uri);
		app.listen(PORT, () => {
			console.log('Ejecutando Servidor en el puerto ' + PORT);
		})
	} catch (err) {
		console.error('Error', err.message);
	} finally {
		// await mongoose.disconnect();
	}
})();

