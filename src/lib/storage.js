import { supabase } from './supabaseClient';

const CROP_BUCKET = 'crop-images';
const VOICE_BUCKET = 'voice-recordings';
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_AUDIO_TYPES = new Set(['audio/mpeg', 'audio/wav', 'audio/webm', 'audio/ogg', 'audio/mp4', 'audio/x-m4a']);

const fileExtension = (file, fallback) =>
  file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || fallback;

export async function uploadCropImage(file, userId) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error('Use a JPG, PNG, or WebP crop image.');
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Crop images must be 10 MB or smaller.');
  }

  const extension = fileExtension(file, 'jpg');
  const path = `${userId}/${crypto.randomUUID()}.${extension}`;
  const { data, error } = await supabase.storage
    .from(CROP_BUCKET)
    .upload(path, file, { cacheControl: '3600', contentType: file.type, upsert: false });

  if (error) throw error;
  return data.path;
}

export async function uploadVoiceRecording(file, userId) {
  const mediaType = file.type.split(';')[0];
  if (!ALLOWED_AUDIO_TYPES.has(mediaType)) {
    throw new Error('Use an MP3, WAV, WebM, OGG, MP4, or M4A audio file.');
  }
  if (file.size > 20 * 1024 * 1024) {
    throw new Error('Voice recordings must be 20 MB or smaller.');
  }

  const path = `${userId}/${crypto.randomUUID()}.${fileExtension(file, 'webm')}`;
  const { data, error } = await supabase.storage
    .from(VOICE_BUCKET)
    .upload(path, file, { cacheControl: '3600', contentType: mediaType, upsert: false });

  if (error) throw error;
  return data.path;
}

export async function createCropImageUrl(path) {
  if (!path || /^https?:\/\//.test(path)) return path || null;
  const { data, error } = await supabase.storage
    .from(CROP_BUCKET)
    .createSignedUrl(path, 60 * 60);

  if (error) {
    console.error('Unable to load crop image', error);
    return null;
  }
  return data.signedUrl;
}

export async function createVoiceUrl(path) {
  if (!path || /^https?:\/\//.test(path)) return path || null;
  const { data, error } = await supabase.storage
    .from(VOICE_BUCKET)
    .createSignedUrl(path, 60 * 60);

  if (error) {
    console.error('Unable to load voice recording', error);
    return null;
  }
  return data.signedUrl;
}
