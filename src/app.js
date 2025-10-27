const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { env } = require("./env");
const { authRouter } = require("./auth/routes");
const { requireAuth } = require("./auth/middleware");

const app = express();
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.use("/auth", authRouter);

app.get("/me", requireAuth, (req, res) => {
  return res.json({ me: req.user });
});

app.listen(env.PORT, () => {
  console.log(`API on http://localhost:${env.PORT}`);
});
