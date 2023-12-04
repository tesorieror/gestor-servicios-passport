class AsignacionesPageController extends PageController {
	constructor(model) {
		super(model);
		this.view = new AsignacionesPageView();
	}

	// Modelo
	// getAsignaciones() { return this.model.asignaciones; }
	async getAsignaciones() { return await this.model.getAsignaciones(); }
	// getUsuarios() { return this.model.usuarios; }
	async getUsuarios() { return await this.model.getUsuarios(); }
	// getServicios() { return this.model.servicios; }
	async getServicios() { return await this.model.getServicios(); }

	// Vista

	get usuarioId() { return this.view.usuarioSelectValue; }
	get servicioId() { return this.view.servicioSelectValue; }


	// Eventos
	// async borrar(event, id) {
	async borrar(event, id) {
		event.preventDefault();
		// this.model.eliminarAsignacionById(id);
		await this.model.eliminarAsignacionById(id);
		router.route(event);
	}

	// agregar(event) {
	async agregar(event) {
		event.preventDefault();
		let uid = this.usuarioId;
		let sid = this.servicioId;
		// this.model.asignar(uid, sid)
		await this.model.asignar(uid, sid)
		event.target.href = '/gestor-servicios/asignaciones';
		router.route(event);
	}
}