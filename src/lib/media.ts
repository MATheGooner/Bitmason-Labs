/** Public upload policy. Credentials and the S3 API endpoint stay on the server. */
export const ASSET_PUBLIC_ORIGIN = "https://assets.bitmasonlabs.com";
export const MEDIA_KEY_PREFIX = "portfolio/images/";
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const MAX_IMAGE_PIXELS = 24_000_000;
export const MAX_IMAGE_DIMENSION = 8192;
export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";
export const IMAGE_UPLOAD_HINT = "JPEG, PNG or WebP, up to 8 MB. Add alternative text and captions before saving.";
export const MEDIA_OWNER = "bitmason-admin";
const idPattern = "[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}";
export const mediaKeyPattern = new RegExp(`^${MEDIA_KEY_PREFIX}(${idPattern})\\.webp$`);

export function assetIdFromUrl(value: string): string | undefined {
  try {
    const url = new URL(value);
    const match = url.pathname.slice(1).match(mediaKeyPattern);
    if (url.origin !== ASSET_PUBLIC_ORIGIN || url.username || url.password || url.search || url.hash
      || !match || value !== `${ASSET_PUBLIC_ORIGIN}/${url.pathname.slice(1)}`) return undefined;
    return match[1];
  } catch { return undefined; }
}

export function isImageReference(value: string): boolean {
  return value === "" || /^\/images\/projects\/[a-zA-Z0-9/_-]+\.(webp|png|jpe?g|avif)$/i.test(value) || Boolean(assetIdFromUrl(value));
}

export interface UploadedImage {
  assetId: string;
  src: string;
  width: number;
  height: number;
  byteSize: number;
  mimeType: "image/webp";
}
export interface ImageCleanupResult { removed: number; pending: number; errors: number }
