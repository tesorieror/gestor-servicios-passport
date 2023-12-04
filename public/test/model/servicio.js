
describe("servicio", function () {
  let servicio;
  const id = '1';
  const nombre = 'Servicio 1';
  beforeEach(function () {
    servicio = new Servicio(id, nombre)
  });
  it("constructor servicio", function () {
    assert.equal(servicio._id, id);
    assert.equal(servicio._nombre, nombre);
  });
  it("getter nombre", function () {
    assert.equal(servicio.nombre, nombre);
  });
  it("setter nombre", function () {
    const nombre2 = 'Servicio 2';
    servicio.nombre = nombre2;
    assert.equal(servicio._nombre, nombre2);
  });
});