class MensajesView extends View {
	constructor() {
		super('mensajes');		
	}

	get mensajesList() {
		return document.getElementById(this.parentId);
	}


	get infos() { return mensajes.infos }
	get errs() { return mensajes.errs }
	async refresh() {

		if (this.infos.length == 0 && this.errs.length == 0) this.mensajesList.innerHTML = 'Bienvenido!';
		else {
			let infoList = '<ul>'
			this.infos.forEach(info => {
				infoList = infoList.concat(`<li class="info">${info}</li>`);
			});
			infoList = infoList.concat('</ul>');

			let errList = '<ul>'
			this.errs.forEach(err => {
				errList = errList.concat(`<li class="error">${err}</li>`);
			});
			errList = errList.concat('</ul>');

			this.mensajesList.innerHTML = infoList.concat(errList);
		}
	}
}