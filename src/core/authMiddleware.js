function authMiddleware(req, res, next) {
  // TODO: valida JWT si corresponde
  // req.user = { id: "user-123" }
  next();
}
module.exports = { authMiddleware };
