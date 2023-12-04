class AsignacionesPageView extends PageView {
	constructor() {
		super('asignaciones-page')
	}

	// Vista
	get asignacionesList() { return document.getElementById('asignacionesListId'); }
	get usuariosSelect() { return document.getElementById('usuariosSelectId'); }
	get serviciosSelect() { return document.getElementById('serviciosSelectId'); }
	get usuarioSelectValue() { return this.usuariosSelect.value; }
	get servicioSelectValue() { return this.serviciosSelect.value; }



	async refresh(url) {
		await super.refresh(url);
		let asignacionesListLitems = '';
		// this.controller.getAsignaciones().forEach(asignacion => {
		let asignaciones = await this.controller.getAsignaciones();
		asignaciones.forEach(asignacion => {
			asignacionesListLitems = asignacionesListLitems.concat(`<li>${asignacion.fecha}[${asignacion._id}]: ${asignacion.usuario.nombre}[${asignacion.usuario._id}] <=> ${asignacion.servicio.nombre}[${asignacion.servicio._id}] <a href="/gestor-servicios/asignaciones" onclick="router.controller.borrar(event, '${asignacion._id}')">Borrar</a></li>`);
		});
		this.asignacionesList.innerHTML = asignacionesListLitems;

		let usuariosOptions = '';
		// this.controller.getUsuarios().forEach(u => {
		let usuarios = await this.controller.getUsuarios();
		usuarios.forEach(u => {
			usuariosOptions = usuariosOptions.concat(`<option value="${u._id}">${u.nombre}</option>`)
		})
		this.usuariosSelect.innerHTML = usuariosOptions;

		let serviciosOptions = '';
		// this.controller.getServicios().forEach(s => {
		let servicios = await this.controller.getServicios()
		servicios.forEach(s => {
			serviciosOptions = serviciosOptions.concat(`<option value="${s._id}">${s.nombre}</option>`)
		})
		this.serviciosSelect.innerHTML = serviciosOptions;
	}
}