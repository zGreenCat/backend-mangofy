const {v4: uuid} = require("uuid");

const db = {
    users: new Map(),
    refreshTokens: new Map(),
};


async function createUser(email,passwordHash,name){
    const exists = [...db.users.values()].find(u => u.email === email);
    if (exists) throw new Error("User already exists");
    const user = { id: uuid(), email,passwordHash,name};
    db.users.set(user.id,user);
    return user;
}

async function findUserByEmail(email){
    return [...db.users.values()].find(u => u.email === email) || null;
}

async function findUserById(id){return db.users.get(id) || null;}

async function storeRefresh(userId,id){
    db.refreshTokens.set(id,{id,userId,revoked:false,createdAt:Date.now()});
}

async function revokeRefresh(id){
    const rec = db.refreshTokens.get(id);
    if (rec) rec.revoked = true;
}

async function isRefreshValid(id,userId){
    const rec = db.refreshTokens.get(id);
    return !!rec && !rec.revoked && rec.useId === userId;
}

module.exports = {
    db,
    createUser,
    findUserByEmail,
    findUserById,
    storeRefresh,
    revokeRefresh,
    isRefreshValid
}