const { sequelize } = require("../config/db");


require("../modules/auth/models/user.model");
require("../modules/auth/models/refreshToken.model");
require("../modules/audio/models/audio.model");
require("../modules/audio/models/audioVariant.model");
require("../modules/library/models/userLibrary.model");

function applyAssociations() {
  const models = sequelize.models;
  Object.values(models).forEach(m => m.associate && m.associate(models));
}

let initialized = false;
async function initModels({ sync = false, alter = false, force = false } = {}) {
  if (!initialized) {
    applyAssociations();
    initialized = true;
  }
  if (sync) await sequelize.sync({ alter, force });
  return sequelize.models;
}


module.exports = {
  sequelize,
  initModels,
  get models() { return sequelize.models; },
  get User() { return sequelize.models.User; },
  get RefreshToken() { return sequelize.models.RefreshToken; },
  get Audio() { return sequelize.models.Audio; },
  get AudioVariant() { return sequelize.models.AudioVariant; },
  get UserLibrary() { return sequelize.models.UserLibrary; },
};
