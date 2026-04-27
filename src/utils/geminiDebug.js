import { getApiStatus, isGeminiConfigured } from '../services/geminiService';

/**
 * Test Gemini Connection
 * Run this to debug Gemini API connectivity issues
 */
export const testGeminiConnection = async () => {
  console.log("🔍 Testing Gemini Connection...\n");

  // Step 1: Check if API key is configured
  const configured = isGeminiConfigured();
  console.log(`✓ API Key Configured: ${configured ? '✅ YES' : '❌ NO'}`);

  if (!configured) {
    console.error('❌ ERROR: VITE_GEMINI_API_KEY not found in .env.local');
    return false;
  }

  // Step 2: Test API connection
  console.log("\n📡 Testing API Connection...");
  const status = await getApiStatus();
  console.log(`✓ API Status:`, status);

  if (status.valid) {
    console.log("✅ SUCCESS: Gemini API is connected and working!");
    return true;
  } else {
    console.error("❌ ERROR: API Key is invalid or API is unreachable");
    console.error("Message:", status.message);
    if (status.details) {
      console.error("Details:", status.details);
    }
    return false;
  }
};

// Auto-run disabled to avoid background API usage.
