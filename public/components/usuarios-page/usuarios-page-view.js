class UsuariosPageView extends PageView {
  constructor() {
    super('usuarios-page')
  }

  get usuariosList() {
    return document.getElementById('usuariosListId');
  }

  async refresh(url) {
    await super.refresh(url);
    let usuarioListLitems = '';
    // this.controller.getUsuarios().forEach(usuario => {
    let usuarios = await this.controller.getUsuarios();
    usuarios.forEach(usuario => {
      usuarioListLitems = usuarioListLitems.concat(`<li><a href="/gestor-servicios/usuarios?id=${usuario._id}" onclick="router.route(event);">${usuario.nombre}</a></li>`);
    });
    this.usuariosList.innerHTML = usuarioListLitems;
  }

}