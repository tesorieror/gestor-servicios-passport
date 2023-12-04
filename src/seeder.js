var mongoose = require('mongoose');
var Usuario = require('./model/usuario');
var Servicio = require('./model/servicio');
var Asignacion = require('./model/asignacion');

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
(async function () {
	try {
		await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

		let resultado = await Usuario.deleteMany();
		// console.log(resultado);
		resultado = await Servicio.deleteMany();
		// console.log(resultado);
		resultado = await Asignacion.deleteMany();

		let usuario;
		usuario = new Usuario({ nombre: 'Usuario 1' });
		await usuario.save();
		usuario = new Usuario({ nombre: 'Usuario 2' });
		await usuario.save();
		usuario = new Usuario({ nombre: 'Usuario 3' });
		await usuario.save();

		let usuarios = await Usuario.find();
		console.log(usuarios);

		let servicio;
		servicio = new Servicio({ nombre: 'Servicio A' });
		await servicio.save();
		servicio = new Servicio({ nombre: 'Servicio B' });
		await servicio.save();
		servicio = new Servicio({ nombre: 'Servicio C' });
		await servicio.save();

		let servicios = await Servicio.find();
		console.log(servicios);

		let asignaciones = [];
		servicios.forEach(s =>
			usuarios.forEach(u => {
				let asignacion = new Asignacion();
				asignacion.servicio = s._id;
				asignacion.usuario = u._id;
				asignacion.fecha = new Date();
				asignaciones.push(asignacion.save());
			})
		);
		asignaciones = await Promise.all(asignaciones);
		
		asignaciones = await Asignacion.find().populate(['servicio','usuario']).exec();
		
		console.log(asignaciones);


		// let usuarios = await Usuario.find({ nombre: 'Usuario 2' });
		// console.log(usuarios);
		// let servicios = await Servicio.find({ nombre: 'Servicio C' });
		// console.log(servicios);

		// usuario = await Usuario.findOne({ nombre: 'Usuario 2' });
		// console.log(usuario);
		// servicio = await Servicio.findById('655a7bbd844e3aa3f90f929a');
		// console.log(servicio);

		// let resultado = await Usuario.deleteOne({ nombre: 'Usuario 2' });
		// console.log('Borrados: ',resultado);
		// let usuario = await Usuario.findOne({ nombre: 'Usuario 3' });
		// console.log('Usuario 3 id:',usuario._id);
		// usuario = await Usuario.findByIdAndDelete(usuario._id.toString());    



		// let usuario = new Usuario({ nombre: 'Usuario 1' });
		// await usuario.save();
		// console.log('PASO 1', usuario);
		// usuario.nombre = 'Usuario A';
		// await usuario.save();
		// console.log('PASO 2', usuario);
		// usuario = await Usuario.findById(usuario._id.toString());
		// usuario.nombre = 'Usuario Alfa';
		// await usuario.save();
		// console.log('PASO 3', usuario);
		// await Usuario.findOneAndUpdate({ nombre: 'Usuario Alfa' }, { nombre: 'Usuario Uno' });
		// usuario = await Usuario.findById(usuario._id.toString())
		// console.log('PASO 4', usuario);
		// await Usuario.findByIdAndUpdate(usuario._id.toString(), { nombre: 'Usuario One' });
		// usuario = await Usuario.findById(usuario._id.toString())
		// console.log('PASO 5', usuario);







	} catch (err) {
		console.error('Error', err.message);
	} finally {
		await mongoose.disconnect();
	}
})();
