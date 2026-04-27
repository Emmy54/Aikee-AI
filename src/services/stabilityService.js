const USE_SERVER = import.meta.env.VITE_USE_SERVER !== "false";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const STABILITY_API_KEY = import.meta.env.VITE_STABILITY_API_KEY;

const apiFetch = (path, options) => fetch(`${API_BASE_URL}${path}`, options);

export const getStabilityStatus = async () => {
  if (USE_SERVER) {
    try {
      const response = await apiFetch("/api/stability/status", { method: "GET" });
      if (!response.ok) {
        return { configured: true, valid: false, message: "Status check failed" };
      }
      return await response.json();
    } catch (error) {
      return {
        configured: true,
        valid: false,
        message: `Connection error: ${error.message}`,
      };
    }
  }

  if (!STABILITY_API_KEY) {
    return { configured: false, valid: false, message: "API key not found in .env" };
  }

  return { configured: true, valid: true, message: "API key present" };
};

export const generateHeadshotWithStabilityAI = async (base64ImageData, customPrompt) => {
  if (!USE_SERVER && !STABILITY_API_KEY) {
    console.warn("⚠️ Stability AI API key not configured. Add VITE_STABILITY_API_KEY to .env.local");
    return null;
  }

  try {
    const prompt = customPrompt || `Professional LinkedIn corporate headshot, high-quality photography, 
    studio lighting, neutral background, business attire, photorealistic, sharp focus on face, 
    professional appearance, no filters`;

    console.log("🎨 Processing headshot with Stability AI SDXL...");

    const formData = new FormData();
    
    const byteCharacters = atob(base64ImageData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const imageBlob = new Blob([byteArray], { type: 'image/jpeg' });

    formData.append('image', imageBlob);
    formData.append('prompt', prompt);
    formData.append('output_format', 'jpeg');

    console.log("📤 Sending request to Stability AI...", { prompt });

    const response = USE_SERVER
      ? await apiFetch("/api/stability/headshot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base64ImageData,
            prompt,
            mimeType: "image/jpeg",
          }),
        })
      : await fetch(`https://api.stability.ai/v2beta/stable-image/generate/core`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${STABILITY_API_KEY}`,
            Accept: "image/*",
          },
          body: formData,
        });

    console.log("📨 Stability AI response status:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Stability AI Error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      return null;
    }

    if (USE_SERVER) {
      const data = await response.json();
      if (data?.image) {
        return `data:${data.mimeType || "image/jpeg"};base64,${data.image}`;
      }
      return null;
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.startsWith("image/")) {
      const arrayBuffer = await response.arrayBuffer();
      const base64 = btoa(
        String.fromCharCode(...new Uint8Array(arrayBuffer))
      );
      return `data:${contentType};base64,${base64}`;
    }

    const data = await response.json().catch(() => ({}));
    if (data?.image) {
      return `data:image/jpeg;base64,${data.image}`;
    }

    return null;
  } catch (error) {
    console.error("❌ Stability AI error:", error.message, error);
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
