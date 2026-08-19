// ─────────────────────────────────────────────────────────────────────────────
// Client-side image downscaling / compression
// ─────────────────────────────────────────────────────────────────────────────
// Why this exists: an uploaded photo is held as a base64 data URL, and that
// string is (a) written to localStorage on every form change, (b) saved into the
// CV row in Supabase, and (c) embedded in the exported PDF. A raw phone photo is
// 3–8 MB, and base64 inflates it by ~33%, so a single upload can blow the ~5 MB
// localStorage quota — at which point autosave fails silently and the user loses
// work. Downscaling on upload keeps every one of those three paths small.
//
// 1024px / quality 0.82 puts a typical portrait around 120–250 KB, a 20–40x
// reduction, and CV templates render the photo at roughly 150–300px anyway, so
// there is no visible difference in the output.

export const DEFAULT_MAX_DIMENSION = 1024;
export const DEFAULT_QUALITY = 0.82;

// Rough byte size of a data URL's payload (base64 encodes 3 bytes as 4 chars).
export const dataUrlBytes = (dataUrl) => {
  if (typeof dataUrl !== "string") return 0;
  const comma = dataUrl.indexOf(",");
  if (comma === -1) return 0;
  const b64 = dataUrl.slice(comma + 1);
  const padding = b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((b64.length * 3) / 4) - padding);
};

export const formatBytes = (bytes) => {
  if (!bytes) return "0 KB";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Decodes a File into something canvas can draw, with EXIF orientation applied.
//
// createImageBitmap({ imageOrientation: "from-image" }) is the reliable path:
// phone photos routinely carry an EXIF rotation flag, and older browsers ignored
// it when drawing to canvas — producing sideways headshots. The <img> fallback
// covers browsers without createImageBitmap (Safari < 15), where the element's
// own orientation handling applies instead.
const decodeImage = async (file) => {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      return { source: bitmap, width: bitmap.width, height: bitmap.height, release: () => bitmap.close?.() };
    } catch {
      // Some browsers reject the options bag; retry without it before falling back.
      try {
        const bitmap = await createImageBitmap(file);
        return { source: bitmap, width: bitmap.width, height: bitmap.height, release: () => bitmap.close?.() };
      } catch {
        /* fall through to the <img> path */
      }
    }
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Could not read that image file."));
      el.src = objectUrl;
    });
    return {
      source: img,
      width: img.naturalWidth || img.width,
      height: img.naturalHeight || img.height,
      release: () => URL.revokeObjectURL(objectUrl),
    };
  } catch (err) {
    URL.revokeObjectURL(objectUrl);
    throw err;
  }
};

/**
 * Downscale + compress an image File to a data URL.
 *
 * Never upscales: an image already under maxDimension keeps its pixel
 * dimensions and is only re-encoded.
 *
 * @returns {Promise<{dataUrl: string, width: number, height: number,
 *                    originalBytes: number, compressedBytes: number}>}
 */
export const compressImageFile = async (file, options = {}) => {
  const {
    maxDimension = DEFAULT_MAX_DIMENSION,
    quality = DEFAULT_QUALITY,
    mimeType = "image/jpeg",
  } = options;

  if (!file) throw new Error("No file provided.");
  if (!file.type?.startsWith("image/")) {
    throw new Error("That file doesn't look like an image.");
  }

  const decoded = await decodeImage(file);

  try {
    const { source, width: srcW, height: srcH } = decoded;
    if (!srcW || !srcH) throw new Error("That image appears to be empty.");

    const scale = Math.min(1, maxDimension / Math.max(srcW, srcH));
    const outW = Math.max(1, Math.round(srcW * scale));
    const outH = Math.max(1, Math.round(srcH * scale));

    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Your browser couldn't process that image.");

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // JPEG has no alpha channel, so a transparent PNG would encode its
    // transparent pixels as black. Paint white first.
    if (mimeType === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, outW, outH);
    }

    ctx.drawImage(source, 0, 0, outW, outH);

    const dataUrl = canvas.toDataURL(mimeType, quality);
    if (!dataUrl || dataUrl === "data:,") {
      throw new Error("Your browser couldn't encode that image.");
    }

    return {
      dataUrl,
      width: outW,
      height: outH,
      originalBytes: file.size || 0,
      compressedBytes: dataUrlBytes(dataUrl),
    };
  } finally {
    decoded.release?.();
  }
};
