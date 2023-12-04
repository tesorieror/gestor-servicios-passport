describe("asignacion", function () {
  let asignacion;
  const uId = '1';
  const sId = '2';
  const aId = '3';
  let usuario;
  let servicio;
  beforeEach(function () {
    usuario = new Usuario(uId, "Usuario 1");
    servicio = new Servicio(sId, "Servicio A");
    asignacion = new Asignacion(aId, usuario, servicio)
  });
  it("constructor asignacion", function () {
    assert.equal(asignacion._id, aId);
    assert.equal(asignacion._usuario, usuario);
    assert.equal(asignacion._servicio, servicio);
    assert.exists(asignacion.fecha);
  });
  it("getter fecha", function () {
    assert.equal(asignacion._fecha, asignacion.fecha);
  });
  it("getter usuario", function () {
    assert.equal(asignacion.usuario, usuario);
  });
  it("setter usuario", function () {
    const uId2 = '4';
    const nombre2 = 'Usuario 2'
    const usuario2 = new Usuario(uId2, nombre2);
    asignacion.usuario = usuario2;
    assert.equal(asignacion.usuario, usuario2);
  });
  it("getter servicio", function () {
    assert.equal(asignacion.servicio, servicio);
  });
  it("setter servicio", function () {
    const uId2 = '4';
    const nombre2 = 'Servicio 2'
    const servicio2 = new Usuario(uId2, nombre2);
    asignacion.servicio = servicio2;
    assert.equal(asignacion.servicio, servicio2);
  });
});