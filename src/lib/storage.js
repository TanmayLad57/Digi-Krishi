import { supabase } from './supabaseClient';

const CROP_BUCKET = 'crop-images';
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function uploadCropImage(file, userId) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error('Use a JPG, PNG, or WebP crop image.');
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Crop images must be 10 MB or smaller.');
  }

  const extension = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const path = `${userId}/${crypto.randomUUID()}.${extension}`;
  const { data, error } = await supabase.storage
    .from(CROP_BUCKET)
    .upload(path, file, { cacheControl: '3600', contentType: file.type, upsert: false });

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
