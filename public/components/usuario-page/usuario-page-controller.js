class UsuarioPageController extends PageController {
	constructor(model) {
		super(model);
		this.view = new UsuarioPageView();

	}

	// Modelo
	// getUsuarioById(uid) { return this.model.usuarioById(uid); }
	async getUsuarioById(uid) { return await this.model.usuarioById(uid); }

	// Controller
	get uid() { return this.getParam('id'); }

	// Eventos
	async borrar(event) {
		event.preventDefault();
		// sessionStorage.setItem('uid', this.uid);
		if (this.uid) {
			try {
				// this.model.eliminarUsuarioById(this.uid);
				await this.model.eliminarUsuarioById(this.uid);
				event.target.href = '/gestor-servicios/usuarios';
			} catch (err) {
				console.error(err.message)
				mensajes.agregarError(err.message);
			}
			await router.route(event);
		}
	}

	async refresh(url) {
		await super.refresh(url);
		let id = this.uid;
		// if (id) this.view.usuarioId = id;
		if (id) await this.view.setUsuarioId(id);
	}

}