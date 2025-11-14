const { cloudinary } = require("../../config/cloudinary");
const repo = require("./audio.repo");
const { HttpError } = require("../../core/httpError");

const UPLOAD_PRESET = "mangofy_audio_signed";

async function list(params) {
  const q = params?.q || "";
  const limit = Number(params?.limit || 20);
  const offset = Number(params?.offset || 0);
  return repo.listAudios({ q, limit, offset });
}

async function signature() {
  // devuelve lo necesario para el upload firmado
  const timestamp = Math.floor(Date.now() / 1000);
  const upload_preset = UPLOAD_PRESET; // firmado
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const folder = "audios";
  const { v2: cdn } = require("cloudinary");
  const signature = cdn.utils.api_sign_request(
    { timestamp, upload_preset, folder },
    process.env.CLOUDINARY_API_SECRET
  );

  return { timestamp, signature, cloudName, apiKey, upload_preset,folder };
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
