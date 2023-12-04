class UsuariosPageController extends PageController {
  constructor(model) {
    super(model);
    this.view = new UsuariosPageView();
  }

  // Modelo
  // getUsuarios() { return this.model.usuarios; }
  async getUsuarios() { return await this.model.getUsuarios(); }

}