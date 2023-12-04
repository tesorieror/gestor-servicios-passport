var mongoose = require('mongoose');
var GestorServicios = require('./model/gestor-servicios');


var uri = 'mongodb://127.0.0.1/gestor-servicios';
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('connecting', function () { console.log('Connecting to ', uri); });
db.on('connected', function () { console.log('Connected to ', uri); });
db.on('disconnecting', function () { console.log('Disconnecting from ', uri); });
db.on('disconnected', function () { console.log('Disconnected from ', uri); });
db.on('error', function (err) { console.error('Error ', err.message); });

(async function () {
	try {
		let model = new GestorServicios();
		await mongoose.connect(uri);
		await model.cleanUsers();
	} catch (err) {
		console.error('Error', err.message);
	} finally {
		await mongoose.disconnect();
	}
})();