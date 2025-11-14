require("./models/audio.model");
try { require("./models/audioVariant.model"); } catch (_) {}

module.exports = require("./audio.routes");
