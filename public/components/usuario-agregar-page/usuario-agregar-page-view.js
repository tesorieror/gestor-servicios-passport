class UsuarioAgregarPageView extends PageView {
	constructor() {
		super('usuario-agregar-page')
	}

	//Vista
	get form() { return document.getElementById('agregarFormId'); }
	get usuarioNombreInput() { return document.getElementById('nombreInputTextId'); }
	get usuarioNombreInputValue() { return this.usuarioNombreInput.value; }
}