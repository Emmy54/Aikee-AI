# Gemini Integration - Quick Reference Card

## 🎯 The Three Key Features

### 1️⃣ Skills Discovery (Step 2)

```
┌─────────────────────────────────┐
│ User answers 5 questions        │
│ ↓                               │
│ [✨ AI Generate] button         │
│ ↓                               │
│ Gemini analyzes answers + role  │
│ ↓                               │
│ Returns 5-7 relevant skills     │
│ ↓                               │
│ User clicks to add to CV        │
└─────────────────────────────────┘

Example Input:
- Q: "Have you managed teams?" A: "Yes, led 3 people"
- Q: "Data experience?" A: "Use Excel and Tableau"
- Role: "Product Manager"

Example Output:
["Team Leadership", "Data Analysis", "Product Strategy", "OKR Management"]
```

**Code Location**: `src/App.jsx` line ~600 (STEP 2 section)
**Service**: `generateSkillsFromGemini()` in `src/services/geminiService.js`

---

### 2️⃣ Experience Enhancement (Step 3)

```
┌──────────────────────────────────┐
│ User types raw experience        │
│ "Worked at uncle's phone shop"   │
│ ↓                                │
│ [✨] button appears (20+ chars)  │
│ ↓                                │
│ Gemini transforms with action    │
│ verbs + metrics + role alignment │
│ ↓                                │
│ Returns 3 professional bullets   │
│ ↓                                │
│ Live preview updates below       │
└──────────────────────────────────┘

Example Input:
"I helped manage my uncle's phone shop on weekends, handled customer calls and inventory"
Role: "Operations Manager"

Example Output:
[
  "• Managed daily operations and customer service for 50+ transactions weekly",
  "• Maintained accuracy in inventory tracking and cash reconciliation",
  "• Demonstrated strong communication skills resolving customer inquiries"
]
```

**Code Location**: `src/App.jsx` line ~750 (STEP 3 section)
**Service**: `enhanceExperienceWithGemini()` in `src/services/geminiService.js`

---

### 3️⃣ Professional Summary (Preview Step)

```
┌──────────────────────────────────┐
│ User reviews CV preview          │
│ ↓                                │
│ [✨ Refine Summary with AI] btn  │
│ ↓                                │
│ Gemini generates 2-3 sentence    │
│ summary based on all CV data     │
│ ↓                                │
│ Summary updates in CV            │
│ ↓                                │
│ User can download PDF            │
└──────────────────────────────────┘

Inputs:
- Name: "Jane Smith"
- Job Title: "Software Engineer"
- Company: "Google"
- Skills: ["Python", "AWS", "React", ...]
- Experiences: [...]

Example Output:
"Driven Software Engineer with strong expertise in Python and AWS cloud 
architecture. Proven track record leading technical initiatives with focus on 
scalability and performance. Committed to building innovative solutions at Google."
```

**Code Location**: `src/App.jsx` line ~950 (STEP 5 section)
**Service**: `generateProfessionalSummaryWithGemini()` in `src/services/geminiService.js`

---

## 🔧 File Structure

```
src/
├── App.jsx                     ← Main component with UI
├── services/
│   └── geminiService.js        ← All Gemini API calls
│       ├── generateSkillsFromGemini()
│       ├── enhanceExperienceWithGemini()
│       ├── generateHeadshotWithGemini()
│       ├── generateProfessionalSummaryWithGemini()
│       ├── isGeminiConfigured()
│       └── getApiStatus()
└── ... (other files)

Docs/
├── GEMINI_INTEGRATION.md       ← Detailed setup & architecture
├── SETUP_CHECKLIST.md          ← Step-by-step guide
├── CODE_EXAMPLES.js            ← Copy-paste snippets
└── QUICK_REFERENCE.md          ← This file
```

---

## ⚡ Quick Setup (3 Steps)

### Step 1: Get API Key
```bash
# Go to: https://aistudio.google.com/app/apikey
# Click "Create API Key"
# Copy the key
```

### Step 2: Add to .env.local
```bash
# Create file in root:
VITE_GEMINI_API_KEY=your_key_here
```

### Step 3: Start Server
```bash
npm run dev
```

---

## 🧪 Quick Test

### Test Skills Generation
1. Go to Step 2 "Skills"
2. Answer 2+ questions
3. Click "✨ AI Generate"
4. See skills appear ✓

### Test Experience Enhancement
1. Go to Step 3 "Experience"
2. Type 20+ character description
3. Click "✨" button
4. See bullets appear ✓

### Test Summary Generation
1. Go to Preview step
2. Click "✨ Refine Summary"
3. See new summary ✓

---

## 🌊 Data Flow

```
User Input
  ↓
Function Called (e.g., generateSkillsFromGemini)
  ↓
API Call to Gemini (POST request)
  ↓
Parse Response (extract JSON)
  ↓
Update React State
  ↓
Component Re-renders
  ↓
User Sees Results
```

---

## 📊 State Variables Involved

| Variable | Type | Used In | Purpose |
|----------|------|---------|---------|
| `geminiAvailable` | boolean | All steps | Is API key configured? |
| `loadingSkills` | boolean | Step 2 | Skills generating? |
| `loadingExperience` | object | Step 3 | Experience[i] generating? |
| `generatedSummary` | string | Preview | AI-generated summary |
| `geminiSkills` | array | Step 2 | Generated skills from API |
| `experienceBullets` | object | Step 3 | Bullets per experience |

---

## 🔄 API Request/Response Format

```javascript
// REQUEST to Gemini
{
  "contents": [{
    "parts": [{
      "text": "Your prompt here"
    }]
  }]
}

// RESPONSE from Gemini
{
  "candidates": [{
    "content": {
      "parts": [{
        "text": "Response text here"
      }]
    }
  }]
}
```

---

## 🚨 Error Handling

All three features automatically handle errors:

```javascript
try {
  const result = await generateXXX(...)
} catch (error) {
  // Return fallback values
  // App still works!
}
```

**Fallbacks**:
- Skills: `["Communication", "Problem Solving", "Adaptability"]`
- Experience: Template bullets with input text
- Summary: Template-based summary

---

## 💡 Gemini Model Details

**Model**: `gemini-1.5-flash`
- Latest & fastest Gemini model
- Perfect for real-time responses
- Handles JSON parsing well
- Free tier available

**API Endpoint**:
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
```

---

## 🎨 UI Indicators

The app shows Gemini status in multiple ways:

```
1. "✨ AI Generate" button    → Feature available (API configured)
2. "Generating..."           → API call in progress
3. Disabled buttons          → Loading in progress
4. No AI buttons             → API not configured
```

---

## 🔐 Security

- API key stored in `.env.local` (never in code)
- `.env.local` is in `.gitignore` (never committed)
- Keys unique per environment (dev/prod)
- No sensitive data sent to API beyond CV content

---

## 📈 Performance

| Operation | Time | Bottleneck |
|-----------|------|-----------|
| Skills Gen | 2-4s | Network |
| Exp Enhanced | 2-3s | Network |
| Summary Gen | 2-4s | Network |
| Headshot Gen | <1s | Local |

Network is always the bottleneck. First request may be 1-2s slower.

---

## 🚀 Deployment

```javascript
// Make sure to:
1. Build: npm run build
2. Set env variable on hosting platform:
   VITE_GEMINI_API_KEY=your_key
3. Deploy dist/ folder
```

Supported Platforms:
- ✅ Vercel
- ✅ Netlify  
- ✅ Firebase
- ✅ GitHub Pages (with API proxy)
- ✅ Any Node.js host

---

## 📞 Common Issues & Quick Fixes

| Issue | Fix |
|-------|-----|
| "API key not configured" | Check `.env.local` exists + has key |
| No "✨" buttons showing | Restart `npm run dev` |
| API timeout/slow | Check internet, try again |
| Wrong output quality | Provide longer/detailed input |
| JSON parse error | Retry, usually temporary |

---

## 🎓 Learning Resources

- **API Docs**: [ai.google.dev](https://ai.google.dev/)
- **Model Guide**: docs/models/gemini-1.5-flash
- **Examples**: Check `CODE_EXAMPLES.js`
- **Deep Dive**: Read `GEMINI_INTEGRATION.md`

---

## ✨ Feature Highlights

```
✓ Real-time skill suggestions
✓ Professional experience polishing
✓ AI-generated summaries
✓ Graceful fallbacks (works offline)
✓ Fast performance
✓ Secure API handling
✓ User-friendly UI
✓ No watermarks/tracking
```

---

**Quick Links**:
- 📖 [Full Guide](GEMINI_INTEGRATION.md)
- ✅ [Setup Checklist](SETUP_CHECKLIST.md)
- 💾 [Code Examples](CODE_EXAMPLES.js)

**Status**: ✅ Ready for Production
