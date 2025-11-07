const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const sqlite3 = require("sqlite3").verbose();
const { promisify } = require("util");

const DB_FILE = path.join(__dirname, "..", "data.sqlite");
const needInit = !fs.existsSync(DB_FILE);
const rawDb = new sqlite3.Database(DB_FILE);
const runAsync = promisify(rawDb.run.bind(rawDb));
const getAsync = promisify(rawDb.get.bind(rawDb));
const allAsync = promisify(rawDb.all.bind(rawDb));

async function init() {
    if (needInit) {
        await runAsync(`PRAGMA journal_mode = WAL;`);
    }
    await runAsync(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT
        )
    `);
    await runAsync(`
        CREATE TABLE IF NOT EXISTS refreshTokens (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            revoked INTEGER NOT NULL DEFAULT 0,
            createdAt INTEGER NOT NULL,
            FOREIGN KEY(userId) REFERENCES users(id)
        )
    `);
}

init().catch(err => {
    console.error("DB init error:", err);
    process.exit(1);
});
const db = {
    users: new Map(),
    refreshTokens: new Map(),
};


async function createUser(email, passwordHash, name) {
    const existing = await findUserByEmail(email);
    if (existing) throw new Error("EMAIL_IN_USE");
    const id = uuid();
    // almacena la contraseña en la columna `password` (coincide con validateUser)
    await runAsync(
        `INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)`,
        id,
        email,
        passwordHash,
        name || null
    );
    return { id, email, password: passwordHash, name: name || null };
}

async function findUserByEmail(email) {
    const row = await getAsync(`SELECT id, email, password AS password, name FROM users WHERE email = ?`, email);
    return row || null;
}

async function findUserById(id) {
    const row = await getAsync(`SELECT id, email, password AS password, name FROM users WHERE id = ?`, id);
    return row || null;
}

async function storeRefresh(userId, id) {
    await runAsync(
        `INSERT INTO refreshTokens (id, userId, createdAt) VALUES (?, ?, ?)`,
        id,
        userId,
        Date.now()
    );
}

async function revokeRefresh(id) {
    await runAsync(`UPDATE refreshTokens SET revoked = 1 WHERE id = ?`, id);
}

async function isRefreshValid(id, userId) {
    const row = await getAsync(`SELECT * FROM refreshTokens WHERE id = ?`, id);
    return !!row && !row.revoked && row.userId === userId;
}

module.exports = {
    db: rawDb,
    createUser,
    findUserByEmail,
    findUserById,
    storeRefresh,
    revokeRefresh,
    isRefreshValid
}