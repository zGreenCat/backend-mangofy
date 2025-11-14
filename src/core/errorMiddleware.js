const { HttpError } = require("./httpError");

function errorMiddleware(err, _req, res, _next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
}

module.exports = { errorMiddleware };
