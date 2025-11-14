// Stub en memoria
const _users = [];

async function findByEmail(email) {
  return _users.find(u => u.email === email) || null;
}

async function create({ email, password }) {
  const u = { id: String(_users.length + 1), email, password };
  _users.push(u);
  return u;
}

module.exports = { findByEmail, create };
