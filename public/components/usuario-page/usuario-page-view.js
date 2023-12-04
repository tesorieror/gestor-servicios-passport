class UsuarioPageView extends PageView {
	constructor() {
		super('usuario-page')
	}

	set usuarioNombre(nombre) { return document.getElementById('usuarioNombreId').innerHTML = nombre; }
	set borrarButtonVisible(visible) { if (!visible) document.getElementById('borrarId').remove(); }

	// set usuarioId(uid) {
		// let usuario = this.controller.getUsuarioById(uid);
	async setUsuarioId(uid){		
		let usuario = await this.controller.getUsuarioById(uid);
		if (!!usuario) this.usuarioNombre = usuario.nombre;
		else this.borrarButtonVisible = false;
	}

	async refresh(url) {
		await super.refresh(url);
	}

}