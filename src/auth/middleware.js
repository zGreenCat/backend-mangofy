const { verifyAccess} = require("./tokens")

function requireAuth(req,res,next){
    const hdr = req.headers.authorization || "";
    const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try{
        const payload = verifyAccess(token);
        req.user = { id: payload.sub, email: payload.email};
    }catch{
        return res.status(401).json({ error: "Unauthorized" });
    }
}

module.exports = { requireAuth };