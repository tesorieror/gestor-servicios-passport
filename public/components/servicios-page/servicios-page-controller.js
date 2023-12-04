class ServiciosPageController extends PageController {

	constructor(model) {
		super(model);
		this.view = new ServiciosPageView();
	}

	// Controlador
	get selectedId() { return this.view.selectedId; }
	// set selectedId(id) { this.view.selectedId = id; }
	async setSelectedId(id) { await this.view.setSelectedId(id); }

	// Modelo
	// getServicioById(id) { return this.model.servicioById(id); }
	async getServicioById(id) { return await this.model.servicioById(id); }
	// getServicios() { return this.model.servicios; }
	async getServicios() { return await this.model.getServicios(); }

	// Vista
	get servicioNombre() { return this.view.servicioNombreInputValue; }
	set servicioNombre(nombre) { this.view.servicioNombre = nombre; }


	// Eventos

	async select(event, id) {
		event.preventDefault();
		if (this.selectedId == id) this.unselect(event);
		// else this.selectedId = id;
		else await this.setSelectedId(id);
		await router.route(event);
	}

	async unselect(event) {
		// this.selectedId = null;
		await this.selectedId(null);
		await router.route(event);
	}

	async agregar(event) {
		event.preventDefault();
		this.view.form.reportValidity();
		let valid = this.view.form.checkValidity();
		if (valid) {
			// this.model.agregarServicio(this.servicioNombre);
			await this.model.agregarServicio(this.servicioNombre);
			this.servicioNombre = null;
			await router.route(event);
		}
	}

	async borrar(event) {
		event.preventDefault();
		if (!!this.selectedId) {
			try {
				// this.model.eliminarServicioById(this.selectedId)
				await this.model.eliminarServicioById(this.selectedId)
				this.servicioNombre = null;
			} catch (err) {
				console.error(err.message)
				mensajes.agregarError(err.message);
			}
			finally {
				await router.route(event);
			}
		}
	}

}