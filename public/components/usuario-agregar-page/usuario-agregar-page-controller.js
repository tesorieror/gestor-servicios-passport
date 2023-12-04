class UsuarioAgregarPageController extends PageController {
	constructor(model) {
		super(model);
		this.view = new UsuarioAgregarPageView();
	}


	get usuarioNombre() { return this.view.usuarioNombreInputValue; }

	async agregar(event) {
		event.preventDefault();
		this.view.form.reportValidity();
		let valid = this.view.form.checkValidity();
		if (valid) {
			// let usuario = this.model.agregarUsuario(this.usuarioNombre);
			let usuario = await this.model.agregarUsuario(this.usuarioNombre);
			mensajes.agregarInfo(`El usuario ${usuario.nombre} [${usuario._id}] ha sido agregado`)
			event.target.href = "/gestor-servicios/usuarios";
			router.route(event);
		}
	}

}