class ServiciosPageView extends PageView {

	_selectedId = null;
	servicioNombre = null;

	constructor() {
		super( 'servicios-page')
	}

	get selectedId() { return this._selectedId }

	// set selectedId(id) {
	// 	this._selectedId = id;
	// 	let servicio = this.controller.getServicioById(id);
	async setSelectedId(id) {
		this._selectedId = id;
		let servicio = await this.controller.getServicioById(id);
		this.servicioNombre = !!servicio ? servicio.nombre : '';
	}

	//Vista
	get serviciosList() { return document.getElementById('serviciosListId'); }
	get servicioNombreInput() { return document.getElementById('nombreInputTextId'); }
	get form() { return document.getElementById('servicioForm'); }

	get servicioNombreInputValue() { return this.servicioNombreInput.value; }
	set servicioNombreInputValue(nombre) { this.servicioNombreInput.value = nombre; }

	async refresh(url) {
		await super.refresh(url);
		let servicioListLitems = '';
		// this.controller.getServicios().forEach(servicio => {
		let servicios = await this.controller.getServicios()
		servicios.forEach(servicio => {
			servicioListLitems = servicioListLitems.concat(`<li><a href="/gestor-servicios/servicios" onclick="router.controller.select(event,'${servicio._id}' );">${servicio.nombre} ${this.selectedId == servicio._id ? '(seleccionado)' : ''}</a></li>`);
		});
		this.serviciosList.innerHTML = servicioListLitems;
		this.servicioNombreInputValue = !!this.servicioNombre ? this.servicioNombre : '';
	}

}