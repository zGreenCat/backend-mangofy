const bcrypt = require("bcryptjs");
const { createUser, findUserByEmail} = require("./db");

async function register(email,password,name){
    const hash = await bcrypt.hash(password, 10);
    return createUser(email,hash,name);
}

async function validateUser(email,password) {
    const user = await findUserByEmail(email);
    if (!user) return false;
    const ok = await bcrypt.compare(password, user.password);
    return ok ? user : null;
}

module.exports = { register, validateUser };