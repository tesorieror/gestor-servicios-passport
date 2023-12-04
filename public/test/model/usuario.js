describe("usuario", function () {
  let usuario;
  const id = '1';
  const nombre = 'Usuario 1';
  beforeEach(function () {
    usuario = new Usuario(id, nombre)
  });
  it("constructor usuario", function () {
    assert.equal(usuario._id, id);
    assert.equal(usuario._nombre, nombre);
  });
  it("getter nombre", function () {
    assert.equal(usuario.nombre, nombre);
  });
  it("setter nombre", function () {
    const nombre2 = 'Usuario 2';
    usuario.nombre = nombre2;
    assert.equal(usuario._nombre, nombre2);
  });
});