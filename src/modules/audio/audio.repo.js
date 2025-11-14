// Reemplaza con tu acceso real a DB (Prisma/Sequelize/Knex).
// Aquí dejo un stub en memoria para que compile.

const _data = [
  // Ejemplo:
  // {
  //   id: "a1",
  //   title: "Demo",
  //   public_id: "audios/demo_123",
  //   format: "mp3",
  //   duration_sec: 42.7,
  //   bytes: 123456,
  //   visibility: "public"
  // }
];

async function list() {
  // En producción: SELECT columnas necesarias
  return _data.map(a => ({
    id: a.id,
    title: a.title,
    format: a.format,
    duration_sec: a.duration_sec,
    visibility: a.visibility,
  }));
}

async function byId(id) {
  // En producción: SELECT * FROM audio WHERE id = $1
  return _data.find(a => a.id === id) || null;
}

module.exports = { list, byId };
