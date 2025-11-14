const { cloudinary } = require("../../config/cloudinary");
const repo = require("./audio.repo");
const { HttpError } = require("../../core/httpError");

const UPLOAD_PRESET = "mangofy_audio_signed";

async function list() {
  // Devuelve metadatos (sin URL de reproducción)
  return repo.list();
}

async function signature() {
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { timestamp, upload_preset: UPLOAD_PRESET };
  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);

  return {
    timestamp,
    signature,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    upload_preset: UPLOAD_PRESET,
  };
}

async function getPlayUrl(id) {
  const audio = await repo.byId(id);
  if (!audio) throw new HttpError(404, "Audio no encontrado");

  const isPrivate = audio.visibility === "private";
  const url = cloudinary.url(audio.public_id, {
    resource_type: "video",
    secure: true,
    type: isPrivate ? "authenticated" : "upload",
    sign_url: isPrivate,
    expires_at: isPrivate ? Math.floor(Date.now() / 1000) + 3600 : undefined,
    // transformation: [{ audio_codec: "mp3" }], // opcional
  });

  return url;
}

module.exports = { list, signature, getPlayUrl };
