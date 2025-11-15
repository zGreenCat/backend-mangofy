const repo = require("./library.repo");
async function listUserLibrary(userId, { limit=50, offset=0 } = {}) {
  return repo.list(userId, { limit: Number(limit), offset: Number(offset) });
}
async function addToLibrary(userId, audioId) {
  return repo.add(userId, audioId);
}
async function removeFromLibrary(userId, audioId) {
  return repo.remove(userId, audioId);
}
module.exports = { listUserLibrary, addToLibrary, removeFromLibrary };
