const { cloudinary } = require("../../config/cloudinary");
const repo = require("./audio.repo");
const { env } = require("../../config/env");
const { HttpError } = require("../../core/httpError");

const UPLOAD_PRESET = env.CLOUDINARY_UPLOAD_PRESET;

async function list(params) {
  const q = params?.q || "";
  const limit = Number(params?.limit || 20);
  const offset = Number(params?.offset || 0);
  return repo.listAudios({ q, limit, offset });
}

async function signature() {
  const cfg = cloudinary.config(); // ← misma instancia configurada
  // Validaciones claras (si falta algo, no sigas):
  if (!cfg.cloud_name || !cfg.api_key || !cfg.api_secret) {
    throw new Error("CLOUDINARY config incompleta (cloud_name/api_key/api_secret)");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "audios"; // si lo usas, debes firmarlo y luego enviarlo en el FormData
  const upload_preset = UPLOAD_PRESET; // tu preset firmado

  // Firma SOLO los campos que realmente enviarás en el FormData
  const toSign = { timestamp, folder, upload_preset };
  const signature = cloudinary.utils.api_sign_request(toSign, cfg.api_secret);

  // Devuelve llaves planas con los NOMBRES que espera el front:
  return {
    cloudName: cfg.cloud_name,      // 👈 camelCase (tu front lee sig.cloudName)
    apiKey: cfg.api_key,
    timestamp,
    signature,
    upload_preset,
    folder,
  };
}
async function getPlayUrl(id, quality) {
  const audio = await repo.findAudioByIdWithVariants(id);
  if (!audio) throw Object.assign(new Error("AUDIO_NOT_FOUND"), { status: 404 });

  let publicId = audio.public_id;
  if (quality && audio.variants?.length) {
    const v = audio.variants.find(x => x.kind === quality);
    if (v) publicId = v.public_id;
  }

  const isPrivate = audio.visibility === "private";
  const { v2: cdn } = require("cloudinary");
  return cdn.url(publicId, {
    resource_type: "video",
    secure: true,
    type: isPrivate ? "authenticated" : "upload",
    sign_url: isPrivate,
    expires_at: isPrivate ? Math.floor(Date.now()/1000) + 3600 : undefined,
  });
}

async function createFromUpload(dto, ownerId) {
  const data = {
    title: dto.title,
    artist: dto.artist || null,
    public_id: dto.public_id,
    format: dto.format,
    duration_sec: dto.duration_sec || null,
    bytes: dto.bytes || null,
    visibility: dto.visibility || "public",
    ownerId: ownerId || null,
  };
  const created = await repo.createAudio(data);
  return created;
}

module.exports = { list, signature, getPlayUrl, createFromUpload };
