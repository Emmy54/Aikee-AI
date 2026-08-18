import { authedPostJson, getJson } from "./apiClient";

// Stability (AI headshot) is server-only: the image + prompt go through
// /api/stability/headshot with the Supabase token attached, so the API key
// stays on the server and the beta allowlist is enforced. Not metered.

export const getStabilityStatus = async () => {
  const status = await getJson("/api/stability/status");
  if (!status) {
    return { configured: true, valid: false, message: "Status check failed" };
  }
  return status;
};

export const generateHeadshotWithStabilityAI = async (base64ImageData, customPrompt) => {
  try {
    const prompt = customPrompt || `Professional LinkedIn corporate headshot, high-quality photography,
    studio lighting, neutral background, business attire, photorealistic, sharp focus on face,
    professional appearance, no filters`;

    console.log("🎨 Processing headshot with Stability AI SDXL...");

    const data = await authedPostJson("/api/stability/headshot", {
      base64ImageData,
      prompt,
      mimeType: "image/jpeg",
    });

    if (data?.image) {
      return `data:${data.mimeType || "image/jpeg"};base64,${data.image}`;
    }
    return null;
  } catch (error) {
    // Headshot is an optional enhancement — never crash the flow. (This also
    // swallows auth/allowlist errors to null, which is fine here.)
    console.error("❌ Stability AI error:", error?.message || error);
    return null;
  }
};

export const generateHeadshotFromImage = (imageSrc, options = {}) => {
  const {
    size = 512,
    vignetteStrength = 0.18,
    blurAmount = 16,
    brightness = 0.9,
    contrast = 1.05,
    saturation = 1.08,
    highlight = 1.02,
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = size;
      canvas.height = size;

      const cropSize = Math.min(img.width, img.height);
      const x = (img.width - cropSize) / 2;
      let y = (img.height - cropSize) / 2;
      y = Math.max(0, Math.min(img.height - cropSize, y - cropSize * 0.12));

      ctx.save();
      ctx.filter = `blur(${blurAmount}px) brightness(${brightness})`;
      const bgScale = Math.max(size / img.width, size / img.height);
      const bgW = img.width * bgScale;
      const bgH = img.height * bgScale;
      const bgX = (size - bgW) / 2;
      const bgY = (size - bgH) / 2;
      ctx.drawImage(img, bgX, bgY, bgW, bgH);
      ctx.restore();

      ctx.save();
      ctx.filter = `contrast(${contrast}) saturate(${saturation}) brightness(${highlight})`;
      ctx.drawImage(img, x, y, cropSize, cropSize, 0, 0, size, size);
      ctx.restore();

      const gradient = ctx.createRadialGradient(
        size / 2,
        size * 0.47,
        size * 0.31,
        size / 2,
        size / 2,
        size
      );
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, `rgba(0,0,0,${vignetteStrength})`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, size - 2, size - 2);

      const processedSrc = canvas.toDataURL('image/jpeg', 0.9);
      resolve(processedSrc);
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imageSrc;
  });
};
